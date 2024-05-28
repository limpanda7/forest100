import ReactCalendar from 'react-calendar';
import moment from 'moment';
import { SPACE_PRICE } from '../../constants';
import { useState } from 'react';

const SpaceCalendar = ({
                         date,
                         setDate,
                         time,
                         setTime,
                         setCurrentPage,
                         reserved,
                       }) => {
  const [showRefund, setShowRefund] = useState(false);

  const handleTimeChange = (hour) => {
    let updatedTime;

    if (time.includes(hour)) {
      updatedTime = time.filter((h) => h !== hour);
    } else {
      updatedTime = [...time, hour];
    }

    updatedTime.sort((a, b) => a - b);

    let isContinuous = true;
    for (let i = 1; i < updatedTime.length; i++) {
      if (updatedTime[i] - updatedTime[i - 1] !== 1) {
        isContinuous = false;
        break;
      }
    }

    if (isContinuous) {
      setTime(updatedTime);
    } else {
      alert('연속된 시간을 선택해주세요!');
      setTime(time);
    }
  };

  const handleDateChange = (value) => {
    setDate(moment(value).format('YYYY-MM-DD'));
    setTime([]);
  };

  // Function to check if a time slot is blocked
  const isTimeSlotBlocked = (date, hour) => {
    if (!reserved || !date) return false;

    const formattedDate = moment(date).format('YYYY-MM-DD');
    const reservationOnDate = reserved.filter((reservation) => {
      return moment(reservation.date).format('YYYY-MM-DD') === formattedDate;
    });

    if (!reservationOnDate) return false;

    return reservationOnDate.find(reservation => {
      const startTime = parseInt(reservation.checkin_time);
      const endTime = parseInt(reservation.checkout_time);

      return hour >= startTime && hour < endTime;
    })
  };

  const renderTimeSlots = (startHour, endHour) => {
    const timeSlots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      const isBlocked = isTimeSlotBlocked(date, hour);
      timeSlots.push(
        <div key={hour} className='time-slot'>
          <input
            id={`time-${hour}`}
            type='checkbox'
            checked={time.includes(hour) && !isBlocked}
            disabled={isBlocked}
            onChange={() => handleTimeChange(hour)}
          />
          <label htmlFor={`time-${hour}`}>
            {hour < 10 ? `0${hour}` : hour}:00 - {hour < 9 ? `0${hour + 1}` : hour + 1}:00
          </label>
        </div>
      );
    }
    return timeSlots;
  };

  const moveToReservation = () => {
    if (time.length === 0) {
      alert('예약 시간을 선택해주세요!');
      return false;
    } else {
      setCurrentPage('reservation');
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className='SpaceCalendar contents'>
      <section>
        <div className='DescTitle'>Price</div>

        <table className='PriceTable'>
          <tr>
            <th width='1'>월~목</th>
            <th width='1'>금~일 및 공휴일</th>
          </tr>
          <tr>
            <td>{SPACE_PRICE.WEEKDAY.toLocaleString()}원/시간</td>
            <td>{SPACE_PRICE.WEEKEND.toLocaleString()}원/시간</td>
          </tr>
        </table>

        <ul>
          <li>2인 초과 시 1인당: {SPACE_PRICE.OVER_TWO.toLocaleString()}원/시간</li>
          <li>입금계좌: 카카오 3333058451192 남은비</li>
          <li><span className='anchor' onClick={() => setShowRefund(!showRefund)}>환불 규정 보기</span></li>
          {showRefund && (
            <ul className='List Refund'>
              <li>입실 8일 전까지: 총 결제금액의 100% 환불</li>
              <li>입실 7일 전: 총 결제금액의 50% 환불</li>
              <li>입실 6일 전: 총 결제금액의 40% 환불</li>
              <li>입실 5일 전: 총 결제금액의 30% 환불</li>
              <li>입실 4일 전: 총 결제금액의 20% 환불</li>
              <li>입실 3일 전: 총 결제금액의 10% 환불</li>
              <li>입실 2일 전부터 환불불가</li>
            </ul>
          )}
        </ul>
      </section>


      <section>
        <div className='DescTitle'>Reservation</div>
        <ReactCalendar
          className='calendar'
          calendarType='US'
          formatDay={(localeDay, date) => date.getDate()}
          minDate={new Date()}
          onClickDay={(value) => handleDateChange(value)} // Updated onClickDay handler
        />

        {date && (
          <>
            <div className='time-slots'>
              <div className='column'>
                <h2>오전</h2>
                {renderTimeSlots(0, 11)}
              </div>
              <div className='column'>
                <h2>오후</h2>
                {renderTimeSlots(12, 23)}
              </div>
            </div>

            <button className='large-btn reservation-btn' onClick={moveToReservation}>
              선택한 시간으로 예약하기
            </button>
          </>
        )}
      </section>
    </div>
  );
};

export default SpaceCalendar;
