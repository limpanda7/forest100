// 모듈 불러오기
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

// express 객체 생성
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

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
app.get('/api/getReserved', (req, res) => {
    connection.query('SELECT * FROM reservation', (err, data) => {
        res.send(data);
    });
});
app.post('/api/saveReservation', (req, res) => {
    const body = req.body;
    let values = [];
    for (const element of body.picked) {
        values.push([element, body.name, body.phone, body.adult, body.baby, body.dog, body.guestRoom, body.barbecue, body.barbecueEvent, body.price, body.priceOption, "N"]);
    }
    connection.query('INSERT INTO reservation (date, name, phone, adult, baby, dog, guest_room, barbecue, barbecue_event, price, price_option, confirm) VALUES ?', [values], (err, data) => {
        res.send(data);
        bot.sendMessage('-679453093',
`백년한옥별채 신규 예약이 들어왔습니다.\n
기간: ${body.picked}\n
이름: ${body.name}\n
전화번호: ${body.phone}\n
인원수: 성인 ${body.adult}명, 유아 ${body.baby}명, 반려견 ${body.dog}마리\n
사랑방 이용여부: ${body.guestRoom}\n
바베큐 이용여부: ${body.barbecue} (이벤트 참여: ${body.barbecueEvent === false ? 'X' : 'O'})\n
이용금액: ${body.price}\n
환불옵션: ${body.priceOption === 'refundable' ? '환불가능' : '환불불가'}`
        );
    });
})

// 온오프스테이 API
app.get('/api/getReserved2', (req, res) => {
    connection.query('SELECT * FROM reservation2', (err, data) => {
        res.send(data);
    });
});
app.post('/api/saveReservation2', (req, res) => {
    const body = req.body;
    let values = [];
    for (const element of body.picked) {
        values.push([element, body.name, body.phone, body.adult, body.baby, body.dog, body.bedding, body.barbecue, body.studentEvent, body.price, body.priceOption, "N"]);
    }
    connection.query('INSERT INTO reservation2 (date, name, phone, adult, baby, dog, bedding, barbecue, student_event, price, price_option, confirm) VALUES ?', [values], (err, data) => {
        res.send(data);
        bot.sendMessage('-558393640',
`온오프스테이 신규 예약이 들어왔습니다.\n
기간: ${body.picked}\n
이름: ${body.name}\n
전화번호: ${body.phone}\n
인원수: 성인 ${body.adult}명, 유아 ${body.baby}명, 반려견 ${body.dog}마리\n
추가침구: ${body.bedding}개\n
바베큐 이용여부: ${body.barbecue}\n
대학생 평일할인: ${body.studentEvent}\n
이용금액: ${body.price}\n
환불옵션: ${body.priceOption === 'refundable' ? '환불가능' : '환불불가'}`
        );
    });
})

// 리액트 정적 파일 제공
app.use(express.static(path.join(__dirname, 'client/build')));

// 라우트 설정
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/public/index.html'));
});

// 기본 포트를 app 객체에 설정
const port = process.env.PORT || 5000;
app.listen(port);
console.log(`server running at http ${port}`);