import ReactCalendar from "react-calendar";
import React, {useMemo, useState, useRef, useEffect} from "react";
import ReactModal from "react-modal";
import {formatDate} from "../../utils/date";

const SWIPE_THRESHOLD = 50; // px

const WeekCalendar = ({picked, setPicked, reserved}) => {
  const [selected, setSelected] = useState(null);
  const [duration, setDuration] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [touchStartX, setTouchStartX] = useState(null);
  const calendarRef = useRef(null);
  const [showSwipeGuide, setShowSwipeGuide] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const checker = useMemo(() => {
    const map = {};

    reserved.forEach(({checkin_date, checkout_date}) => {
      const checkinTimestamp = new Date(checkin_date).valueOf();
      const checkoutTimestamp = new Date(checkout_date).valueOf();

      map[checkinTimestamp] = {
        ...map[checkinTimestamp],
        checkIn: true,
      };
      map[checkoutTimestamp] = {
        ...map[checkoutTimestamp],
        checkOut: true,
      };
    });
    return map;
  }, [reserved]);

  const handleClickDay = (value) => {
    if (checker[value.valueOf()]?.checkIn) return;
    setSelected(value);
    setShowModal(true);
  };

  const handleDurationSelect = (weeks) => {
    const days = weeks * 7;
    const startDate = new Date(selected);
    const endDate = new Date(selected);
    endDate.setDate(startDate.getDate() + days - 1);

    const blocked = reserved.find(({ checkin_date, checkout_date }) => {
      const checkIn = new Date(checkin_date);
      const checkOut = new Date(checkout_date);
      return startDate < checkOut && endDate >= checkIn;
    });

    if (blocked) {
      alert("해당 기간에는 예약이 불가능합니다.");
      setShowModal(false);
      return;
    }

    const tempArr = [];
    const iterDate = new Date(startDate);
    for (let i = 0; i < days; i++) {
      tempArr.push(formatDate(iterDate));
      iterDate.setDate(iterDate.getDate() + 1);
    }

    setPicked(tempArr);
    setDuration(days);
    setMaxDate(endDate);
    setShowModal(false);
  };

  const tileDisabled = () => {
    return ({ date }) => {
      if (
        reserved.find(({ checkin_date, checkout_date }) => {
          const checkinTimestamp = new Date(checkin_date).valueOf();
          const checkoutTimestamp = new Date(checkout_date).valueOf();
          return (
            checkinTimestamp <= date.valueOf() &&
            checkoutTimestamp >= date.valueOf()
          );
        })
      ) {
        return true;
      }

      if (picked.length > 0) {
        const lastPicked = new Date(picked[picked.length - 1]);
        if (date > lastPicked) {
          return true;
        }
      }

      if (
        selected &&
        checker[selected]?.checkIn &&
        date.valueOf() > selected
      ) {
        return true;
      } else if (selected && checker[selected]?.checkOut && date.valueOf() < selected) {
        return true;
      } else if (!selected && checker[date.valueOf()]?.checkIn) {
        return true;
      }
    };
  };

  const tileClassName = ({ date }) => {
    if (!picked.length) return;

    const isPicked = picked.includes(date.toISOString().split("T")[0]);
    if (isPicked) return "highlight";
  };

  const resetCalendar = () => {
    setPicked([]);
    setSelected(null);
    setMaxDate(null);
    setDuration(null);
  }

  const modalStyle = {
    content: {
      width: '80%',
      maxWidth: '400px',
      maxHeight: '80%',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #ccc',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
    },
    info: {
      marginBottom: '16px',
      fontSize: '16px',
      fontWeight: '500',
      textAlign: 'center',
    },
    durationOptions: {
      textAlign: 'center',
    },
    durationButton: {
      display: 'inline-block',
      margin: '6px',
      padding: '10px 14px',
      fontSize: '14px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      backgroundColor: '#f8f8f8',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    },
    selectedDurationButton: {
      backgroundColor: '#005fff',
      color: '#fff',
      borderColor: '#005fff',
    },
    closeButton: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      width: '30px',
      height: '30px',
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#999',
      cursor: 'pointer',
      lineHeight: '1',
      transition: 'color 0.2s ease',
    },
    durationSub: {
      display: 'block',
      fontSize: '11px',
      marginTop: '4px',
      color: '#777'
    }
  };

  useEffect(() => {
    // 모바일 환경 감지
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (showSwipeGuide) {
      const timer = setTimeout(() => setShowSwipeGuide(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSwipeGuide]);

  useEffect(() => {
    const el = calendarRef.current;
    if (!el) return;
    const handleTouchMove = (e) => {
      if (touchStartX !== null) {
        e.preventDefault();
      }
    };
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, [touchStartX]);

  // 터치 이벤트 핸들러
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
    }
  };
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    if (Math.abs(diffX) > SWIPE_THRESHOLD) {
      // 왼쪽 스와이프(다음달)
      if (diffX < 0) {
        setActiveStartDate((prev) => {
          const next = new Date(prev);
          next.setMonth(next.getMonth() + 1);
          return next;
        });
      }
      // 오른쪽 스와이프(이전달)
      else if (diffX > 0) {
        setActiveStartDate((prev) => {
          const prevMonth = new Date(prev);
          prevMonth.setMonth(prevMonth.getMonth() - 1);
          return prevMonth;
        });
      }
    }
    setTouchStartX(null);
  };

  return (
    <div className='Calendar'>
      <div className='DateAndBtnWrap'>
        <div className='PickedDate'>
          <div className='DateWrap'>
            <div className='DateTitle'>체크인</div>
            <div className='DateContent'>{picked[0] || "-"}</div>
          </div>
          <div className='DateWrap'>
            <div className='DateTitle'>체크아웃</div>
            <div className='DateContent'>{picked[picked.length - 1] || "-"}</div>
          </div>
        </div>
        <button
          className='DateResetBtn'
          onClick={resetCalendar}
        >
          초기화
        </button>
      </div>
      <div
        ref={calendarRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{position:'relative'}}
      >
        {isMobile && showSwipeGuide && (
          <div style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: '16px',
            fontSize: '15px',
            zIndex: 10,
            pointerEvents: 'none',
            transition: 'opacity 0.5s',
          }}>
            좌우로 밀어보세요!
          </div>
        )}
        <ReactCalendar
          className="calendar"
          calendarType="US"
          prev2Label={null}
          next2Label={null}
          formatDay={(localeDay, date) => date.getDate()}
          minDate={selected ? new Date(selected) : new Date()}
          maxDate={maxDate}
          tileDisabled={tileDisabled()}
          tileClassName={tileClassName}
          onClickDay={handleClickDay}
          value={picked.length ? [new Date(picked[0]), new Date(picked[picked.length - 1])] : null}
          activeStartDate={activeStartDate}
          onActiveStartDateChange={({activeStartDate}) => setActiveStartDate(activeStartDate)}
          onDrillDown={({view}, e) => {
            if (view === 'year') {
              e.preventDefault();
            }
          }}
        />
      </div>

      <ReactModal isOpen={showModal} ariaHideApp={false} style={modalStyle}>
        <div className="DurationModalContent">
          <div style={modalStyle.info}>{formatDate(selected)} ~</div>
          <h3 style={modalStyle.info}>이용할 기간을 선택해 주세요.</h3>
          <div style={modalStyle.durationOptions}>
            {[...Array(12)].map((_, i) => {
              const startDate = new Date(selected);
              const endDate = new Date(selected);
              endDate.setDate(startDate.getDate() + (i + 1) * 7 - 1);
              return (
                <button
                  key={i + 1}
                  onClick={() => handleDurationSelect(i + 1)}
                  style={{
                    ...modalStyle.durationButton,
                    ...(duration === (i + 1) * 7 ? modalStyle.selectedDurationButton : {}),
                  }}
                >
                  {i + 1}주
                  <span style={modalStyle.durationSub}>{formatDate(endDate)}</span>
                </button>
              );
            })}
          </div>
        </div>
        <button
          style={modalStyle.closeButton}
          onClick={() => {
            setSelected(null);
            setShowModal(false);
          }}
          aria-label="Close"
        >
          ×
        </button>
      </ReactModal>
    </div>
  );
};

export default WeekCalendar;