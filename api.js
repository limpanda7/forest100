import express from "express";
import mysql from "mysql2/promise";
import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import {forestMMS, onOffMMS, blonMMS, spaceMMS, appleMMS} from "./mms.js";
import 'dotenv/config';

const router = express.Router();

const isDev = process.env.NODE_ENV !== 'production';

// 풀 대신 매번 새 커넥션 생성 함수
const getConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: "Asia/Seoul",
    acquireTimeout: 60000,
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
    const [data] = await connection.query(query);
    res.send(data);
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) await connection.end();
  }
});
router.get("/full-reservation/:target", async (req, res) => {
  const {target} = req.params;
  let connection;
  try {
    connection = await getConnection();
    const [data] = await connection.query(
      `SELECT * FROM ${target}_reservation where checkout_date >= NOW() order by checkin_date`
    );
    res.send(data);
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) await connection.end();
  }
});
router.get("/ical/:target", async (req, res) => {
  const {target} = req.params;
  let connection;
  try {
    connection = await getConnection();
    const [data] = await connection.query(`SELECT * from ${target}_ical`);
    res.send(data);
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) await connection.end();
  }
});
router.delete("/reservation/:target/:id", async (req, res) => {
  const {target, id} = req.params;
  let connection;
  try {
    connection = await getConnection();
    const [data] = await connection.query(
      `DELETE FROM ${target}_reservation WHERE id = ?`,
      [id]
    );
    res.send(data);
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) await connection.end();
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
    const [data] = await connection.query(
      "INSERT INTO forest_reservation (checkin_date, checkout_date, name, phone, person, baby, dog, bedding, barbecue, price, price_option) VALUES ?",
      [values]
    );
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
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) await connection.end();
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
    const [data] = await connection.query(
      "INSERT INTO on_off_reservation (checkin_date, checkout_date, name, phone, person, dog, price) VALUES ?",
      [values]
    );
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
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) await connection.end();
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
    const [data] = await connection.query(
      "INSERT INTO blon_reservation (checkin_date, checkout_date, name, phone, person, baby, dog, bedding, barbecue, price, price_option) VALUES ?",
      [values]
    );
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
      `환불옵션: ${priceOption === "refundable" ? "환불가능" : "환불불가"}\n`
    );
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) await connection.end();
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
    const [data] = await connection.query(
      "INSERT INTO space_reservation (date, checkin_time, checkout_time, name, phone, person, purpose, price, price_option) VALUES ?",
      [values]
    );
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
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) await connection.end();
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
    const [data] = await connection.query(
      "INSERT INTO apple_reservation (name, phone, five_kg, ten_kg, price, receiver_name, receiver_phone, address) VALUES ?",
      [values]
    );
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
  } catch (err) {
    console.error('[쿼리 에러]', err);
    res.status(500).send('예약 정보를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) await connection.end();
  }
});

export default router;
