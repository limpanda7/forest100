import React, {useState} from "react";
import WeekCalendar from "../Calendar/WeekCalendar";
import {ON_OFF_PRICE} from "../../constants";
import { useReservation } from '../../contexts/ReservationContext';

const OnOffCalendar = ({
  isLoading,
  isError,
  picked,
  setPicked,
  setCurrentPage,
  reserved,
}) => {
  const [showRefund, setShowRefund] = useState(false);
  const { manualRetry } = useReservation();
  
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

        {/*<table className="PriceTable">*/}
        {/*  <tr>*/}
        {/*    <th width='100'>구분</th>*/}
        {/*    <th width='100'>평일</th>*/}
        {/*    <th width='100'>주말, 공휴일</th>*/}
        {/*  </tr>*/}
        {/*  <tr>*/}
        {/*    <td>성수기(7-8월)</td>*/}
        {/*    <td>{ON_OFF_PRICE.SUMMER.WEEKDAY.toLocaleString()}</td>*/}
        {/*    <td>{ON_OFF_PRICE.SUMMER.WEEKEND.toLocaleString()}</td>*/}
        {/*  </tr>*/}
        {/*  <tr>*/}
        {/*    <td>비성수기</td>*/}
        {/*    <td>{ON_OFF_PRICE.NORMAL.WEEKDAY.toLocaleString()}</td>*/}
        {/*    <td>{ON_OFF_PRICE.NORMAL.WEEKEND.toLocaleString()}</td>*/}
        {/*  </tr>*/}
        {/*</table>*/}

        <table className="PriceTable">
          <tbody>
            <tr>
              <td>임대료</td>
              <td>{ON_OFF_PRICE.RENT_PER_WEEK.toLocaleString()}원 / 1주</td>
            </tr>
            <tr>
              <td>관리비</td>
              <td>{ON_OFF_PRICE.MANAGEMENT_PER_WEEK.toLocaleString()}원 / 1주</td>
            </tr>
            <tr>
              <td>청소비</td>
              <td>{ON_OFF_PRICE.CLEANING_FEE.toLocaleString()}원</td>
            </tr>
            <tr>
              <td>보증금</td>
              <td>{ON_OFF_PRICE.DEPOSIT.toLocaleString()}원</td>
            </tr>
          </tbody>
        </table>

        <ul>
          <li>기름보일러를 과도하게 사용하는 경우, 추가 관리비를 청구할 수 있습니다.</li>
          {/*<li>*/}
          {/*  4인 초과 시 1인당: 1박 {ON_OFF_PRICE.OVER_FOUR.toLocaleString()}원*/}
          {/*  <br/>*/}
          {/*  (추가침구 제공)*/}
          {/*</li>*/}
          {/*<li>바베큐 이용요금: 20,000원</li>*/}
          <li>입금계좌: 카카오 79420205681 남은비</li>
          <li>
            <span className='anchor' onClick={() => setShowRefund(!showRefund)}>환불 규정 보기</span>
            {
              showRefund &&
              <ul className='List'>
                <li>입주 8일 전까지: 총 결제금액의 100% 환불</li>
                <li>입주 7일 전: 총 결제금액의 50% 환불</li>
                <li>입주 6일 전: 총 결제금액의 40% 환불</li>
                <li>입주 5일 전: 총 결제금액의 30% 환불</li>
                <li>입주 4일 전: 총 결제금액의 20% 환불</li>
                <li>입주 3일 전: 총 결제금액의 10% 환불</li>
                <li>입주 2일 전부터 환불불가</li>
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
          ): isError ? (
            <div className="calendar">
              <p style={{ marginTop: "20px" }}>
                예약 내역을 불러오지 못했습니다.
              </p>
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button 
                  className="large-btn" 
                  onClick={manualRetry}
                  style={{ marginBottom: "15px" }}
                >
                  다시 시도하기
                </button>
                <p style={{ fontSize: "14px", color: "#666" }}>
                  DM으로 문의해주세요.
                  <br/>
                  카카오톡 ID: skfk1600
                  <br/>
                  인스타그램:&nbsp;
                  <a href='https://www.instagram.com/on.offstay/' target='_blank' className='anchor'>
                    @on.offstay
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <>
              <p>
                입주 날짜를 선택해 주세요.
              </p>
              <WeekCalendar
                picked={picked}
                setPicked={setPicked}
                reserved={reserved}
              />
              <button className="large-btn" onClick={moveToReservation}>
                선택한 날짜로 계약하기
              </button>
            </>
          )
        }
      </section>
    </div>
  );
};

export default OnOffCalendar;
