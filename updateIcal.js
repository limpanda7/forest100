import ical from "node-ical";
import moment from "moment";
import mysql from "mysql2/promise";
import 'dotenv/config';
import TelegramBot from "node-telegram-bot-api";

// DB 연결
const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  timezone: 'Asia/Seoul',
});

// 텔레그램 봇
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token);

let errorCount = 0;
let alertSent = false;

export const updateIcal = async (url, target) => {
  try {
    const res = await new Promise((resolve, reject) => {
      ical.fromURL(url, {}, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    if (!res) {
      console.error(`iCal error: iCal response is empty for ${target}`);
      checkAndSendAlert(target, 'response empty');
      return;
    }

    const values = [];

    for (const key of Object.keys(res)) {
      const { datetype, uid, start, end, summary, description } = res[key];

      if (datetype === 'date') {
        let reservationId = null;
        if (description) {
          const regex = /Reservation URL: https:\/\/www\.airbnb\.com\/hosting\/reservations\/details\/(\w+)/;
          const match = description.match(regex);
          if (match && match.length > 1) {
            reservationId = match[1];
          }
        }

        const startDt = moment(start).format('YYYY-MM-DD');
        const endDt = moment(end).format('YYYY-MM-DD');
        const phoneLastDigits = description ? description.slice(-4) : null;
        const status = summary.startsWith('Airbnb') ? 'Not available' : summary;

        values.push([uid, startDt, endDt, status, reservationId, phoneLastDigits]);
      }
    }

    if (values.length === 0) {
      console.log(`iCal: No new data for ${target}`);
      return;
    }

    const query = `
      INSERT INTO ${target}_ical 
        (uid, start_dt, end_dt, status, reservation_id, phone_last_digits)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        start_dt = VALUES(start_dt),
        end_dt = VALUES(end_dt),
        status = VALUES(status),
        reservation_id = VALUES(reservation_id),
        phone_last_digits = VALUES(phone_last_digits)
    `;

    await connection.query(query, [values]);
    errorCount = 0;
    alertSent = false;
  } catch (e) {
    console.error(`❌ updateIcal failed for ${target}: ${e.message}`);
    checkAndSendAlert(target, e.message);
  }
};

// 텔레그램 알림
const checkAndSendAlert = (target, errorMessage = '') => {
  if (!alertSent) {
    errorCount += 1;

    if (errorCount >= 3) {
      const fullMessage = `⚠️ 서버 상태 확인 필요\n${target}: ${errorMessage}`;
      bot.sendMessage(process.env.TELEGRAM_CHAT_ID_FOREST, fullMessage);
      alertSent = true;
    }
  }
};