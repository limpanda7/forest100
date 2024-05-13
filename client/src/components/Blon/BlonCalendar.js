import React, {useMemo, useState} from "react";
import Calendar from "../Calendar/Calendar";
import {BLON_PRICE} from "../../constants";

const BlonCalendar = ({isLoading, picked, setPicked, setCurrentPage, reserved}) => {
  const [showRefund, setShowRefund] = useState(false);
  const [selected, setSelected] = useState(null);

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

  const maxDate = useMemo(() => {
    let maxDate;

    if (selected) {
      reserved.forEach(({checkin_date, checkout_date}) => {
        const checkinTimestamp = new Date(checkin_date).valueOf();
        const checkoutTimestamp = new Date(checkout_date).valueOf();
        if (selected?.valueOf() < checkinTimestamp.valueOf()) {
          if (!maxDate || maxDate > checkinTimestamp.valueOf()) {
            maxDate = checkinTimestamp.valueOf();
          }
        }
      });
    }

    return new Date(maxDate);
  }, [reserved, selected]);

  const moveToReservation = () => {
    if (picked.length === 0) {
      alert("예약 날짜를 선택해주세요!");
      return false;
    } else if (picked.length === 1) {
      alert("체크인 날짜와 체크아웃 날짜를 선택해주세요.");
    } else {
      setCurrentPage("reservation");
      window.scrollTo(0, 0);
    }
  };

  const calcRange = (value) => {
    if (selected) {
      let tempArr = [];

      // 모든 날짜 계산
      let startDate = new Date(value[0]);
      let endDate = new Date(value[1]);
      startDate.setDate(startDate.getDate() + 1);
      endDate.setDate(endDate.getDate() + 1);
      while (startDate <= endDate) {
        tempArr.push(startDate.toISOString().split("T")[0]);
        startDate.setDate(startDate.getDate() + 1);
      }

      // 마감된 날짜와 겹치는지 여부
      for (const element of tempArr) {
        if (reserved.includes(element)) {
          alert(
            "예약할 수 없는 날짜가 포함되어 있습니다. 날짜를 다시 선택해주세요."
          );
          setPicked([]);
          return false;
        }
      }

      setPicked(tempArr);
      setSelected(null);
    }
  };

  return (
    <div className='contents'>
      <section>
        <div className="DescTitle">Price</div>

        <table className='PriceTable'>
          <tr>
            <th>구분</th>
            <th>일~목</th>
            <th>금</th>
            <th>토</th>
          </tr>
          <tr>
            <td>성수기(7/20-8/20)</td>
            <td>{BLON_PRICE.SUMMER.WEEKDAY.toLocaleString()}</td>
            <td>{BLON_PRICE.SUMMER.FRIDAY.toLocaleString()}</td>
            <td>{BLON_PRICE.SUMMER.SATURDAY.toLocaleString()}</td>
          </tr>
          <tr>
            <td>비성수기</td>
            <td>{BLON_PRICE.NORMAL.WEEKDAY.toLocaleString()}</td>
            <td>{BLON_PRICE.NORMAL.FRIDAY.toLocaleString()}</td>
            <td>{BLON_PRICE.NORMAL.SATURDAY.toLocaleString()}</td>
          </tr>
        </table>

        <ul>
          <li>4인 초과 시 1인당: 1박 {BLON_PRICE.OVER_FOUR.toLocaleString()}원<br/>(추가침구 제공)</li>
          <li>36개월 미만의 영유아는 무료입니다.</li>
          <li>반려견 1마리당: 1박 {BLON_PRICE.DOG.toLocaleString()}원</li>
          <li>바베큐 이용요금: {BLON_PRICE.BARBECUE.toLocaleString()}원</li>
          <li>입금계좌: 우체국 01414202194793 남은진</li>
          <li>
            <span className='anchor' onClick={() => setShowRefund(!showRefund)}>환불 규정 보기</span>
            {
              showRefund &&
              <ul className='List'>
                <li>체크인까지 30일 이상 전액 환불 가능</li>
                <li>체크인까지 7~30일이 남은 시점에 예약을 취소하면, 숙박비 50%환불</li>
                <li>체크인까지 7일이 채 남지 않은 시점에 예약을 취소하면, 환불 불가</li>
              </ul>
            }
          </li>
        </ul>
      </section>

      <section>
        <div className="DescTitle">Reservation</div>
        <p>
          체크인 날짜와 체크아웃 날짜를 선택해주세요.
          <br/>
          (체크인 3시 / 체크아웃 11시)
        </p>

        {
          isLoading ?
            <div className='calendar'>
              달력 로딩 중...
            </div>
            :
            <Calendar
              isContinuous={true}
              picked={picked}
              setPicked={setPicked}
              reserved={reserved}
            />
        }
        <button className="large-btn reservation-btn" onClick={moveToReservation}>
          선택한 날짜로 예약하기
        </button>
      </section>
    </div>
  );
}

export default BlonCalendar;
