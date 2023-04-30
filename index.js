// 모듈 불러오기
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from "mysql";
import ical from "node-ical";
import schedule from 'node-schedule';
import moment from "moment";

// 로컬 모듈
import router from './router.js';
import api from './api.js';

// express 객체 생성
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));
}

app.use('/', router);
app.use('/api', api);

// 기본 포트를 app 객체에 설정
const port = process.env.PORT || 12321;
app.listen(port);
console.log(`server running at http ${port}`);

// 데이터베이스 연결
const connection = mysql.createConnection({
    host: 'bmlx3df4ma7r1yh4.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'u8chske93qphbtar',
    password: 'u74cik86q65ig2m6',
    database: 'g4qbaxkdt4mtekys',
    timezone: 'utc'
})
connection.connect();

// 5분마다 ical 적재
if (process.env.NODE_ENV === "production") {
    const job = schedule.scheduleJob('*/5 * * * *', () => {
        ical.fromURL(
          'https://www.airbnb.co.kr/calendar/ical/52828603.ics?s=f6ffa314abc34b142104f746fe97ee5b',
          {},
          (err, res) => {
              let values = [];

              Object.keys(res).map(key => {
                  const {datetype, uid, start, end, summary, description} = res[key];

                  if (datetype === 'date') {
                      const startDt = moment(start).format('YYYY-MM-DD');
                      const endDt = moment(end).format('YYYY-MM-DD');
                      const phoneLastDigits = !!description ? description.slice(description.length - 4, description.length) : null;
                      const status = summary.startsWith('Airbnb') ? 'Not available' : summary;
                      values.push([uid, startDt, endDt, status, phoneLastDigits])
                  }
              });

              connection.query('TRUNCATE TABLE on_off_ical', () => {
                  connection.query('INSERT INTO on_off_ical (uid, start_dt, end_dt, status, phone_last_digits) VALUES ?', [values]);
              })
          }
        )
    })
}