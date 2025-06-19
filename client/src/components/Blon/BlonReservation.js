import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BLON_PRICE} from "../../constants";
import {isFriday, isHoliday, isSaturday, isSummerBlon, isWeekday} from "../../utils/date";
import ReactGA from "react-ga4";
import { useReservation } from '../../contexts/ReservationContext';

const BlonReservation = ({picked, setPicked, setCurrentPage}) => {
  const [person, setPerson] = useState(4);
  const [baby, setBaby] = useState(0);
  const [dog, setDog] = useState(0);
  const [barbecue, setBarbecue] = useState('N');
  const [basePrice, setBasePrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [priceOption, setPriceOption] = useState('refundable');
  const [discount, setDiscount] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showRefund, setShowRefund] = useState(false);

  // 전역 예약 상태 새로고침 함수
  const { refreshReservations } = useReservation();

  let isRequested = false;

  useEffect(() => {
    calcPrice();
  }, [person, dog, barbecue, priceOption])

  const saveReservation = () => {
    if (isRequested) {
      return;
    }

    if (name === '' || phone === '') {
      alert('정보를 모두 입력해주세요.')
      return;
    }

    if (window.confirm(`성함: ${name}, 전화번호: ${phone}가 맞습니까?`)) {
      const bedding = person > 4 ? 1 : 0;
      try {
        isRequested = true;
        axios.post('/api/reservation/blon', {
          picked,
          name,
          phone,
          person,
          baby,
          dog,
          bedding,
          barbecue,
          price,
          priceOption,
        })
          .then(() => {
            ReactGA.event({
              event_name: 'purchase',
              label: 'Blon',
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
        console.log('error: /api/reservation/blon');
        console.log({
          picked,
          name,
          phone,
          person,
          baby,
          dog,
          bedding,
          barbecue,
          price,
          priceOption,
        });
      }
    }
  }

  const calcPrice = () => {

    let tempPrice = 0;
    for (let i = 0; i < picked.length - 1; i++) {
      const date = picked[i];

      const prices = isSummerBlon(date) ? BLON_PRICE.SUMMER : BLON_PRICE.NORMAL;

      if (isHoliday(date)) {
        tempPrice += prices.HOLIDAY;
      } else if (isWeekday(date)) {
        tempPrice += prices.WEEKDAY;
      } else if (isFriday(date)) {
        tempPrice += prices.FRIDAY;
      } else if (isSaturday(date)) {
        tempPrice += prices.SATURDAY;
      }
    }

    const days = picked.length - 1;
    const personCnt = person >= 4 ? person : 4;
    let totalPrice = tempPrice + (BLON_PRICE.OVER_FOUR * (personCnt - 4) + BLON_PRICE.DOG * dog) * days;

    if (barbecue === 'Y') {
      totalPrice += BLON_PRICE.BARBECUE;
    }

    if (priceOption === 'nonrefundable') {
      setDiscount(totalPrice * 0.1);
      totalPrice *= 0.9;
    } else {
      setDiscount(0);
    }

    setBasePrice(tempPrice);
    setPrice(totalPrice);
  }

  return (
    <div className='contents reservation-page'>
      <section>
        <h2>선택한 날짜</h2>
        <ul>
          {picked.map(element => {
            return <li>{element}</li>
          })}
        </ul>
      </section>

      <section className='HowMany'>
        <h2>인원수 선택 (최대 6인)</h2>
        <div>
          <p>인원</p>
          <button onClick={() => {
            if (person > 1) setPerson(person - 1)
          }}>-
          </button>
          <span>{person}</span>
          <button onClick={() => {
            if (person < 6) setPerson(person + 1)
          }}>+
          </button>
        </div>
        <div>
          <p>영유아(36개월 미만)</p>
          <button onClick={() => {
            if (baby > 0) setBaby(baby - 1)
          }}>-
          </button>
          <span>{baby}</span>
          <button onClick={() => setBaby(baby + 1)}>+</button>
        </div>
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

      <section>
        <div className='Barbecue'>
          <h2>바베큐 선택</h2>
          <div>
            <input type='radio' id='barbecueY' onClick={() => setBarbecue('Y')} checked={barbecue === 'Y'}/>
            <label htmlFor='barbecueY'><span/>예</label>
            <input type='radio' id='barbecueN' onClick={() => setBarbecue('N')} checked={barbecue === 'N'}/>
            <label htmlFor='barbecueN'><span/>아니오</label>
          </div>
        </div>
        <ul>
          <li>숯.토치.그릴.부탄가스.그릴망.집게를 제공합니다.</li>
          <li>셀프이용 시설입니다.</li>
        </ul>
      </section>

      <section className='PriceOption'>
        <h2>환불옵션 선택</h2>
        <input type='radio' id='refundable' onClick={() => setPriceOption('refundable')}
               checked={priceOption === 'refundable'}/>
        <label htmlFor='refundable'><span/><b>환불가능 옵션</b></label>
        <p>예약 취소 시 <span className='anchor' onClick={() => setShowRefund(!showRefund)}>환불 규정</span>에 따라서 환불이 진행됩니다.</p>

        {
          showRefund &&
          <ul className='List'>
            <li>체크인까지 30일 이상 전액 환불 가능</li>
            <li>체크인까지 7~30일이 남은 시점에 예약을 취소하면, 숙박비 50%환불</li>
            <li>체크인까지 7일이 채 남지 않은 시점에 예약을 취소하면, 환불 불가</li>
          </ul>
        }

        <input type='radio' id='nonrefundable' onClick={() => setPriceOption('nonrefundable')}
               checked={priceOption === 'nonrefundable'}/>
        <label htmlFor='nonrefundable'><span/><b>환불불가 옵션</b></label>
        <p>10% 할인을 제공합니다. 예약을 취소하더라도 환불이 불가합니다.</p>
      </section>

      <section className='PriceTotal'>
        <h2>총 이용요금</h2>
        <h2 className='Price'>{price.toLocaleString()}원</h2>
        <div className='PriceDetail'>
          <p><b>숙박요금:</b> {basePrice.toLocaleString()}원 (총 {picked.length - 1}박)</p>
          {
            person > 4 &&
            <p><b>인원초과:</b> {BLON_PRICE.OVER_FOUR.toLocaleString()}원 x {person - 4}명 x {picked.length - 1}박</p>
          }
          {
            dog > 0 &&
            <p><b>반려견:</b> {BLON_PRICE.DOG.toLocaleString()}원 x {dog}마리 x {picked.length - 1}박</p>
          }
          {
            barbecue === 'Y' &&
            <p><b>바베큐:</b> {BLON_PRICE.BARBECUE.toLocaleString()}원</p>
          }
          {
            discount > 0 &&
            <p><b>환불불가 할인:</b> -{discount.toLocaleString()}원</p>
          }
        </div>
      </section>

      <section className='Deposit'>
        <h2>입금하기</h2>
        <div className='BankAccount'>카카오 79420661213 남은진</div>
        <p>
          위 계좌로 <b>{price.toLocaleString()}원</b>을 입금해주세요.<br/>
          3시간 내에 입금 해 주셔야 예약이 확정됩니다.
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
        <button className='large-btn' onClick={saveReservation}>
          예약하기
        </button>
      </section>
    </div>
  );
}

export default BlonReservation;
