import React, {useState, useEffect} from 'react';
import './Admin.scss';
import moment from "moment";
import Calendar from "react-calendar";
import axios from "axios";

const Admin = () => {

    const [password, setPassword] = useState('1001');
    const [dbReserved, setDbReserved] = useState([]);
    const [airReserved, setAirReserved] = useState([]);
    const [airOnlyOut, setAirOnlyOut] = useState([]);
    const [picked, setPicked] = useState('');
    const [action, setAction] = useState('open');

    useEffect(() => {
        getReserved();
        getAirbnb();
    }, []);

    const getReserved = () => {
        axios.get('/api/getReserved')
            .then((res) => {
                let tempReserved = [];
                for (const element of res.data) {
                    tempReserved.push(moment(element.date).format('YYYY-MM-DD'));
                }
                setDbReserved(tempReserved);
            });
    };

    const getAirbnb = () => {
        axios.get('/api/getAirbnb')
            .then((res) => {
                let tempReserved = [];
                let tempOnlyOut = [];
                for (const element of res.data.reserved) {
                    tempReserved.push(element);
                }
                for (const element of res.data.onlyOut) {
                    tempOnlyOut.push(element);
                }
                setAirReserved(tempReserved);
                setAirOnlyOut(tempOnlyOut);
            })
    }

    const updateDb = () => {
        if (picked === '') {
            alert('날짜를 선택해주세요!');
            return false;
        }

        axios.post('/api/updateDb', {picked, action})
            .then(() => {
                alert('적용되었습니다!');
                getReserved();
            })
    }

    if (password === '1001') {
        return (
            <div className='Admin'>
                <h1>관리자 페이지</h1>

                <h2>현재 DB</h2>
                <Calendar
                    className='Calendar'
                    minDate={new Date()}
                    calendarType='US'
                    tileClassName={({ date }) => {
                        if(dbReserved.find(x => x === moment(date).format("YYYY-MM-DD"))){
                            return 'ReservedDay';
                        }
                    }}
                    onChange={(value) => {
                        const date = new Date(value);
                        date.setDate(date.getDate() + 1);
                        setPicked(date.toISOString().split("T")[0])
                    }}
                />

                <div>
                    선택한 날짜 {picked}를
                    <select onChange={(e) => setAction(e.target.value)}>
                        <option value='open'>열어주세요</option>
                        <option value='close'>닫아주세요</option>
                    </select>
                    <button className='GoBtn' onClick={updateDb}>GO!</button>
                </div>

                <h2>에어비앤비</h2>
                <Calendar
                    className='Calendar'
                    minDate={new Date()}
                    calendarType='US'
                    tileClassName={({ date }) => {
                        if(airReserved.find(x => x === moment(date).format("YYYY-MM-DD"))){
                            return 'ReservedDay';
                        }
                    }}
                    tileContent={({ date }) => {
                        if(airOnlyOut.find(x => x === moment(date).format("YYYY-MM-DD"))){
                            return <div className='OnlyOut'>퇴실만</div>;
                        }
                    }}
                />
            </div>
        );
    }

    return (
        <div>
            <input value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
    );
}

export default Admin;