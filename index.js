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
const port = process.env.PORT || 5000;
app.listen(port);
console.log(`server running at http ${port}`);

// 5분마다 ical 적재
if (process.env.NODE_ENV === "production") {
    const job = schedule.scheduleJob('*/5 * * * *', async () => {
        try {
            await updateIcal('https://www.airbnb.co.kr/calendar/ical/45390781.ics?s=0445b573c993602570eb6ba077995e5c', 'forest');
            // await updateIcal('https://www.airbnb.co.kr/calendar/ical/52828603.ics?s=f6ffa314abc34b142104f746fe97ee5b', 'on_off');
            await updateIcal('https://www.airbnb.co.kr/calendar/ical/43357745.ics?s=b2f3b0a34285a4574daf03fe3429f505', 'blon');
        } catch (err) {
            console.error(err);
        }
    })
}
