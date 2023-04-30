import React, {useEffect, useState} from "react";
import Calendar from "react-calendar";
import moment from "moment";
import {ON_OFF_HOLIDAY, ON_OFF_WEEKDAY, ON_OFF_WEEKEND} from "../constants";

const OnOffCalendar = ({ getReserved, picked, setPicked, setCurrentPage, reserved }) => {
    const [showRefund, setShowRefund] = useState(false);

    useEffect(() => {
        getReserved();
    }, []);

    const moveToReservation = () => {
        if (picked.length < 2) {
            alert('체크인 날짜와 체크아웃 날짜를 선택해주세요.')
        } else {
            setCurrentPage('reservation');
            window.scrollTo(0, 0);
        }
    }

    const toggleRefund = () => {
        if (showRefund) setShowRefund(false);
        else setShowRefund(true);
    }

    const calcRange = (value) => {
        let tempArr = [];

        // 모든 날짜 계산
        let startDate = new Date(value[0]);
        let endDate = new Date(value[1]);
        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);
        while(startDate <= endDate) {
            tempArr.push(startDate.toISOString().split("T")[0]);
            startDate.setDate(startDate.getDate() + 1);
        }

        // 마감된 날짜와 겹치는지 여부
        for (const element of tempArr) {
            if (reserved.includes(element)) {
                alert('예약할 수 없는 날짜가 포함되어 있습니다. 날짜를 다시 선택해주세요.');
                setPicked([]);
                return false;
            }
        }

        setPicked(tempArr);
    }

    return (
        <>
            <section className='Price'>
                <div className="DescTitle">PRICE</div>
                <p>
                    비성수기: <b>주말 {ON_OFF_WEEKEND.toLocaleString()}원 / 평일 {ON_OFF_WEEKDAY.toLocaleString()}원</b><br/>
                </p>
                <p>
                    성수기: <b>주말 {ON_OFF_HOLIDAY.toLocaleString()}원 / 평일 {ON_OFF_WEEKEND.toLocaleString()}원</b><br/>
                </p>
                <ul>
                    <li>4인 초과 시 1인당: 1박 15,000원<br/>(추가침구 제공)</li>
                    <li>바베큐 이용요금: 20,000원</li>
                    <li>입금계좌: 카카오 3333053810252 채민기</li>
                    <li><a onClick={() => toggleRefund()}>환불 규정 보기</a></li>
                </ul>

                {
                    showRefund &&
                    <ul className='List Refund'>
                        <li>체크인 10일 전까지: 총 결제금액의 100% 환불</li>
                        <li>체크인 9일 전: 총 결제금액의 90% 환불</li>
                        <li>체크인 8일 전: 총 결제금액의 80% 환불</li>
                        <li>체크인 7일 전: 총 결제금액의 70% 환불</li>
                        <li>체크인 6일 전: 총 결제금액의 60% 환불</li>
                        <li>체크인 5일 전: 총 결제금액의 50% 환불</li>
                        <li>체크인 4일 전: 총 결제금액의 40% 환불</li>
                        <li>체크인 3일 전부터 환불불가</li>
                    </ul>
                }
            </section>

            {/*<h2>EVENT</h2>*/}
            {/*<p>⭐️대학생 평일 할인⭐️</p>*/}
            {/*<p>방학은 공기좋은 동해에서 보내자!<br/>대학생에게 평일 10% 할인을 제공합니다.</p>*/}

            <section>
                <div className="DescTitle">RESERVATION</div>
                <p>
                    체크인 날짜와 체크아웃 날짜를 선택해주세요.<br/>
                    (체크인 3시 / 체크아웃 11시)
                </p>
                <Calendar
                    className='Calendar'
                    minDate={new Date()}
                    calendarType='US'
                    tileDisabled={({ date }) => {
                        if(reserved.find(x => x === moment(date).format("YYYY-MM-DD"))){
                            return true;
                        }
                    }}
                    selectRange={true}
                    onChange={(value) => calcRange(value)}
                />
                <button className='ReservationBtn' onClick={() => moveToReservation()}>선택한 날짜로 예약하기</button>
            </section>
        </>
    );
}

export default OnOffCalendar;
