import React, {useEffect, useState} from "react";
import Calendar from "../Calendar/Calendar";
import {FOREST_PRICE} from "../../constants";

const ForestCalendar = ({isLoading, setIsLoading, picked, setPicked, setCurrentPage, reserved}) => {
  const [showRefund, setShowRefund] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      if (reserved.length === 0) {
        setShowError(true);
      }
    }, 7000);
    return () => clearTimeout(timer); // cleanup
  }, []);
  
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

  return (
    <div className='contents'>
      <section>
        <div className="DescTitle">Price</div>

        <table className='PriceTable'>
          <tr>
            <th width='100'>구분</th>
            <th width='100'>평일</th>
            <th width='100'>주말, 공휴일</th>
          </tr>
          <tr>
            <td>성수기(7-8월)</td>
            <td>{FOREST_PRICE.SUMMER.WEEKDAY.toLocaleString()}</td>
            <td>{FOREST_PRICE.SUMMER.WEEKEND.toLocaleString()}</td>
          </tr>
          <tr>
            <td>비성수기</td>
            <td>{FOREST_PRICE.NORMAL.WEEKDAY.toLocaleString()}</td>
            <td>{FOREST_PRICE.NORMAL.WEEKEND.toLocaleString()}</td>
          </tr>
        </table>

        <ul>
          <li>2인 초과 시 1인당: 1박 {FOREST_PRICE.OVER_TWO.toLocaleString()}원<br/>(추가침구 제공)</li>
          <li>36개월 미만의 영유아는 무료입니다.</li>
          <li>반려견 1마리당: 1박 {FOREST_PRICE.DOG.toLocaleString()}원</li>
          <li>바베큐 이용요금: {FOREST_PRICE.BARBECUE.toLocaleString()}원</li>
          <li>입금계좌: 카카오 79420205681 남은비</li>
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

        {
          isLoading ? (
            <div className='calendar'>
              <div className='loading'>
                <div className='spinner' />
              </div>
            </div>
          ): showError ? (
            <div className="calendar">
              <p style={{ marginTop: "20px" }}>
                예약 내역을 불러오지 못했습니다.<br/>
                DM으로 문의해주세요.
                <li>카카오톡 ID: eunbibi1001</li>
                <li>인스타그램:&nbsp;
                  <a href='https://www.instagram.com/hanok.100/' target='_blank' className='anchor'>
                    @hanok.100
                  </a>
                </li>
              </p>
            </div>
          ) : (
            <>
              <p>
                체크인 날짜와 체크아웃 날짜를 선택해주세요.
                <br/>
                (체크인 3시 / 체크아웃 11시)
              </p>
              <Calendar
                isContinuous={true}
                picked={picked}
                setPicked={setPicked}
                reserved={reserved}
              />
              <button className="large-btn" onClick={moveToReservation}>
                선택한 날짜로 예약하기
              </button>
            </>
          )
        }
      </section>
    </div>
  );
}

export default ForestCalendar;
