import React, {useEffect, useState} from 'react';
import axios from "axios";
import 'react-calendar/dist/Calendar.css';
import ForestReservation from "./ForestReservation";
import ForestIntro from "./ForestIntro";
import ForestCalendar from "./ForestCalendar";
import {useNavigate} from "react-router-dom";
import cn from 'classnames';
import Header from "../Header/Header";
import {getCombinedReservation, getHomepageReservation} from "../../utils/reservation";

const Forest = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState('intro');
  const [reserved, setReserved] = useState([]);
  const [picked, setPicked] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getReserved();

    const script = document.createElement('script');
    script.src = 'https://cdn.decibelinsight.net/i/14089/939431/di.js';
    script.async = true;

    script.onload = () => {
      console.log('✅ DXA script loaded');
      // 1~2초 기다렸다가 상태 확인
      setTimeout(() => {
        console.log('typeof decibelInsight:', typeof window.decibelInsight);
        console.log('typeof decibelInsight.isCollecting:', typeof window.decibelInsight.isCollecting);
        console.log('isCollecting call:', window.decibelInsight.isCollecting?.());
        console.log('getSessionId call:', window.decibelInsight.getSessionId?.());
      }, 1500);
    };

    script.onerror = () => {
      console.error('❌ Failed to load DXA script');
    };

    window.decibelInsight = function () {
      (window.decibelInsight.q = window.decibelInsight.q || []).push(arguments);
    };
    window._da_ = [];

    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const getReserved = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const data = await getHomepageReservation("forest");
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
              window.decibelInsight('sendTrackedEvent', '테스트 이벤트', 100);
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
