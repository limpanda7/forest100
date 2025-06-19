import React, {useState, useEffect} from 'react';
import axios from "axios";
import {ON_OFF_PRICE} from "../../constants";
import ReactGA from "react-ga4";
import { useReservation } from '../../contexts/ReservationContext';

const {RENT_PER_WEEK, MANAGEMENT_PER_WEEK, CLEANING_FEE, DEPOSIT} = ON_OFF_PRICE;

const OnOffReservation = ({picked, setPicked, setCurrentPage}) => {
  const [person, setPerson] = useState(2);
  const [dog, setDog] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const weeks = Math.floor(picked.length / 7);

  // 전역 예약 상태 새로고침 함수
  const { refreshReservations } = useReservation();

  let isRequested = false;

  useEffect(() => {
    calcPrice();
  }, [person, dog]);

  const saveReservation = () => {
    if (isRequested) {
      return;
    }

    if (name === '' || phone === '') {
      alert('정보를 모두 입력해주세요.')
      return;
    }

    if (window.confirm(`성함: ${name}, 전화번호: ${phone}가 맞습니까?`)) {
      try {
        isRequested = true;
        axios.post('/api/reservation/on_off', {
          picked,
          name,
          phone,
          person,
          dog,
          price,
        })
          .then(() => {
            ReactGA.event({
              event_name: 'purchase',
              label: 'OnOff',
              value: price,
            });

            // 예약 완료 후 전역 예약 상태 새로고침
            refreshReservations();

            alert(`예약해주셔서 감사합니다! 입금하실 금액은 ${price.toLocaleString()}원입니다.`);
            window.location.href = '/';
          })
      } catch (e) {
        isRequested = false;
        alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        console.log('error: /api/reservation/on_off');
        console.log({picked, name, phone, person, dog, price});
      }
    }
  }

  const calcPrice = () => {
    const rentTotal = RENT_PER_WEEK * weeks;
    const manageTotal = MANAGEMENT_PER_WEEK * weeks;
    const total = rentTotal + manageTotal + CLEANING_FEE + DEPOSIT;
    setPrice(total);
  };

  const formatPeriod = () => {
    if (picked.length === 0) return '-';
    const start = picked[0];
    const end = picked[picked.length - 1];
    const days = picked.length;
    const weeks = days / 7;
    return `${start} ~ ${end} (${weeks}주)`;
  };

  return (
    <div className='contents reservation-page'>
      <section>
        <h2>계약 기간</h2>
        <p>{formatPeriod()}</p>
      </section>

      <section className='HowMany'>
        <h2>인원수 선택</h2>
        <div>
          <p>인원</p>
          <button onClick={() => {
            if (person > 1) setPerson(person - 1)
          }}>-
          </button>
          <span>{person}</span>
          <button onClick={() => {
            setPerson(person + 1)
          }}>+
          </button>
        </div>
        {/*<div>*/}
        {/*  <p>영유아(36개월 미만)</p>*/}
        {/*  <button onClick={() => {*/}
        {/*    if (baby > 0) setBaby(baby - 1)*/}
        {/*  }}>-*/}
        {/*  </button>*/}
        {/*  <span>{baby}</span>*/}
        {/*  <button onClick={*/}
        {/*    () => setBaby(baby + 1)*/}
        {/*  }>+*/}
        {/*  </button>*/}
        {/*</div>*/}
        <div>
          <p>반려견</p>
          <button onClick={() => {
            if (dog > 0) setDog(dog - 1)
          }}>-
          </button>
          <span>{dog}</span>
          <button onClick={() => {
            if (dog < 2) setDog(dog + 1)
          }}>+
          </button>
        </div>
      </section>
      
      <section className='PriceTotal'>
        <h2>총 이용요금</h2>
        <h2 className='Price'>{price.toLocaleString()}원</h2>
        <div className='PriceDetail'>
          <p><b>임대료:</b> {(RENT_PER_WEEK * weeks).toLocaleString()}원</p>
          <p><b>관리비:</b> {(MANAGEMENT_PER_WEEK * weeks).toLocaleString()}원</p>
          <p><b>청소비:</b> {CLEANING_FEE.toLocaleString()}원</p>
          <p><b>보증금:</b> {DEPOSIT.toLocaleString()}원</p>
        </div>
      </section>

      <section className='Deposit'>
        <h2>입금하기</h2>
        <div className='BankAccount'>카카오 3333053810252 채민기</div>
        <p>
          위 계좌로 <b>{price.toLocaleString()}원</b>을 입금해주세요.
        </p>
        <p>
          <span className='input-label'>입금하실 분 성함:</span>
          <input type='text' size='6' onChange={(e) => setName(e.target.value)}/><br/>
          <span className='input-label'>전화번호:</span>
          <input type='text' size='14' pattern='[0-9]*' value={phone} maxLength={11}
                 onChange={(e) => {
                   if (e.target.validity.valid) setPhone(e.target.value)
                 }}
          />
        </p>
        <button className='large-btn' onClick={saveReservation}>계약하기</button>
      </section>
    </div>
  );
}

export default OnOffReservation;
