import express from 'express';
import mysql from "mysql";
import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import {forestMMS, onOffMMS} from "./mms.js";
import moment from "moment";

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
router.get('/getAirbnb', (req, res) => {
    const resultMap = {
        reserved: [],
        onlyOut: []
    };

    axios.get(
        'https://www.airbnb.co.kr/api/v3/PdpAvailabilityCalendar?operationName=PdpAvailabilityCalendar&locale=ko&currency=KRW&variables=%7B%22request%22%3A%7B%22count%22%3A12%2C%22listingId%22%3A%2245390781%22%2C%22month%22%3A7%2C%22year%22%3A2022%7D%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%228f08e03c7bd16fcad3c92a3592c19a8b559a0d0855a84028d1163d4733ed9ade%22%7D%7D', {
            headers: {
                'x-airbnb-api-key': 'd306zoyjsyarp7ifhu67rjxn52tv0t20'
            }
        }).then((axiosRes) => {
        const calendarMonths = axiosRes.data.data.merlin.pdpAvailabilityCalendar.calendarMonths;
        const reserved = [];
        const onlyOut = [];
        calendarMonths.forEach((element) => {
            element.days.forEach((day) => {
                if (!day.available && !day.availableForCheckout) {
                    reserved.push(day.calendarDate);
                }

                if (!day.available && day.availableForCheckout) {
                    onlyOut.push(day.calendarDate);
                }
            })
        })

        resultMap.reserved = reserved;
        resultMap.onlyOut = onlyOut;

        res.send(resultMap);
    })
})
router.post('/saveReservation', (req, res) => {
    const {picked, name, phone, adult, baby, dog, bedding, guestRoom, barbecue, price, priceOption, revisit} = req.body;
    let values = [];
    for (const element of picked) {
        values.push([element, name, phone, adult, baby, dog, bedding, guestRoom, barbecue, price, priceOption, revisit, "N"]);
    }
    connection.query('INSERT INTO reservation (date, name, phone, adult, baby, dog, bedding, guest_room, barbecue, price, price_option, revisit, confirm) VALUES ?', [values], (err, data) => {
        res.send(data);
        bot.sendMessage('-679453093',
            `백년한옥별채 신규 예약이 들어왔습니다.\n
기간: ${picked}\n
이름: ${name}\n
전화번호: ${phone}\n
인원수: 성인 ${adult}명, 유아 ${baby}명, 반려견 ${dog}마리\n
추가침구: ${bedding}개\n
사랑방 이용여부: ${guestRoom}\n
바베큐 이용여부: ${barbecue}\n
이용금액: ${price}\n
환불옵션: ${priceOption === 'refundable' ? '환불가능' : '환불불가'}\n
재방문여부: ${revisit}`
        );
    });

    // 안내문자 발송
    axios.post('https://api-sms.cloud.toast.com/sms/v3.0/appKeys/KRoL3w8pZsaHJkVL/sender/mms',  {
        "title": "백년한옥별채 안내문자",
        "body": forestMMS(picked, adult, baby, dog, bedding, guestRoom, barbecue, price),
        "sendNo":"0264991922",
        "recipientList":[{ "recipientNo": phone }]
    }, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Secret-Key': 'MZ4nmv2P'
        }
    }).then((axiosRes) => {
        if (axiosRes.data.header.resultMessage === 'SUCCESS') {
            bot.sendMessage('-679453093', '문자 발송에 성공하였습니다.');
        } else {
            bot.sendMessage('-679453093', '문자 발송에 실패하였습니다.');
        }
    })
})
router.post('/updateDb', (req, res) => {
    const {picked, action} = req.body;
    if (action === 'open') {
        connection.query('DELETE FROM reservation WHERE date = ?', picked, (err, data) => {
            res.send(data);
        });
    }
    if (action === 'close') {
        connection.query('INSERT INTO reservation (date) VALUES (?)', picked, (err, data) => {
            res.send(data);
        });
    }
})

// 온오프스테이 API
router.get('/getReserved2', (req, res) => {
    connection.query('SELECT * FROM reservation2', (err, data) => {
        res.send(data);
    });
});
router.post('/saveReservation2', (req, res) => {
    const {picked, name, phone, adult, baby, dog, autoBedding, barbecue, studentEvent, price, priceOption, revisit, wholeUse} = req.body;
    let values = [];
    for (const element of picked) {
        values.push([element, name, phone, adult, baby, dog, autoBedding, barbecue, studentEvent, price, priceOption, revisit, wholeUse, "N"]);
    }
    connection.query('INSERT INTO reservation2 (date, name, phone, adult, baby, dog, bedding, barbecue, student_event, price, price_option, revisit, whole_use, confirm) VALUES ?', [values], (err, data) => {
        res.send(data);
        bot.sendMessage('-558393640',
            `온오프스테이 신규 예약이 들어왔습니다.\n
기간: ${picked}\n
이름: ${name}\n
전화번호: ${phone}\n
인원수: 성인 ${adult}명, 유아 ${baby}명, 반려견 ${dog}마리\n
추가침구: ${autoBedding}개\n
바베큐 이용여부: ${barbecue}\n
이용금액: ${price}\n
환불옵션: ${priceOption === 'refundable' ? '환불가능' : '환불불가'}\n
재방문여부: ${revisit}\n`
        );
    });

    // 안내문자 발송
    axios.post('https://api-sms.cloud.toast.com/sms/v3.0/appKeys/KRoL3w8pZsaHJkVL/sender/mms',  {
        "title": "온오프스테이 안내문자",
        "body": onOffMMS(picked, adult, baby, dog, barbecue, price),
        "sendNo":"0264991922",
        "recipientList":[{ "recipientNo": phone }]
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