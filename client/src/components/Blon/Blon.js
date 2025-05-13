import React, {useEffect, useState} from 'react';
import 'react-calendar/dist/Calendar.css';
import './Blon.scss';
import BlonReservation from "./BlonReservation";
import BlonIntro from "./BlonIntro";
import BlonCalendar from "./BlonCalendar";
import {Link, useNavigate} from "react-router-dom";
import cn from 'classnames';
import Header from "../Header/Header";
import {getCombinedReservation} from "../../utils/reservation";

const Blon = () => {
  const [currentPage, setCurrentPage] = useState('intro');
  const [reserved, setReserved] = useState([]);
  const [picked, setPicked] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getReserved();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const getReserved = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const data = await getCombinedReservation("blon");
      setReserved(data);
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
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
