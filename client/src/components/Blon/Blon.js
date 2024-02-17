import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Helmet} from "react-helmet";
import 'react-calendar/dist/Calendar.css';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getReserved();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const getReserved = async () => {
    const pageReserved = await axios.get("/api/reservation/blon");
    const airbnbReserved = await axios.get("/api/ical/blon");

    let tempReserved = [];
    let tempReservedName = [];
    let tempReservedPhone = [];
    for (const element of pageReserved.data) {
      tempReserved.push({
        checkin_date: new Date(
          new Date(element.checkin_date).toISOString().slice(0, -1)
        ).toString(),
        checkout_date: new Date(
          new Date(element.checkout_date).toISOString().slice(0, -1)
        ).toString(),
      });

      if (!tempReservedName.includes(element.name)) {
        tempReservedName.push(element.name);
      }

      if (!tempReservedPhone.includes(element.phone)) {
        tempReservedPhone.push(element.phone);
      }
    }
    for (const element of airbnbReserved.data) {
      tempReserved.push({
        checkin_date: new Date(
          new Date(element.start_dt).toISOString().slice(0, -1)
        ).toString(),
        checkout_date: new Date(
          new Date(element.end_dt).toISOString().slice(0, -1)
        ).toString(),
      });

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
    setIsLoading(false);
  };

  const goToHome = () => {
    setCurrentPage('calendar');
    setPicked([]);
  }

  return (
    <div className="Blon">
      <Helmet>
        <title>::: 블로뉴숲 :::</title>
      </Helmet>

      <div className='header'>
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
              <span className='Back'>뒤로가기</span>
            </div>
        }
      </div>

      {
        currentPage !== 'reservation' &&
        <div className='tabs'>
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
        <BlonIntro/>
      }
      {
        currentPage === 'calendar' &&
        <BlonCalendar
          picked={picked}
          setPicked={setPicked}
          setCurrentPage={setCurrentPage}
          isLoading={isLoading}
          reserved={reserved}
        />
      }
      {
        currentPage === 'reservation' &&
        <BlonReservation
          picked={picked}
          setPicked={setPicked}
          setCurrentPage={setCurrentPage}
          reservedName={reservedName}
          reservedPhone={reservedPhone}
        />
      }
    </div>
  );
}

export default Blon;
