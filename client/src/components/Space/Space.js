import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import cn from "classnames";
import SpaceIntro from "./SpaceIntro";
import SpaceCalendar from "./SpaceCalendar";
import SpaceReservation from "./SpaceReservation";
import Header from "../Header/Header";
import { useReservation } from '../../contexts/ReservationContext';
import './Space.scss';

const Space = () => {
  const [currentPage, setCurrentPage] = useState('intro');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const navigate = useNavigate();
  
  // 전역 예약 상태 사용
  const { getReservationByTarget, loading: isLoading, error: isError } = useReservation();
  const reserved = getReservationByTarget('space');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleGoBack = () => {
    if (currentPage === 'reservation') {
      setCurrentPage("calendar");
      setDate(null);
      setTime([]);
    } else {
      navigate('/');
    }
  };
  
  return (
    <div className='Space'>
      <Header
        title='온오프스페이스'
        handleGoBack={handleGoBack}
      />

      {currentPage !== "reservation" && (
        <div className="tabs">
          <div
            className={cn("Tab", { Active: currentPage === 'intro' })}
            onClick={() => setCurrentPage('intro')}
          >
            소개
          </div>
          <div
            className={cn("Tab", { Active: currentPage === "calendar" })}
            onClick={() => setCurrentPage("calendar")}
          >
            예약하기
          </div>
        </div>
      )}

      {currentPage === 'intro' && <SpaceIntro />}
      {currentPage === 'calendar' && (
        <SpaceCalendar
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          setCurrentPage={setCurrentPage}
          reserved={reserved}
          isLoading={isLoading}
          isError={isError}
        />
      )}
      {currentPage === 'reservation' && (
        <SpaceReservation
          date={date}
          time={time}
        />
      )}
    </div>
  );
}

export default Space;