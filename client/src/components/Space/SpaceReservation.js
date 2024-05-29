import {useEffect, useState} from "react";
import {SPACE_PRICE} from "../../constants";
import {isHoliday, isWeekday} from "../../utils/date";
import axios from "axios";

const SpaceReservation = ({ date, time }) => {
  const [person, setPerson] = useState(2);
  // const [dog, setDog] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [priceOption, setPriceOption] = useState('refundable');
  const [discount, setDiscount] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showRefund, setShowRefund] = useState(false);
  const [purpose, setPurpose] = useState('모임');
  const [customPurpose, setCustomPurpose] = useState('');

  let isRequested = false;

  useEffect(() => {
    calcPrice();
  }, [person, priceOption]);

  const saveReservation = () => {
    if (isRequested) {
      return;
    }

    if (name === '' || phone === '') {
      alert('정보를 모두 입력해주세요.')
      return;
    }

    const reservationPurpose = purpose === '기타' ? customPurpose : purpose;

    try {
      isRequested = true;
      axios.post('/api/reservation/space', {
        date,
        time,
        name,
        phone,
        person,
        price,
        priceOption,
        purpose: reservationPurpose,
      })
        .then(() => {
          alert(`예약해주셔서 감사합니다! 입금하실 금액은 ${price.toLocaleString()}원입니다.`);
          window.location.href = '/';
        })
    } catch (e) {
      isRequested = false;
      alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.log('error: /api/reservation/space');
      console.log({
        date,
        time,
        name,
        phone,
        person,
        price,
        priceOption,
        purpose: reservationPurpose,
      });
    }
  }

  const calcPrice = () => {
    let tempPrice = 0;
    for (let i = 0; i < time.length; i++) {
      if (isHoliday(date) || !isWeekday(date)) {
        tempPrice += SPACE_PRICE.WEEKEND;
      } else {
        tempPrice += SPACE_PRICE.WEEKDAY;
      }
    }

    const personCnt = person >= 2 ? person : 2;
    let totalPrice = tempPrice + (SPACE_PRICE.OVER_TWO * (personCnt - 2)) * time.length;

    if (priceOption === 'nonrefundable') {
      setDiscount(totalPrice * 0.1);
      totalPrice *= 0.9;
    } else {
      setDiscount(0);
    }

    setBasePrice(tempPrice);
    setPrice(totalPrice)
  }

  return (
    <div className='contents reservation-page'>
      <section>
        <h2>선택한 시간</h2>
        <ul>
          <li>{date}</li>
          <ul>
            {time.map(hour => {
              return <li>{hour < 10 ? `0${hour}` : hour}:00 - {hour < 9 ? `0${hour + 1}` : hour + 1}:00</li>
            })}
          </ul>
        </ul>
      </section>

      <section className='HowMany'>
        <h2>인원수 선택 (최대 8인)</h2>
        <div>
          <p>인원</p>
          <button onClick={() => {
            if (person > 1) setPerson(person - 1)
          }}>-
          </button>
          <span>{person}</span>
          <button onClick={() => {
            if (person < 8) setPerson(person + 1)
          }}>+
          </button>
        </div>
        {/*<div>*/}
        {/*  <p>반려견</p>*/}
        {/*  <button onClick={() => {*/}
        {/*    if (dog > 0) setDog(dog - 1)*/}
        {/*  }}>-*/}
        {/*  </button>*/}
        {/*  <span>{dog}</span>*/}
        {/*  <button onClick={() => {*/}
        {/*    if (dog < 2) setDog(dog + 1)*/}
        {/*  }}>+*/}
        {/*  </button>*/}
        {/*</div>*/}
      </section>

      <section className='Purpose'>
        <h2>사용 목적</h2>
        <select onChange={(e) => setPurpose(e.target.value)} value={purpose}>
          <option value='모임'>모임</option>
          <option value='일일클래스'>일일클래스</option>
          <option value='이벤트'>이벤트</option>
          <option value='기타'>기타</option>
        </select>
        &nbsp;&nbsp;
        {purpose === '기타' && (
          <input type='text' placeholder='직접 입력' value={customPurpose}
                 onChange={(e) => setCustomPurpose(e.target.value)}/>
        )}
      </section>

      <section className='PriceOption'>
        <h2>환불옵션 선택</h2>
        <input type='radio' id='refundable' onClick={() => setPriceOption('refundable')}
               checked={priceOption === 'refundable'}/>
        <label htmlFor='refundable'><span/><b>환불가능 옵션</b></label>
        <p>
          예약 취소 시 <span className='anchor' onClick={() => setShowRefund(!showRefund)}>
            환불 규정
          </span>에 따라서 환불이 진행됩니다.
        </p>

        {
          showRefund &&
          <ul className='List'>
            <li>입실 8일 전까지: 총 결제금액의 100% 환불</li>
            <li>입실 7일 전: 총 결제금액의 50% 환불</li>
            <li>입실 6일 전: 총 결제금액의 40% 환불</li>
            <li>입실 5일 전: 총 결제금액의 30% 환불</li>
            <li>입실 4일 전: 총 결제금액의 20% 환불</li>
            <li>입실 3일 전: 총 결제금액의 10% 환불</li>
            <li>입실 2일 전부터 환불불가</li>
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
          <p><b>기본요금:</b> {basePrice.toLocaleString()}원 (총 {time.length}시간)</p>
          {
            person > 2 &&
            <p><b>인원초과:</b> {SPACE_PRICE.OVER_TWO.toLocaleString()}원 x {person - 2}명 x {time.length}시간</p>
          }
          {/*{*/}
          {/*  dog > 0 &&*/}
          {/*  <p><b>반려견:</b> {ON_OFF_PRICE.DOG.toLocaleString()}원 x {dog}마리</p>*/}
          {/*}*/}
          {
            discount > 0 &&
            <p><b>환불불가 할인:</b> -{discount.toLocaleString()}원</p>
          }
        </div>
      </section>

      <section className='Deposit'>
        <h2>입금하기</h2>
        <div className='BankAccount'>카카오 3333058451192 남은비</div>
        <p>
          위 계좌로 <b>{price.toLocaleString()}원</b>을 입금해주세요.<br/>
          3시간 내에 입금 해 주셔야 예약이 확정됩니다.
        </p>
        <p>
          <span>입금하실 분 성함:</span>
          <input type='text' size='6' onChange={(e) => setName(e.target.value)}/><br/>
          <span>전화번호:</span>
          <input type='text' size='14' pattern='[0-9]*' value={phone} maxLength={11}
                 onChange={(e) => {
                   if (e.target.validity.valid) setPhone(e.target.value)
                 }}
          />
        </p>
        <button className='large-btn reservation-btn' onClick={saveReservation}>
          예약하기
        </button>
      </section>
    </div>
  );
}

export default SpaceReservation;