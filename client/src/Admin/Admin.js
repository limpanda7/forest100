import React, {useState, useEffect} from 'react';
import './Admin.scss';
import moment from "moment";
import Calendar from "react-calendar";
import axios from "axios";
import forest from "../Forest/Forest";

const Admin = () => {

    const [password, setPassword] = useState('');
    const [forestReserved, setForestReserved] = useState([]);
    const [onOffReserved, setOnOffReserved] = useState([]);
    const [picked, setPicked] = useState('');
    const [action, setAction] = useState('open');

    useEffect(() => {
        getReserved();
        // getAirbnb();
    }, []);

    const getReserved = () => {
        axios.get('/api/getReserved')
            .then((res) => {
                let tempReserved = [];
                for (const element of res.data) {
                    tempReserved.push(moment(element.date).format('YYYY-MM-DD'));
                }
                setForestReserved(tempReserved);
            });
        axios.get('/api/getReserved2')
            .then((res) => {
                let tempReserved = [];
                for (const element of res.data) {
                    tempReserved.push(moment(element.date).format('YYYY-MM-DD'));
                }
                setOnOffReserved(tempReserved);
            });
    };

    const updateDb = () => {
        if (picked === '') {
            alert('날짜를 선택해주세요!');
            return false;
        }

        if (password === '1001') {
            axios.post('/api/updateDb', {picked, action})
                .then(() => {
                    alert('적용되었습니다!');
                    getReserved();
                })
        } else if (password === '0192') {
            axios.post('/api/updateDb2', {picked, action})
                .then(() => {
                    alert('적용되었습니다!');
                    getReserved();
                })
        }
    }

    if (password === '1001') {
        return (
            <div className='Admin'>
                <h2>백년한옥별채</h2>
                <Calendar
                    className='Calendar'
                    minDate={new Date()}
                    calendarType='US'
                    tileClassName={({ date }) => {
                        if(forestReserved.find(x => x === moment(date).format("YYYY-MM-DD"))){
                            return 'ReservedDay';
                        }
                    }}
                    onChange={(value) => {
                        const date = new Date(value);
                        date.setDate(date.getDate() + 1);
                        setPicked(date.toISOString().split("T")[0])
                    }}
                />

                <br/>

                <div>
                    선택한 날짜 <b>{picked}</b>를
                    <select onChange={(e) => setAction(e.target.value)}>
                        <option value='open'>열어주세요</option>
                        <option value='close'>닫아주세요</option>
                    </select>
                    <button className='GoBtn' onClick={updateDb}>GO!</button>
                </div>
            </div>
        );
    }

    if (password === '0192') {
        return (
            <div className='Admin'>
                <h2>온오프스테이</h2>
                <Calendar
                    className='Calendar'
                    minDate={new Date()}
                    calendarType='US'
                    tileClassName={({ date }) => {
                        if(onOffReserved.find(x => x === moment(date).format("YYYY-MM-DD"))){
                            return 'ReservedDay';
                        }
                    }}
                    onChange={(value) => {
                        const date = new Date(value);
                        date.setDate(date.getDate() + 1);
                        setPicked(date.toISOString().split("T")[0])
                    }}
                />

                <br/>

                <div>
                    선택한 날짜 <b>{picked}</b>를
                    <select onChange={(e) => setAction(e.target.value)}>
                        <option value='open'>열어주세요</option>
                        <option value='close'>닫아주세요</option>
                    </select>
                    <button className='GoBtn' onClick={updateDb}>GO!</button>
                </div>
            </div>
        );
    }

    if (password === '2717') {
        return (
            <div className='Admin'>
                <h2>백년한옥별채</h2>
                <Calendar
                    className='Calendar'
                    minDate={new Date()}
                    calendarType='US'
                    tileClassName={({ date }) => {
                        if(forestReserved.find(x => x === moment(date).format("YYYY-MM-DD"))){
                            return 'ReservedDay';
                        }
                    }}
                    onChange={(value) => {
                        const date = new Date(value);
                        date.setDate(date.getDate() + 1);
                        setPicked(date.toISOString().split("T")[0])
                    }}
                />

                <h2>온오프스테이</h2>
                <Calendar
                    className='Calendar'
                    minDate={new Date()}
                    calendarType='US'
                    tileClassName={({ date }) => {
                        if(onOffReserved.find(x => x === moment(date).format("YYYY-MM-DD"))){
                            return 'ReservedDay';
                        }
                    }}
                    onChange={(value) => {
                        const date = new Date(value);
                        date.setDate(date.getDate() + 1);
                        setPicked(date.toISOString().split("T")[0])
                    }}
                />

                <br/>

                <div>
                    선택한 날짜 <b>{picked}</b>를
                    <select onChange={(e) => setAction(e.target.value)}>
                        <option value='open'>열어주세요</option>
                        <option value='close'>닫아주세요</option>
                    </select>
                    <button className='GoBtn' onClick={updateDb}>GO!</button>
                </div>
            </div>
        );
    }

    return (
        <div className='Admin'>
            비밀번호를 입력해주세요<br/>
            <input value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
    );
}

export default Admin;