import ical from "node-ical";
import moment from "moment";
import mysql from "mysql";
import 'dotenv/config';
import TelegramBot from "node-telegram-bot-api";

// 데이터베이스 연결
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  timezone: 'Asia/Seoul'
})
connection.connect();

// 텔레그램 봇
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token);

let errorCount = 0;
let alertSent = false;

export const updateIcal = (url, target) => {

  try {
    ical.fromURL(
      url,
      {},
      (err, res) => {
        try {
          if (err) {
            console.error(`iCal error: Failed to fetch iCal data for ${target}: ${err.message}`);
            checkAndSendAlert(target, `fetch error - ${err.message}`);
            return;
          }

          if (!res) {
            console.error(`iCal error: iCal response is empty for ${target}`);
            checkAndSendAlert(target, 'response empty');
            return;
          }

          let values = [];

          for (const key of Object.keys(res)) {
            try {
              const {datetype, uid, start, end, summary, description} = res[key];
              let reservationId = null;

              if (datetype === 'date') {
                if (!!description) {
                  const regex = /Reservation URL: https:\/\/www\.airbnb\.com\/hosting\/reservations\/details\/(\w+)/;
                  const match = description.match(regex);

                  if (match && match.length > 1) {
                    reservationId = match[1];
                  }
                }

                const startDt = moment(start).format('YYYY-MM-DD');
                const endDt = moment(end).format('YYYY-MM-DD');
                const phoneLastDigits = !!description ? description.slice(description.length - 4, description.length) : null;
                const status = summary.startsWith('Airbnb') ? 'Not available' : summary;

                values.push([uid, startDt, endDt, status, reservationId, phoneLastDigits]);
              }
            } catch (e) {
              console.warn(`⚠️ Error parsing single entry: ${e.message}`);
              checkAndSendAlert(target, `entry parse error - ${e.message}`);
            }
          }


          if (values.length === 0) {
            console.log(`iCal error: No data to insert for ${target}_ical`);
            checkAndSendAlert();
            return;
          }

          connection.query(
            `INSERT INTO ${target}_ical
                 (uid, start_dt, end_dt, status, reservation_id, phone_last_digits)
             VALUES ? ON DUPLICATE KEY
            UPDATE
                start_dt =
            VALUES (start_dt), end_dt =
            VALUES (end_dt), status =
            VALUES (status), reservation_id =
            VALUES (reservation_id), phone_last_digits =
            VALUES (phone_last_digits)
            `,
            [values],
            (insertErr) => {
              if (insertErr) {
                console.error(`iCal error: Failed to upsert data into ${target}_ical: ${insertErr.message}`);
                checkAndSendAlert(target, `db upsert error - ${insertErr.message}`);
              } else {
                errorCount = 0;
                alertSent = false;
              }
            }
          );
        } catch (innerErr) {
          console.error(`❌ Unexpected error in handler: ${innerErr.message}`);
          checkAndSendAlert(target, `handler error - ${innerErr.message}`);
        }
      }
    );
  } catch (e) {
    console.error(`iCal error: Error in updateIcal for ${target}: ${e.message}`);
    checkAndSendAlert();
  }
};

// 특정 횟수 이상 오류 발생 시 통합 알림 전송
const checkAndSendAlert = (target, errorMessage = '') => {
  if (!alertSent) {
    errorCount += 1;

    if (errorCount >= 3) {
      const fullMessage = `⚠️서버 상태를 확인하세요\n\n${target}: ${errorMessage}`;
      bot.sendMessage(process.env.TELEGRAM_CHAT_ID_FOREST, fullMessage);
      alertSent = true;
    }
  }
};
