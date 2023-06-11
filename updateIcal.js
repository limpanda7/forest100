import ical from "node-ical";
import moment from "moment";
import mysql from "mysql";

// 데이터베이스 연결
const connection = mysql.createConnection({
  host: 'bmlx3df4ma7r1yh4.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'u8chske93qphbtar',
  password: 'u74cik86q65ig2m6',
  database: 'g4qbaxkdt4mtekys',
  timezone: 'utc'
})
connection.connect();

export const updateIcal = (url, target) => {
  try {
    ical.fromURL(
      url,
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

        connection.query(`TRUNCATE TABLE ${target}_ical`, () => {
          connection.query(`INSERT INTO ${target}_ical (uid, start_dt, end_dt, status, phone_last_digits) VALUES ?`, [values]);
        })
      }
    )
  } catch (e) {
    console.log(`error: updateIcal on ${target}`);
  }
}