import React, {useEffect, useState} from 'react';
import 'react-calendar/dist/Calendar.css';
import ForestReservation from "./ForestReservation";
import ForestIntro from "./ForestIntro";
import ForestCalendar from "./ForestCalendar";
import {useNavigate} from "react-router-dom";
import cn from 'classnames';
import Header from "../Header/Header";
import { useReservation } from '../../contexts/ReservationContext';

const Forest = () => {
  const [currentPage, setCurrentPage] = useState('intro');
  const [picked, setPicked] = useState([]);
  const navigate = useNavigate();
  
  // 전역 예약 상태 사용
  const { getReservationByTarget, loading: isLoading, error: isError } = useReservation();
  const reserved = getReservationByTarget('forest');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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
            onClick={() => {
              setCurrentPage('calendar');
            }}
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
          isError={isError}
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
