import React, { createContext, useContext, useState, useEffect } from 'react';
import {getCombinedReservation, getHomepageReservation} from '../utils/reservation';
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
  
  // 각 숙소별 개별 로딩 상태 관리
  const [loadingStates, setLoadingStates] = useState({
    forest: true,
    on_off: true,
    blon: true,
    space: true
  });
  
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
      
      setError(false);

      // 각 숙소별로 개별적으로 로드하고 상태 업데이트
      const loadForest = async () => {
        try {
          const data = await getCombinedReservation('forest');
          setReservations(prev => ({ ...prev, forest: data }));
        } catch (err) {
          console.error('Forest 예약 데이터 로드 실패:', err);
        } finally {
          setLoadingStates(prev => ({ ...prev, forest: false }));
        }
      };

      const loadOnOff = async () => {
        try {
          const data = await getCombinedReservation('on_off');
          setReservations(prev => ({ ...prev, on_off: data }));
        } catch (err) {
          console.error('OnOff 예약 데이터 로드 실패:', err);
        } finally {
          setLoadingStates(prev => ({ ...prev, on_off: false }));
        }
      };

      const loadBlon = async () => {
        try {
          const data = await getCombinedReservation('blon');
          setReservations(prev => ({ ...prev, blon: data }));
        } catch (err) {
          console.error('Blon 예약 데이터 로드 실패:', err);
        } finally {
          setLoadingStates(prev => ({ ...prev, blon: false }));
        }
      };

      const loadSpace = async () => {
        try {
          const data = await axios.get('/api/reservation/space').then(response => response.data);
          setReservations(prev => ({ ...prev, space: data }));
        } catch (err) {
          console.error('Space 예약 데이터 로드 실패:', err);
        } finally {
          setLoadingStates(prev => ({ ...prev, space: false }));
        }
      };

      // 모든 숙소를 병렬로 로드
      await Promise.allSettled([
        loadForest(),
        loadOnOff(),
        loadBlon(),
        loadSpace()
      ]);
      
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
    }
  };

  const getReservationByTarget = (target) => {
    return reservations[target] || [];
  };

  const getLoadingByTarget = (target) => {
    return loadingStates[target] || false;
  };

  const manualRetry = () => {
    if (Date.now() - lastRetryTime < RETRY_DELAY) {
      console.log('리트라이 간격이 너무 짧습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    // 모든 로딩 상태를 다시 true로 설정
    setLoadingStates({
      forest: true,
      on_off: true,
      blon: true,
      space: true
    });
    
    setRetryCount(0);
    loadAllReservations();
  };

  const value = {
    reservations,
    loadingStates,
    error,
    retryCount,
    getReservationByTarget,
    getLoadingByTarget,
    refreshReservations: loadAllReservations,
    manualRetry
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}; 