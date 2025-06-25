import ical from "node-ical";
import moment from "moment";
import mysql from "mysql2/promise";
import 'dotenv/config';
import TelegramBot from "node-telegram-bot-api";

// 풀 대신 매번 새 커넥션 생성 함수
const getConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: '+09:00',
  });
};

// 텔레그램 봇
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token);

let errorCount = 0;
let alertSent = false;

export const updateIcal = async (url, target) => {
  let connection = null;
  
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

    // 연결 풀에서 연결 획득
    connection = await getConnection();

    // 트랜잭션 시작
    await connection.beginTransaction();

    try {
      // 1. 기존 데이터 백업 (선택사항)
      const [backupData] = await connection.query(`SELECT * FROM ${target}_ical`);
      console.log(`Backup: ${backupData.length} records from ${target}_ical`);

      // 2. 테이블 전체 삭제
      await connection.query(`TRUNCATE TABLE ${target}_ical`);
      console.log(`Truncated ${target}_ical table`);

      // 3. 새로운 데이터 삽입
      if (values.length > 0) {
        const insertQuery = `
          INSERT INTO ${target}_ical 
            (uid, start_dt, end_dt, status, reservation_id, phone_last_digits)
          VALUES ?
        `;
        await connection.query(insertQuery, [values]);
        console.log(`Inserted ${values.length} records into ${target}_ical`);
      }

      // 4. 트랜잭션 커밋
      await connection.commit();
      
      // 5. 변경사항 로깅
      const deletedCount = backupData.length - values.length;
      if (deletedCount > 0) {
        console.log(`Deleted ${deletedCount} cancelled reservations from ${target}_ical`);
      }

      errorCount = 0;
      alertSent = false;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      // 연결 반환 (중요!)
      await connection.end();
    }

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