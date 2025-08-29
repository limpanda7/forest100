import React, {useEffect, useState} from 'react';
import 'react-calendar/dist/Calendar.css';
import BlonReservation from "./BlonReservation";
import BlonIntro from "./BlonIntro";
import BlonCalendar from "./BlonCalendar";
import {useNavigate, useSearchParams} from "react-router-dom";
import cn from 'classnames';
import Header from "../Header/Header";
import { useReservation } from '../../contexts/ReservationContext';

const Blon = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [picked, setPicked] = useState([]);
  const navigate = useNavigate();
  
  // URL 쿼리 파라미터에서 currentPage 가져오기
  const currentPage = searchParams.get('page') || 'intro';
  
  // 전역 예약 상태 사용
  const { getReservationByTarget, getLoadingByTarget, error: isError } = useReservation();
  const reserved = getReservationByTarget('blon');
  const isLoading = getLoadingByTarget('blon');

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
    <div className="Blon">
      <Header
        title='블로뉴숲'
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
        <BlonIntro/>
      }
      {
        currentPage === 'calendar' &&
        <BlonCalendar
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
        <BlonReservation
          picked={picked}
          setPicked={setPicked}
          setCurrentPage={setCurrentPage}
        />
      }
    </div>
  );
}

export default Blon;
