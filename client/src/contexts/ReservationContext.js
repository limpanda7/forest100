import React, { createContext, useContext, useState, useEffect } from 'react';
import { getHomepageReservation } from '../utils/reservation';
import axios from 'axios';

const ReservationContext = createContext();

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState({
    forest: [],
    on_off: [],
    blon: [],
    space: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastRetryTime, setLastRetryTime] = useState(0);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2초

  useEffect(() => {
    loadAllReservations();
  }, []);

  const loadAllReservations = async (isRetry = false) => {
    try {
      if (isRetry) {
        setRetryCount(prev => prev + 1);
        setLastRetryTime(Date.now());
      }
      
      setLoading(true);
      setError(false);

      // 모든 숙소의 예약내역을 병렬로 로드
      const [forestData, onOffData, blonData, spaceData] = await Promise.all([
        getHomepageReservation('forest'),
        getHomepageReservation('on_off'),
        getHomepageReservation('blon'),
        axios.get('/api/reservation/space').then(response => response.data)
      ]);

      setReservations({
        forest: forestData,
        on_off: onOffData,
        blon: blonData,
        space: spaceData
      });
      
      // 성공 시 리트라이 카운트 초기화
      setRetryCount(0);
    } catch (err) {
      console.error('예약 데이터 로드 실패:', err);
      setError(true);
      
      // 리트라이 로직
      if (!isRetry && retryCount < MAX_RETRIES) {
        console.log(`예약 데이터 로드 재시도 중... (${retryCount + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          loadAllReservations(true);
        }, RETRY_DELAY);
      } else if (retryCount >= MAX_RETRIES) {
        console.error(`예약 데이터 로드 최대 재시도 횟수 초과 (${MAX_RETRIES}회)`);
      }
    } finally {
      setLoading(false);
    }
  };

  const getReservationByTarget = (target) => {
    return reservations[target] || [];
  };

  const manualRetry = () => {
    if (Date.now() - lastRetryTime < RETRY_DELAY) {
      console.log('리트라이 간격이 너무 짧습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    setRetryCount(0);
    loadAllReservations();
  };

  const value = {
    reservations,
    loading,
    error,
    retryCount,
    getReservationByTarget,
    refreshReservations: loadAllReservations,
    manualRetry
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}; 