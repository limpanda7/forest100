import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import cn from "classnames";
import SpaceIntro from "./SpaceIntro";
import SpaceCalendar from "./SpaceCalendar";
import SpaceReservation from "./SpaceReservation";
import Header from "../Header/Header";
import axios from "axios";
import './Space.scss';

const Space = () => {
  const [currentPage, setCurrentPage] = useState('intro');
  const [reserved, setReserved] = useState([]);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getReserved();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const getReserved = async () => {
    const {data} = await axios.get("/api/reservation/space");
    setReserved(data);
  };

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
        />
      )}
      {currentPage === 'reservation' && (
        <SpaceReservation
          date={date}
          time={time}
        />
      )}

      {
        currentPage !== 'reservation' &&
        <Link to='/apple'>
          <div className="apple-icon">
            🍎
          </div>
        </Link>
      }
    </div>
  );
}

export default Space;