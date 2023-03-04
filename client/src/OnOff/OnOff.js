import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Helmet} from "react-helmet";
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import './OnOff.scss';
import OnOffReservation from "./OnOffReservation";
import OnOffIntro from "./OnOffIntro";
import OnOffCalendar from "./OnOffCalendar";
import {Link} from "react-router-dom";
import cn from 'classnames';
import OnOffReview from "./OnOffReview";

const OnOff = () => {
    const [currentPage, setCurrentPage] = useState('intro');
    const [reserved, setReserved] = useState([]);
    const [reservedName, setReservedName] = useState([]);
    const [reservedPhone, setReservedPhone] = useState([]);
    const [picked, setPicked] = useState([]);

    const getReserved = () => {
        axios.get('/api/getReserved2')
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
        <div className="OnOff">
            <Helmet>
                <title>::: 온오프스테이 :::</title>
            </Helmet>

            <div className='Header'>
                {
                    currentPage !== 'reservation' ?
                        <>
                            <Link className='BackWrap' to='/'>
                                ◀
                            </Link>
                            <div className='Path'>
                                ON OFF 스테이
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
                    <div
                        className={cn('Tab', {Active: currentPage === 'review'})}
                        onClick={() => setCurrentPage('review')}
                    >
                        후기
                    </div>
                </div>
            }

            {
                currentPage === 'intro' &&
                <OnOffIntro />
            }
            {
                currentPage === 'calendar' &&
                <OnOffCalendar
                    picked={picked}
                    setPicked={setPicked}
                    setCurrentPage={setCurrentPage}
                    getReserved={getReserved}
                    reserved={reserved}
                />
            }
            {
                currentPage === 'reservation' &&
                <OnOffReservation
                    picked={picked}
                    setPicked={setPicked}
                    setCurrentPage={setCurrentPage}
                    getReserved={getReserved}
                    reservedName={reservedName}
                    reservedPhone={reservedPhone}
                />
            }
            {
                currentPage === 'review' &&
                <OnOffReview />
            }
        </div>
    );
}

export default OnOff;
