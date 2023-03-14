import React, {useState} from 'react';
import axios from "axios";
import {Helmet} from "react-helmet";
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import './Blon.scss';
import BlonReservation from "./BlonReservation";
import BlonIntro from "./BlonIntro";
import BlonCalendar from "./BlonCalendar";
import {Link} from "react-router-dom";
import cn from 'classnames';

const Blon = () => {
    const [currentPage, setCurrentPage] = useState('intro');
    const [reserved, setReserved] = useState([]);
    const [reservedName, setReservedName] = useState([]);
    const [reservedPhone, setReservedPhone] = useState([]);
    const [picked, setPicked] = useState([]);

    const getReserved = () => {
        axios.get('/api/getReserved3')
            .then((res) => {
                let tempReserved = [];
                let tempReservedName = [];
                let tempReservedPhone = [];
                for (const element of res.data) {
                    tempReserved.push(moment(element.date).format('YYYY-MM-DD'));

                    if (!tempReservedName.includes(element.name)) {
                        tempReservedName.push(element.name);
                    }

                    if (!tempReservedPhone.includes(element.phone)) {
                        tempReservedPhone.push(element.phone);
                    }
                }
                setReserved(tempReserved);
                setReservedName(tempReservedName);
                setReservedPhone(tempReservedPhone);
            });
    }

    const goToHome = () => {
        setCurrentPage('calendar');
        setPicked([]);
    }

    return (
        <div className="Blon">
            <Helmet>
                <title>::: 블로뉴숲 :::</title>
            </Helmet>

            <div className='Header'>
                {
                    currentPage !== 'reservation' ?
                        <>
                            <Link className='BackWrap' to='/'>
                                ◀
                            </Link>
                            <div className='Path'>
                                블로뉴숲
                            </div>
                        </>
                        :
                        <div className='BackWrap' onClick={() => goToHome()}>
                            ◀
                            <span className='Back' >뒤로가기</span>
                        </div>
                }
            </div>

            {
                currentPage !== 'reservation' &&
                <div className='Tabs'>
                    <div
                        className={cn('Tab', {Active: currentPage === 'intro'})}
                        onClick={() => setCurrentPage('intro')}
                    >
                        소개
                    </div>
                    <div
                        className={cn('Tab', {Active: currentPage === 'calendar'})}
                        onClick={() => setCurrentPage('calendar')}
                    >
                        예약하기
                    </div>
                </div>
            }

            {
                currentPage === 'intro' &&
                <BlonIntro />
            }
            {
                currentPage === 'calendar' &&
                <BlonCalendar
                    picked={picked}
                    setPicked={setPicked}
                    setCurrentPage={setCurrentPage}
                    getReserved={getReserved}
                    reserved={reserved}
                />
            }
            {
                currentPage === 'reservation' &&
                <BlonReservation
                    picked={picked}
                    setPicked={setPicked}
                    setCurrentPage={setCurrentPage}
                    getReserved={getReserved}
                    reservedName={reservedName}
                    reservedPhone={reservedPhone}
                />
            }
        </div>
    );
}

export default Blon;
