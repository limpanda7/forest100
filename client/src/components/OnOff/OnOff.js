import React, {useEffect, useState} from 'react';
import 'react-calendar/dist/Calendar.css';
import OnOffReservation from "./OnOffReservation";
import OnOffIntro from "./OnOffIntro";
import OnOffCalendar from "./OnOffCalendar";
import OnOffReview from "./OnOffReview";
import {useNavigate, useSearchParams} from "react-router-dom";
import cn from 'classnames';
import Header from "../Header/Header";
import { useReservation } from '../../contexts/ReservationContext';

const OnOff = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [picked, setPicked] = useState([]);
  const navigate = useNavigate();
  
  // URL 쿼리 파라미터에서 currentPage 가져오기
  const currentPage = searchParams.get('page') || 'intro';
  
  // 전역 예약 상태 사용
  const { getReservationByTarget, getLoadingByTarget, error: isError } = useReservation();
  const reserved = getReservationByTarget('on_off');
  const isLoading = getLoadingByTarget('on_off');

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
    <div className="OnOff">
      <Header
        title='온오프 스테이'
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
            <div
              className={cn('Tab', {Active: currentPage === 'review'})}
              onClick={() => setCurrentPage('review')}
            >
              후기
            </div>
          </div>
        )
      }

      {
        currentPage === 'intro' &&
        <OnOffIntro/>
      }
      {
        currentPage === 'calendar' &&
        <OnOffCalendar
          picked={picked}
          setPicked={setPicked}
          setCurrentPage={setCurrentPage}
          isLoading={isLoading}
          isError={isError}
          reserved={reserved}
        />
      }
      {
        currentPage === "reservation" && (
          <OnOffReservation
            picked={picked}
            setPicked={setPicked}
            setCurrentPage={setCurrentPage}
          />
        )
      }
      {
        currentPage === 'review' &&
        <OnOffReview/>
      }
    </div>
  );
}

export default OnOff;
