import React, { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { ON_OFF_PRICE } from "../../constants";

const OnOffCalendar = ({
  getReserved,
  picked,
  setPicked,
  setCurrentPage,
  reserved,
}) => {
  const [showRefund, setShowRefund] = useState(false);
  const [selected, setSelected] = useState(null);

  const checker = useMemo(() => {
    const map = {};

    reserved.forEach(({ checkin_date, checkout_date }) => {
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
      reserved.forEach(({ checkin_date, checkout_date }) => {
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

  useEffect(() => {
    getReserved();
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

  const toggleRefund = () => {
    if (showRefund) setShowRefund(false);
    else setShowRefund(true);
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
    <>
      <section>
        <div className="DescTitle">PRICE</div>

        <table className="PriceTable">
          <tr>
            <th>구분</th>
            <th>평일</th>
            <th>주말</th>
          </tr>
          <tr>
            <td>성수기(7-8월)</td>
            <td>{ON_OFF_PRICE.SUMMER.WEEKDAY.toLocaleString()}</td>
            <td>{ON_OFF_PRICE.SUMMER.WEEKEND.toLocaleString()}</td>
          </tr>
          <tr>
            <td>비성수기</td>
            <td>{ON_OFF_PRICE.NORMAL.WEEKDAY.toLocaleString()}</td>
            <td>{ON_OFF_PRICE.NORMAL.WEEKEND.toLocaleString()}</td>
          </tr>
        </table>

        <ul>
          <li>
            4인 초과 시 1인당: 1박 15,000원
            <br />
            (추가침구 제공)
          </li>
          <li>바베큐 이용요금: 20,000원</li>
          <li>입금계좌: 카카오 3333053810252 채민기</li>
          <li>
            <a onClick={toggleRefund}>환불 규정 보기</a>
          </li>
        </ul>

        {showRefund && (
          <ul className="List Refund">
            <li>체크인 10일 전까지: 총 결제금액의 100% 환불</li>
            <li>체크인 9일 전: 총 결제금액의 90% 환불</li>
            <li>체크인 8일 전: 총 결제금액의 80% 환불</li>
            <li>체크인 7일 전: 총 결제금액의 70% 환불</li>
            <li>체크인 6일 전: 총 결제금액의 60% 환불</li>
            <li>체크인 5일 전: 총 결제금액의 50% 환불</li>
            <li>체크인 4일 전: 총 결제금액의 40% 환불</li>
            <li>체크인 3일 전부터 환불불가</li>
          </ul>
        )}
      </section>

      <section>
        <div className="DescTitle">RESERVATION</div>
        <p>
          체크인 날짜와 체크아웃 날짜를 선택해주세요.
          <br />
          (체크인 3시 / 체크아웃 11시)
        </p>

        <div className='DateAndBtnWrap'>
          <div className='PickedDate'>
            <div className='DateWrap'>
              <div className='DateTitle'>체크인</div>
              <div className='DateContent'>{picked[0] || "-"}</div>
            </div>
            <div  className='DateWrap'>
              <div className='DateTitle'>체크아웃</div>
              <div className='DateContent'>{picked[picked.length - 1] || "-"}</div>
            </div>
          </div>

          <button
            className='DateResetBtn'
            onClick={() => {
              setPicked([]);
              setSelected(null);
            }}
          >
            초기화
          </button>
        </div>


        <Calendar
          className="calendar"
          calendarType="US"
          minDate={selected ? new Date(selected) : new Date()}
          maxDate={maxDate}
          tileDisabled={({ date }) => {
            if (
              reserved.find(({ checkin_date, checkout_date }) => {
                const checkinTimestamp = new Date(checkin_date).valueOf();
                const checkoutTimestamp = new Date(checkout_date).valueOf();
                return (
                  (checkinTimestamp.valueOf() < date.valueOf() &&
                    checkoutTimestamp.valueOf() > date.valueOf()) ||
                  (checker[date.valueOf()]?.checkIn &&
                    checker[date.valueOf()]?.checkOut)
                );
              })
            ) {
              return true;
            }
            if (
              selected &&
              ((selected < date.valueOf() &&
                checker[date.valueOf()]?.checkOut) ||
                (selected > date.valueOf() && checker[date.valueOf()]?.checkIn))
            ) {
              return true;
            } else if (!selected && checker[date.valueOf()]?.checkIn) {
              return true;
            }
          }}
          selectRange={!!selected || !!picked.length}
          onClickDay={(value) => {
            if (!checker[value.valueOf()]?.checkIn) {
              setSelected(new Date(value));
            }
            if (picked.length) {
              setPicked([]);
            }
          }}
          onChange={(value) => {
            calcRange(value);
          }}
          value={
            picked.length
              ? [new Date(picked[0]), new Date(picked[picked.length - 1])]
              : null
          }
          tileClassName={({ date }) => {
            let start = null;
            let end = null;
            if (picked.length) {
              start = new Date(new Date(picked[0])?.toISOString().slice(0, -1));
              end = new Date(
                new Date(picked[picked.length - 1])?.toISOString().slice(0, -1)
              );
            }

            if (
              start?.valueOf() === date.valueOf() ||
              end?.valueOf() === date.valueOf()
            ) {
              return "select-date";
            }
            if (
              !selected &&
              !checker[date.valueOf()]?.checkOut &&
              checker[date.valueOf()]?.checkIn
            )
              return "checkout-only";
          }}
        />
        <button className="ReservationBtn" onClick={() => moveToReservation()}>
          선택한 날짜로 예약하기
        </button>
      </section>
    </>
  );
};

export default OnOffCalendar;
