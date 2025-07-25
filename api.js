import express from "express";
import mysql from "mysql";
import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import {forestMMS, onOffMMS, blonMMS, spaceMMS, appleMMS} from "./mms.js";
import 'dotenv/config';

const router = express.Router();

const isDev = process.env.NODE_ENV !== 'production';

// 연결 풀 생성 (mysql 패키지용)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  timezone: "Asia/Seoul",
  connectionLimit: 10, // 최대 연결 수 제한
  acquireTimeout: 60000, // 연결 획득 타임아웃
  timeout: 60000, // 쿼리 타임아웃
  reconnect: true, // 자동 재연결
  charset: 'utf8mb4'
});

// 연결 풀에서 연결 획득 함수
const getConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(connection);
    });
  });
};

// 텔레그램 봇
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token);

/*
  공통 API
 */
router.get("/reservation/:target", async (req, res) => {
  const {target} = req.params;
  let connection;
  try {
    connection = await getConnection();
    let query;
    if (target === 'space') {
      query = 'SELECT date, checkin_time, checkout_time FROM space_reservation where date >= CURDATE() order by date';
    } else {
      query = `SELECT checkin_date, checkout_date FROM ${target}_reservation where checkout_date >= NOW() order by checkin_date`;
    }
    
    const data = await new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    res.send(data);
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) {
      connection.release(); // 연결 풀로 반환
    }
  }
});

router.get("/full-reservation/:target", async (req, res) => {
  const {target} = req.params;
  let connection;
  try {
    connection = await getConnection();
    const data = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM ${target}_reservation where checkout_date >= NOW() order by checkin_date`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    res.send(data);
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.get("/ical/:target", async (req, res) => {
  const {target} = req.params;
  let connection;
  try {
    connection = await getConnection();
    const data = await new Promise((resolve, reject) => {
      connection.query(`SELECT * from ${target}_ical`, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    res.send(data);
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.delete("/reservation/:target/:id", async (req, res) => {
  const {target, id} = req.params;
  let connection;
  try {
    connection = await getConnection();
    const data = await new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM ${target}_reservation WHERE id = ?`,
        [id],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    res.send(data);
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

/*
  백년한옥별채 API
 */
router.post("/reservation/forest", async (req, res) => {
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
  let connection;
  try {
    connection = await getConnection();
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
    
    const data = await new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO forest_reservation (checkin_date, checkout_date, name, phone, person, baby, dog, bedding, barbecue, price, price_option) VALUES ?",
        [values],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    
    res.send(data);
    // 텔레그램 발송
    bot.sendMessage(
      process.env.TELEGRAM_CHAT_ID_FOREST,
      `백년한옥별채 신규 예약이 들어왔습니다.\n` +
      `\n` +
      `기간: ${picked}\n` +
      `\n` +
      `이름: ${name}\n` +
      `\n` +
      `전화번호: ${phone}\n` +
      `\n` +
      `인원수: ${person}명, 영유아 ${baby}명, 반려견 ${dog}마리\n` +
      `\n` +
      `추가침구: ${bedding}개\n` +
      `\n` +
      `바베큐 이용여부: ${barbecue}\n` +
      `\n` +
      `이용금액: ${price.toLocaleString()}\n` +
      `\n` +
      `환불옵션: ${priceOption === "refundable" ? "환불가능" : "환불불가"}`
    );

    // 3. 안내문자 발송
    axios
      .post(
        `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${process.env.MMS_APP_KEY}/sender/mms`,
        {
          title: "백년한옥별채 안내문자",
          body: forestMMS(picked, person, baby, dog, barbecue, price),
          sendNo: process.env.MMS_SEND_NO,
          recipientList: [{recipientNo: phone}],
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
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

/*
  온오프스테이 API
 */
router.post("/reservation/on_off", async (req, res) => {
  const {picked, name, phone, person, dog, price} = req.body;
  let connection;
  try {
    connection = await getConnection();
    let values = [];
    values.push([
      picked[0],
      picked[picked.length - 1],
      name,
      phone,
      person,
      dog,
      price,
    ]);
    
    const data = await new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO on_off_reservation (checkin_date, checkout_date, name, phone, person, dog, price) VALUES ?",
        [values],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    
    res.send(data);
    // 텔레그램 발송
    bot.sendMessage(
      process.env.TELEGRAM_CHAT_ID_ON_OFF,
      `온오프스테이 신규 계약이 들어왔습니다.\n` +
      `\n` +
      `기간: ${picked[0]} ~ ${picked[picked.length - 1]}\n` +
      `\n` +
      `이름: ${name}\n` +
      `\n` +
      `전화번호: ${phone}\n` +
      `\n` +
      `인원수: ${person}명, 반려견 ${dog}마리\n` +
      `\n` +
      `이용금액: ${price.toLocaleString()}\n`
    );

    // 3. 안내문자 발송
    axios
      .post(
        `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${process.env.MMS_APP_KEY}/sender/mms`,
        {
          title: "온오프스테이 안내문자",
          body: onOffMMS(picked, person, dog, price),
          sendNo: process.env.MMS_SEND_NO,
          recipientList: [{recipientNo: phone}],
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
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

/*
  블로뉴숲 API
 */
router.post("/reservation/blon", async (req, res) => {
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
  let connection;
  try {
    connection = await getConnection();
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
    
    const data = await new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO blon_reservation (checkin_date, checkout_date, name, phone, person, baby, dog, bedding, barbecue, price, price_option) VALUES ?",
        [values],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    
    res.send(data);
    // 텔레그램 발송
    bot.sendMessage(
      process.env.TELEGRAM_CHAT_ID_BLON,
      `블로뉴숲 신규 예약이 들어왔습니다.\n` +
      `\n` +
      `기간: ${picked}\n` +
      `\n` +
      `이름: ${name}\n` +
      `\n` +
      `전화번호: ${phone}\n` +
      `\n` +
      `인원수: ${person}명, 영유아 ${baby}명, 반려견 ${dog}마리\n` +
      `\n` +
      `추가침구: ${bedding}개\n` +
      `\n` +
      `바베큐 이용여부: ${barbecue}\n` +
      `\n` +
      `이용금액: ${price.toLocaleString()}\n` +
      `\n` +
      `환불옵션: ${priceOption === "refundable" ? "환불가능" : "환불불가"}`
    );

    // 3. 안내문자 발송
    axios
      .post(
        `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${process.env.MMS_APP_KEY}/sender/mms`,
        {
          title: "블로뉴숲 안내문자",
          body: blonMMS(picked, person, baby, dog, barbecue, price),
          sendNo: process.env.MMS_SEND_NO,
          recipientList: [{recipientNo: phone}],
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
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

/*
  온오프스페이스 API
 */
router.post("/reservation/space", async (req, res) => {
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
  let connection;
  try {
    connection = await getConnection();
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
    
    const data = await new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO space_reservation (date, checkin_time, checkout_time, name, phone, person, purpose, price, price_option) VALUES ?",
        [values],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    
    res.send(data);
    // 텔레그램 발송
    bot.sendMessage(
      process.env.TELEGRAM_CHAT_ID_SPACE,
      `온오프스페이스 신규 예약이 들어왔습니다.\n` +
      `\n` +
      `날짜: ${date}\n` +
      `\n` +
      `시간: ${time[0]}:00 ~ ${time[time.length - 1] + 1}:00\n` +
      `\n` +
      `이름: ${name}\n` +
      `\n` +
      `전화번호: ${phone}\n` +
      `\n` +
      `인원수: ${person}명\n` +
      `\n` +
      `사용목적: ${purpose}\n` +
      `\n` +
      `이용금액: ${price.toLocaleString()}\n` +
      `\n` +
      `환불옵션: ${priceOption === "refundable" ? "환불가능" : "환불불가"}`
    );

    // 3. 안내문자 발송
    axios
      .post(
        `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${process.env.MMS_APP_KEY}/sender/mms`,
        {
          title: "온오프스페이스 안내문자",
          body: spaceMMS(date, time, person, purpose, price),
          sendNo: process.env.MMS_SEND_NO,
          recipientList: [{recipientNo: phone}],
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
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

/*
  사과 API
 */
router.post("/reservation/apple", async (req, res) => {
  const {
    name,
    phone,
    fiveKg,
    tenKg,
    price,
    receiverName,
    receiverPhone,
    address,
  } = req.body;
  let connection;
  try {
    connection = await getConnection();
    let values = [];
    values.push([
      name,
      phone,
      fiveKg,
      tenKg,
      price,
      receiverName,
      receiverPhone,
      address,
    ]);
    
    const data = await new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO apple_reservation (name, phone, five_kg, ten_kg, price, receiver_name, receiver_phone, address) VALUES ?",
        [values],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    
    res.send(data);
    // 텔레그램 발송
    bot.sendMessage(
      process.env.TELEGRAM_CHAT_ID_APPLE,
      `사과 예약이 들어왔습니다.\n` +
      `\n` +
      `예약자 이름: ${name}\n` +
      `예약자 전화번호: ${phone}\n` +
      `\n` +
      `5 kg: ${fiveKg}박스\n` +
      `10 kg: ${tenKg}박스\n` +
      `금액: ${price.toLocaleString()}\n` +
      `\n` +
      `받는사람 이름: ${receiverName}\n` +
      `받는사람 전화번호: ${receiverPhone}\n` +
      `받는사람 주소: ${address}`
    );

    // 3. 안내문자 발송
    axios
      .post(
        `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${process.env.MMS_APP_KEY}/sender/mms`,
        {
          title: "백년한옥사과 안내문자",
          body: appleMMS(name, phone, fiveKg, tenKg, price, receiverName, receiverPhone, address),
          sendNo: process.env.MMS_SEND_NO,
          recipientList: [{recipientNo: phone}],
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
          bot.sendMessage(process.env.TELEGRAM_CHAT_ID_APPLE, "문자 발송에 성공하였습니다.");
        } else {
          bot.sendMessage(process.env.TELEGRAM_CHAT_ID_APPLE, "문자 발송에 실패하였습니다.");
        }
      });
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

export default router;