import express from 'express';
import mysql from "mysql";
import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import mms from "./mms.js";

const router = express.Router();

// 데이터베이스 연결
const connection = mysql.createConnection({
    host: 'bmlx3df4ma7r1yh4.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'u8chske93qphbtar',
    password: 'u74cik86q65ig2m6',
    database: 'g4qbaxkdt4mtekys',
    timezone: 'utc'
})
connection.connect();

// 텔레그램 봇
const token = '1857829748:AAEQqFmUc4AWxad1-t1KRjQaXoXORjV91I4';
const bot = new TelegramBot(token, {polling: true});

// 백년한옥별채 API
router.get('/getReserved', (req, res) => {
    connection.query('SELECT * FROM reservation', (err, data) => {
        res.send(data);
    });
});
router.post('/saveReservation', (req, res) => {
    const body = req.body;
    let values = [];
    for (const element of body.picked) {
        values.push([element, body.name, body.phone, body.adult, body.baby, body.dog, body.bedding, body.guestRoom, body.barbecue, body.price, body.priceOption, body.revisit, "N"]);
    }
    connection.query('INSERT INTO reservation (date, name, phone, adult, baby, dog, bedding, guest_room, barbecue, price, price_option, revisit, confirm) VALUES ?', [values], (err, data) => {
        res.send(data);
        bot.sendMessage('-679453093',
            `백년한옥별채 신규 예약이 들어왔습니다.\n
기간: ${body.picked}\n
이름: ${body.name}\n
전화번호: ${body.phone}\n
인원수: 성인 ${body.adult}명, 유아 ${body.baby}명, 반려견 ${body.dog}마리\n
추가침구: ${body.bedding}개\n
사랑방 이용여부: ${body.guestRoom}\n
바베큐 이용여부: ${body.barbecue}\n
이용금액: ${body.price}\n
환불옵션: ${body.priceOption === 'refundable' ? '환불가능' : '환불불가'}\n
재방문여부: ${body.revisit}`
        );
    });
})

// 온오프스테이 API
router.get('/getReserved2', (req, res) => {
    connection.query('SELECT * FROM reservation2', (err, data) => {
        res.send(data);
    });
});
router.post('/saveReservation2', (req, res) => {
    const body = req.body;
    let values = [];
    for (const element of body.picked) {
        values.push([element, body.name, body.phone, body.adult, body.baby, body.dog, body.bedding, body.barbecue, body.studentEvent, body.price, body.priceOption, body.revisit, body.wholeUse, "N"]);
    }
    connection.query('INSERT INTO reservation2 (date, name, phone, adult, baby, dog, bedding, barbecue, student_event, price, price_option, revisit, whole_use, confirm) VALUES ?', [values], (err, data) => {
        res.send(data);
        bot.sendMessage('-558393640',
            `온오프스테이 신규 예약이 들어왔습니다.\n
기간: ${body.picked}\n
이름: ${body.name}\n
전화번호: ${body.phone}\n
인원수: 성인 ${body.adult}명, 유아 ${body.baby}명, 반려견 ${body.dog}마리\n
추가침구: ${body.bedding}개\n
바베큐 이용여부: ${body.barbecue}\n
이용금액: ${body.price}\n
환불옵션: ${body.priceOption === 'refundable' ? '환불가능' : '환불불가'}\n
재방문여부: ${body.revisit}\n`
        );
    });

    // 안내문자 발송
    axios.post('https://api-sms.cloud.toast.com/sms/v3.0/appKeys/KRoL3w8pZsaHJkVL/sender/mms',  {
        "title": "온오프스테이 안내문자",
        "body": mms(body.price),
        "sendNo":"0264991922",
        "recipientList":[{ "recipientNo": body.phone }]
    }, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Secret-Key': 'MZ4nmv2P'
        }
    }).then((axiosRes) => {
        if (axiosRes.data.header.resultMessage === 'SUCCESS') {
            bot.sendMessage('-558393640', '문자 발송에 성공하였습니다.');
        } else {
            bot.sendMessage('-558393640', '문자 발송에 실패하였습니다.');
        }
    })
})

export default router;