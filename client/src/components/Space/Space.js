import React, {useEffect, useState} from 'react';
import 'react-calendar/dist/Calendar.css';
import SpaceReservation from "./SpaceReservation";
import SpaceIntro from "./SpaceIntro";
import SpaceCalendar from "./SpaceCalendar";
import {useNavigate, useSearchParams} from "react-router-dom";
import cn from 'classnames';
import Header from "../Header/Header";
import { useReservation } from '../../contexts/ReservationContext';
import './Space.scss';

const Space = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [picked, setPicked] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState([]);
  const navigate = useNavigate();
  
  // URL 쿼리 파라미터에서 currentPage 가져오기
  const currentPage = searchParams.get('page') || 'intro';
  
  // 전역 예약 상태 사용
  const { getReservationByTarget, getLoadingByTarget, error: isError } = useReservation();
  const reserved = getReservationByTarget('space');
  const isLoading = getLoadingByTarget('space');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const setCurrentPage = (page) => {
    setSearchParams({ page });
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
    <div className="Space">
      <Header
        title='온오프 스페이스'
        handleGoBack={handleGoBack}
      />

      {
        currentPage !== "reservation" && (
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
        )
      }

      {
        currentPage === 'intro' &&
        <SpaceIntro/>
      }
      {
        currentPage === 'calendar' &&
        <SpaceCalendar
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          setCurrentPage={setCurrentPage}
          isLoading={isLoading}
          isError={isError}
          reserved={reserved}
        />
      }
      {
        currentPage === 'reservation' && (
          <SpaceReservation
            date={date}
            time={time}
            setCurrentPage={setCurrentPage}
          />
        )
      }
    </div>
  );
}

export default Space;