import ical from "node-ical";
import moment from "moment";
import mysql from "mysql";
import 'dotenv/config';

// 데이터베이스 연결
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  timezone: 'Asia/Seoul'
})
connection.connect();

export const updateIcal = (url, target) => {
  try {
    ical.fromURL(
      url,
      {},
      (err, res) => {
        if (err) {
          console.error(`Failed to fetch iCal data: ${err}`);
          return;
        }

        if (!res) {
          console.error("Error: iCal response is undefined or null.");
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
          return;
        }

        connection.query(`TRUNCATE TABLE ${target}_ical`, (truncateErr) => {
          if (truncateErr) {
            console.error(`Failed to truncate table: ${truncateErr}`);
            return;
          }

          connection.query(
            `INSERT INTO ${target}_ical (uid, start_dt, end_dt, status, reservation_id, phone_last_digits) VALUES ?`,
            [values],
            (insertErr) => {
              if (insertErr) {
                console.error(`Failed to insert data into ${target}_ical: ${insertErr}`);
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