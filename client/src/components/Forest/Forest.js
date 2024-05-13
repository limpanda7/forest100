import React, {useEffect, useState} from 'react';
import axios from "axios";
import 'react-calendar/dist/Calendar.css';
import ForestReservation from "./ForestReservation";
import ForestIntro from "./ForestIntro";
import ForestCalendar from "./ForestCalendar";
import {useNavigate} from "react-router-dom";
import cn from 'classnames';
import Header from "../Header/Header";

const Forest = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('intro');
  const [reserved, setReserved] = useState([]);
  const [picked, setPicked] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getReserved();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const getReserved = async () => {
    const {data: homepageReserved} = await axios.get("/api/reservation/forest");
    const {data: airbnbReserved} = await axios.get("/api/ical/forest");

    let tempReserved = [];
    for (const element of homepageReserved) {
      tempReserved.push({
        checkin_date: new Date(
          new Date(element.checkin_date).toISOString().slice(0, -1)
        ).toString(),
        checkout_date: new Date(
          new Date(element.checkout_date).toISOString().slice(0, -1)
        ).toString(),
      });
    }
    for (const element of airbnbReserved) {
      tempReserved.push({
        checkin_date: new Date(
          new Date(element.start_dt).toISOString().slice(0, -1)
        ).toString(),
        checkout_date: new Date(
          new Date(element.end_dt).toISOString().slice(0, -1)
        ).toString(),
      });
    }
    setReserved(tempReserved);
    setIsLoading(false);
  };

  const handleGoBack = () => {
    if (currentPage === 'reservation') {
      setCurrentPage('calendar');
      setPicked([]);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="Forest">
      <Header
        title='백년한옥별채'
        handleGoBack={handleGoBack}
      />

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
        <ForestIntro/>
      }
      {
        currentPage === 'calendar' &&
        <ForestCalendar
          picked={picked}
          setPicked={setPicked}
          setCurrentPage={setCurrentPage}
          isLoading={isLoading}
          reserved={reserved}
        />
      }
      {
        currentPage === 'reservation' &&
        <ForestReservation
          picked={picked}
          setPicked={setPicked}
          setCurrentPage={setCurrentPage}
        />
      }
    </div>
  );
}

export default Forest;
