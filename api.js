import express from "express";
import mysql from "mysql";
import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import {forestMMS, onOffMMS, blonMMS, spaceMMS} from "./mms.js";
import 'dotenv/config';

const router = express.Router();

// 데이터베이스 연결
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  timezone: "utc",
});
connection.connect();

// 텔레그램 봇
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token);

/*
  공통 API
 */
router.get("/reservation/:target", (req, res) => {
  const {target} = req.params;

  let query;
  if (target === 'space') {
    query = 'SELECT date, checkin_time, checkout_time FROM space_reservation where date >= NOW() order by date';
  } else {
    query = `SELECT checkin_date, checkout_date FROM ${target}_reservation where checkout_date >= NOW() order by checkin_date`;
  }

  connection.query(
    query,
    (err, data) => {
      res.send(data);
    }
  );
});
router.get("/full-reservation/:target", (req, res) => {
  const {target} = req.params;
  connection.query(
    `SELECT * FROM ${target}_reservation where checkout_date >= NOW() order by checkin_date`,
    (err, data) => {
      res.send(data);
    }
  );
});
router.get("/ical/:target", (req, res) => {
  const {target} = req.params;
  connection.query(`SELECT * from ${target}_ical`, (err, data) => {
    res.send(data);
  });
});
router.delete("/reservation/:target/:id", (req, res) => {
  const {target, id} = req.params;
  connection.query(
    `DELETE FROM ${target}_reservation WHERE id = ?`,
    id,
    (err, data) => {
      res.send(data);
    }
  );
});

/*
  백년한옥별채 API
 */
router.post("/reservation/forest", (req, res) => {
  const {
    picked,
    name,
    phone,
    person,
    baby,
    dog,
    bedding,
    barbecue,
    price,
    priceOption,
  } = req.body;

  // 1. 예약내역 DB 추가
  let values = [];
  values.push([
    picked[0],
    picked[picked.length - 1],
    name,
    phone,
    person,
    baby,
    dog,
    bedding,
    barbecue,
    price,
    priceOption,
  ]);
  connection.query(
    "INSERT INTO forest_reservation (checkin_date, checkout_date, name, phone, person, baby, dog, bedding, barbecue, price, price_option) VALUES ?",
    [values],
    (err, data) => {
      res.send(data);

      // 2. 텔레그램 발송
      bot.sendMessage(
        process.env.TELEGRAM_CHAT_ID_FOREST,
        `백년한옥별채 신규 예약이 들어왔습니다.\n
기간: ${picked}\n
이름: ${name}\n
전화번호: ${phone}\n
인원수: ${person}명, 영유아 ${baby}명, 반려견 ${dog}마리\n
추가침구: ${bedding}개\n
바베큐 이용여부: ${barbecue}\n
이용금액: ${price.toLocaleString()}\n
환불옵션: ${priceOption === "refundable" ? "환불가능" : "환불불가"}`
      );
    }
  );

  // 3. 안내문자 발송
  axios
    .post(
      `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${process.env.MMS_APP_KEY}/sender/mms`,
      {
        title: "백년한옥별채 안내문자",
        body: forestMMS(picked, person, baby, dog, barbecue, price),
        sendNo: process.env.MMS_SEND_NO,
        recipientList: [{ recipientNo: phone }],
      },
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "X-Secret-Key": process.env.MMS_SECRET_KEY,
        },
      }
    )
    .then((axiosRes) => {
      if (axiosRes.data.header.resultMessage === "SUCCESS") {
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID_FOREST, "문자 발송에 성공하였습니다.");
      } else {
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID_FOREST, "문자 발송에 실패하였습니다.");
      }
    });
});

/*
  온오프스테이 API
 */
router.post("/reservation/on_off", (req, res) => {
  const {picked, name, phone, person, baby, dog, bedding, barbecue, price, priceOption} = req.body;

  // 1. 예약내역 DB 추가
  let values = [];
  values.push([
    picked[0],
    picked[picked.length - 1],
    name,
    phone,
    person,
    baby,
    dog,
    bedding,
    barbecue,
    price,
    priceOption,
  ]);
  connection.query(
    "INSERT INTO on_off_reservation (checkin_date, checkout_date, name, phone, person, baby, dog, bedding, barbecue, price, price_option) VALUES ?",
    [values],
    (err, data) => {
      res.send(data);

      // 2. 텔레그램 발송
      bot.sendMessage(
        process.env.TELEGRAM_CHAT_ID_ON_OFF,
        `온오프스테이 신규 예약이 들어왔습니다.\n
기간: ${picked}\n
이름: ${name}\n
전화번호: ${phone}\n
인원수: ${person}명, 영유아 ${baby}명, 반려견 ${dog}마리\n
추가침구: ${bedding}개\n
바베큐 이용여부: ${barbecue}\n
이용금액: ${price.toLocaleString()}\n
환불옵션: ${priceOption === "refundable" ? "환불가능" : "환불불가"}\n`
      );
    }
  );

  // 3. 안내문자 발송
  axios
    .post(
      `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${process.env.MMS_APP_KEY}/sender/mms`,
      {
        title: "온오프스테이 안내문자",
        body: onOffMMS(picked, person, baby, dog, barbecue, price),
        sendNo: process.env.MMS_SEND_NO,
        recipientList: [{ recipientNo: phone }],
      },
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "X-Secret-Key": process.env.MMS_SECRET_KEY,
        },
      }
    )
    .then((axiosRes) => {
      if (axiosRes.data.header.resultMessage === "SUCCESS") {
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID_ON_OFF, "문자 발송에 성공하였습니다.");
      } else {
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID_ON_OFF, "문자 발송에 실패하였습니다.");
      }
    });
});

/*
  블로뉴숲 API
 */
router.post("/reservation/blon", (req, res) => {
  const {
    picked,
    name,
    phone,
    person,
    baby,
    dog,
    bedding,
    barbecue,
    price,
    priceOption,
  } = req.body;

  // 1. 예약내역 DB 추가
  let values = [];
  values.push([
    picked[0],
    picked[picked.length - 1],
    name,
    phone,
    person,
    baby,
    dog,
    bedding,
    barbecue,
    price,
    priceOption,
  ]);
  connection.query(
    "INSERT INTO blon_reservation (checkin_date, checkout_date, name, phone, person, baby, dog, bedding, barbecue, price, price_option) VALUES ?",
    [values],
    (err, data) => {
      res.send(data);

      // 2. 텔레그램 발송
      bot.sendMessage(
        process.env.TELEGRAM_CHAT_ID_BLON,
        `블로뉴숲 신규 예약이 들어왔습니다.\n
기간: ${picked}\n
이름: ${name}\n
전화번호: ${phone}\n
인원수: ${person}명, 영유아 ${baby}명, 반려견 ${dog}마리\n
추가침구: ${bedding}개\n
바베큐 이용여부: ${barbecue}\n
이용금액: ${price.toLocaleString()}\n
환불옵션: ${priceOption === "refundable" ? "환불가능" : "환불불가"}\n`
      );
    }
  );

  // 3. 안내문자 발송
  axios
    .post(
      `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${process.env.MMS_APP_KEY}/sender/mms`,
      {
        title: "블로뉴숲 안내문자",
        body: blonMMS(picked, person, baby, dog, barbecue, price),
        sendNo: process.env.MMS_SEND_NO,
        recipientList: [{ recipientNo: phone }],
      },
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "X-Secret-Key": process.env.MMS_SECRET_KEY,
        },
      }
    )
    .then((axiosRes) => {
      if (axiosRes.data.header.resultMessage === "SUCCESS") {
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID_BLON, "문자 발송에 성공하였습니다.");
      } else {
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID_BLON, "문자 발송에 실패하였습니다.");
      }
    });
});

/*
  온오프스페이스 API
 */
router.post("/reservation/space", (req, res) => {
  const {
    date,
    time,
    name,
    phone,
    person,
    price,
    priceOption,
    purpose,
  } = req.body;

  // 1. 예약내역 DB 추가
  let values = [];
  values.push([
    date,
    time[0],
    time[time.length - 1] + 1,
    name,
    phone,
    person,
    purpose,
    price,
    priceOption,
  ]);
  connection.query(
    "INSERT INTO space_reservation (date, checkin_time, checkout_time, name, phone, person, purpose, price, price_option) VALUES ?",
    [values],
    (err, data) => {
      res.send(data);

      // 2. 텔레그램 발송
      bot.sendMessage(
        process.env.TELEGRAM_CHAT_ID_SPACE,
        `온오프스페이스 신규 예약이 들어왔습니다.\n
날짜: ${date}\n
시간: ${time[0]}:00 ~ ${time[time.length - 1] + 1}:00\n
이름: ${name}\n
전화번호: ${phone}\n
인원수: ${person}명\n
사용목적: ${purpose}\n
이용금액: ${price.toLocaleString()}\n
환불옵션: ${priceOption === "refundable" ? "환불가능" : "환불불가"}`
      );
    }
  );

  // 3. 안내문자 발송
  axios
    .post(
      `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${process.env.MMS_APP_KEY}/sender/mms`,
      {
        title: "온오프스페이스 안내문자",
        body: spaceMMS(date, time, person, purpose, price),
        sendNo: process.env.MMS_SEND_NO,
        recipientList: [{ recipientNo: phone }],
      },
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "X-Secret-Key": process.env.MMS_SECRET_KEY,
        },
      }
    )
    .then((axiosRes) => {
      if (axiosRes.data.header.resultMessage === "SUCCESS") {
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID_SPACE, "문자 발송에 성공하였습니다.");
      } else {
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID_SPACE, "문자 발송에 실패하였습니다.");
      }
    });
});

export default router;
