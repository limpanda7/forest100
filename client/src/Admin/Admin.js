import React, {useState, useEffect} from 'react';
import ReactModal from "react-modal";
import './Admin.scss';
import moment from "moment";
import Calendar from "react-calendar";
import axios from "axios";
import forest from "../Forest/Forest";

const Admin = () => {

    const [calendar, setCalendar] = useState('forest');
    const [password, setPassword] = useState('');

    const [forestReserved, setForestReserved] = useState([]);
    const [forestPicked, setForestPicked] = useState('');
    const [forestAction, setForestAction] = useState('open');

    const [onOffReserved, setOnOffReserved] = useState([]);
    const [onOffPicked, setOnOffPicked] = useState('');
    const [onOffAction, setOnOffAction] = useState('open');

    const [blonReserved, setBlonReserved] = useState([]);
    const [blonPicked, setBlonPicked] = useState('');
    const [blonAction, setBlonAction] = useState('open');

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
        axios.get('/api/getReserved3')
            .then((res) => {
                let tempReserved = [];
                for (const element of res.data) {
                    tempReserved.push(moment(element.date).format('YYYY-MM-DD'));
                }
                setBlonReserved(tempReserved);
            });
    };

    const login = () => {
      if (password === '5769') {
        if (calendar === 'forest' || calendar === 'onOff') {
          return true;
        }
      }

      if (password === '0125') {
        if (calendar === 'blon') {
          return true;
        }
      }

      return false;
    }

    const logout = () => {
      setPassword('');
      setCalendar('forest');
    }

    const forestCheck = () => {
        if (forestPicked === '') {
            alert('날짜를 선택해주세요!');
            return false;
        }
        setShowModal(true);
    }

    const onOffCheck = () => {
        if (onOffPicked === '') {
            alert('날짜를 선택해주세요!');
            return false;
        }
        setShowModal(true);
    }

    const blonCheck = () => {
        if (blonPicked === '') {
            alert('날짜를 선택해주세요!');
            return false;
        }
        setShowModal(true);
    }

    const updateDb = () => {
        if (calendar === 'forest') {
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
        } else if (calendar === 'onOff') {
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
        } else if (calendar === 'blon') {
            const params = {
                picked: blonPicked,
                action: blonAction
            }

            axios.post('/api/updateDb3', params)
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

    if (login()) {
        return (
            <div className='Admin'>
                <button onClick={logout}>뒤로</button>
                <br/><br/>
                {
                    calendar === 'forest' &&
                    <>
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
                    </>
                }
                {
                    calendar === 'onOff' &&
                    <>
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
                    </>
                }
                {
                    calendar === 'blon' &&
                    <>
                        <h2>블로뉴</h2>
                        <Calendar
                            className='Calendar'
                            minDate={new Date()}
                            calendarType='US'
                            tileClassName={({ date }) => {
                                if(blonReserved.find(x => x === moment(date).format("YYYY-MM-DD"))){
                                    return 'ReservedDay';
                                }
                            }}
                            onChange={(value) => {
                                const date = new Date(value);
                                date.setDate(date.getDate() + 1);
                                setBlonPicked(date.toISOString().split("T")[0])
                            }}
                        />

                        <br/>

                        <div>
                            선택한 날짜 <b>{forestPicked}</b>를
                            <select onChange={(e) => setBlonAction(e.target.value)}>
                                <option value='open'>열어주세요</option>
                                <option value='close'>닫아주세요</option>
                            </select>
                            <button className='GoBtn' onClick={() => blonCheck()}>GO!</button>
                        </div>
                    </>
                }

                <ReactModal
                    isOpen={showModal}
                    style={modalStyle}
                >
                    <div className='ModalTitle'>최종 확인</div>
                    <ul className='ModalList'>
                        {
                            calendar === 'forest' &&
                            <>
                                <li>백년한옥별채</li>
                                <li>{forestPicked}</li>
                                <li>{forestAction === 'open' ? '열어주세요' : '닫아주세요'}</li>
                            </>
                        }
                        {
                            calendar === 'onOff' &&
                            <>
                                <li>온오프스테이</li>
                                <li>{onOffPicked}</li>
                                <li>{onOffAction === 'open' ? '열어주세요' : '닫아주세요'}</li>
                            </>
                        }
                        {
                            calendar === 'blon' &&
                            <>
                                <li>블로뉴</li>
                                <li>{blonPicked}</li>
                                <li>{blonAction === 'open' ? '열어주세요' : '닫아주세요'}</li>
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
            숙소를 선택해주세요<br/>
            <select onChange={e => setCalendar(e.target.value)}>
                <option value='forest'>백년한옥별채</option>
                <option value='onOff'>온오프스테이</option>
                <option value='blon'>블로뉴</option>
            </select>
            <br/><br/>
            비밀번호를 입력해주세요<br/>
            <input value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
    );
}

export default Admin;
