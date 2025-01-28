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

export const updateIcal = (url, target) => {

  let chatId = null;
  if (target === 'forest') {
    chatId = process.env.TELEGRAM_CHAT_ID_FOREST;
  } else if (target === 'blon') {
    chatId = process.env.TELEGRAM_CHAT_ID_BLON;
  }

  try {
    ical.fromURL(
      url,
      {},
      (err, res) => {
        if (err) {
          console.error(`Failed to fetch iCal data: ${err}`);
          bot.sendMessage(chatId, `iCal 데이터 가져오기 실패: ${err.message}`);
          return;
        }

        if (!res) {
          console.error("Error: iCal response is undefined or null.");
          bot.sendMessage(chatId, `iCal 응답이 비어있습니다. 대상: ${target}`);
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
          console.log(`No data to insert for target: ${target}_ical`);
          bot.sendMessage(chatId, `iCal 데이터가 비어 있습니다 대상: ${target}`);
          return;
        }

        connection.query(`TRUNCATE TABLE ${target}_ical`, (truncateErr) => {
          if (truncateErr) {
            console.error(`Failed to truncate table: ${truncateErr}`);
            bot.sendMessage(chatId, `테이블 정리 실패: ${truncateErr.message}`);
            return;
          }

          connection.query(
            `INSERT INTO ${target}_ical (uid, start_dt, end_dt, status, reservation_id, phone_last_digits) VALUES ?`,
            [values],
            (insertErr) => {
              if (insertErr) {
                console.error(`Failed to insert data into ${target}_ical: ${insertErr}`);
                bot.sendMessage(chatId, `데이터 삽입 실패: ${insertErr.message}`);
              } else {
                console.log(`Successfully updated ${target}_ical with ${values.length} records.`);
              }
            }
          );
        })
      }
    )
  } catch (e) {
    console.error(`Error: updateIcal on ${target}: ${e.message}`);
  }
}
