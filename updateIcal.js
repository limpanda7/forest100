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
const MAX_ERROR_COUNT = 3;

export const updateIcal = (url, target) => {

  try {
    ical.fromURL(
      url,
      {},
      (err, res) => {
        if (err) {
          console.error(`Failed to fetch iCal data for ${target}: ${err.message}`);
          errorCount += 1;
          checkAndSendAlert();
          return;
        }

        if (!res) {
          console.error(`iCal response is empty for ${target}`);
          errorCount += 1;
          checkAndSendAlert();
          return;
        }

        let values = [];

        Object.keys(res).forEach(key => {
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
        });


        if (values.length === 0) {
          console.log(`No data to insert for ${target}_ical`);
          errorCount += 1;
          checkAndSendAlert();
          return;
        }

        connection.query(`TRUNCATE TABLE ${target}_ical`, (truncateErr) => {
          if (truncateErr) {
            console.error(`Failed to truncate table ${target}_ical: ${truncateErr.message}`);
            errorCount += 1;
            checkAndSendAlert();
            return;
          }

          connection.query(
            `INSERT INTO ${target}_ical (uid, start_dt, end_dt, status, reservation_id, phone_last_digits) VALUES ?`,
            [values],
            (insertErr) => {
              if (insertErr) {
                console.error(`Failed to insert data into ${target}_ical: ${insertErr.message}`);
                errorCount += 1;
                checkAndSendAlert();
              } else {
                errorCount = 0;
                alertSent = false;
              }
            }
          );
        });
      }
    );
  } catch (e) {
    console.error(`Error in updateIcal for ${target}: ${e.message}`);
    errorCount += 1;
    checkAndSendAlert();
  }
};

// 특정 횟수 이상 오류 발생 시 통합 알림 전송
const checkAndSendAlert = () => {
  if (errorCount >= MAX_ERROR_COUNT && !alertSent) {
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID_FOREST, `⚠️서버 상태를 확인하세요`);
    alertSent = true; // 한 번만 알림을 보내도록 설정
  }
};
