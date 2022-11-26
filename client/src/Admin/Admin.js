import React, {useState, useEffect} from 'react';
import ReactModal from "react-modal";
import './Admin.scss';
import moment from "moment";
import Calendar from "react-calendar";
import axios from "axios";
import forest from "../Forest/Forest";

const Admin = () => {

    const [password, setPassword] = useState('');

    const [forestReserved, setForestReserved] = useState([]);
    const [forestPicked, setForestPicked] = useState('');
    const [forestAction, setForestAction] = useState('open');

    const [onOffReserved, setOnOffReserved] = useState([]);
    const [onOffPicked, setOnOffPicked] = useState('');
    const [onOffAction, setOnOffAction] = useState('open');

    const [target, setTarget] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getReserved();
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

    const forestCheck = () => {
        if (forestPicked === '') {
            alert('날짜를 선택해주세요!');
            return false;
        }

        setShowModal(true);
        setTarget('forest');
    }

    const onOffCheck = () => {
        if (onOffPicked === '') {
            alert('날짜를 선택해주세요!');
            return false;
        }

        setShowModal(true);
        setTarget('onOff');
    }

    const updateDb = () => {
        if (target === 'forest') {
            const params = {
                picked: forestPicked,
                action: forestAction
            }

            axios.post('/api/updateDb', params)
                .then(() => {
                    alert('적용되었습니다!');
                    setShowModal(false);
                    getReserved();
                })
        } else if (target === 'onOff') {
            const params = {
                picked: onOffPicked,
                action: onOffAction
            }

            axios.post('/api/updateDb2', params)
                .then(() => {
                    alert('적용되었습니다!');
                    setShowModal(false);
                    getReserved();
                })
        }
    }

    const modalStyle = {
        content: {
            width: '80%',
            maxWidth: '600px',
            maxHeight: '80%',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    if (password === '5769') {
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
                        setForestPicked(date.toISOString().split("T")[0])
                    }}
                />

                <br/>

                <div>
                    선택한 날짜 <b>{forestPicked}</b>를
                    <select onChange={(e) => setForestAction(e.target.value)}>
                        <option value='open'>열어주세요</option>
                        <option value='close'>닫아주세요</option>
                    </select>
                    <button className='GoBtn' onClick={() => forestCheck()}>GO!</button>
                </div>

                <br/>
                <hr/>

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
                        setOnOffPicked(date.toISOString().split("T")[0])
                    }}
                />

                <br/>

                <div>
                    선택한 날짜 <b>{onOffPicked}</b>를
                    <select onChange={(e) => setOnOffAction(e.target.value)}>
                        <option value='open'>열어주세요</option>
                        <option value='close'>닫아주세요</option>
                    </select>
                    <button className='GoBtn' onClick={() => onOffCheck()}>GO!</button>
                </div>

                <ReactModal
                    isOpen={showModal}
                    style={modalStyle}
                >
                    <div className='ModalTitle'>최종 확인</div>
                    <ul className='ModalList'>
                        {
                            target === 'forest' &&
                            <>
                                <li>백년한옥별채</li>
                                <li>{forestPicked}</li>
                                <li>{forestAction === 'open' ? '열어주세요' : '닫아주세요'}</li>
                            </>
                        }
                        {
                            target === 'onOff' &&
                            <>
                                <li>온오프스테이</li>
                                <li>{onOffPicked}</li>
                                <li>{onOffAction === 'open' ? '열어주세요' : '닫아주세요'}</li>
                            </>
                        }
                    </ul>
                    <div className='BtnWrap'>
                        <button className='ModalBtn' onClick={() => setShowModal(false)}>취소</button>
                        <button className='ModalBtn' onClick={() => updateDb()}>적용</button>
                    </div>
                </ReactModal>
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