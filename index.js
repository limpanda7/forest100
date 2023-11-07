// 모듈 불러오기
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import schedule from 'node-schedule';
import {updateIcal} from "./updateIcal.js";

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

// 1분마다 ical 적재
if (process.env.NODE_ENV === "production") {
    const job = schedule.scheduleJob('* * * * *', () => {
        updateIcal('https://www.airbnb.co.kr/calendar/ical/43357745.ics?s=b2f3b0a34285a4574daf03fe3429f505', 'blon');
    })
}
