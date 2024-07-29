import React, {useState, useEffect} from 'react';
import axios from "axios";
import ReactModal from 'react-modal';
import {ON_OFF_PRICE} from "../../constants";
import {isHoliday, isSummer, isWeekday} from "../../utils/date";

const OnOffReservation = ({picked, reservedName, reservedPhone}) => {
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
  const [showModal, setShowModal] = useState(false);

  let isRequested = false;

  useEffect(() => {
    calcPrice();
  }, [person, dog, barbecue, priceOption])

  const saveReservation = () => {
    if (isRequested) {
      return;
    }

    const bedding = person > 4 ? 1 : 0;
    try {
      isRequested = true;
      axios.post('/api/reservation/on_off', {
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
          alert(`예약해주셔서 감사합니다! 입금하실 금액은 ${price.toLocaleString()}원입니다.`);
          window.location.href = '/';
        })
    } catch (e) {
      isRequested = false;
      alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.log('error: /api/reservation/on_off');
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

  const calcPrice = () => {

    let tempPrice = 0;
    for (let i = 0; i < picked.length - 1; i++) {
      const date = picked[i];

      const prices = isSummer(date) ? ON_OFF_PRICE.SUMMER : ON_OFF_PRICE.NORMAL;

      if (isHoliday(date)) {
        tempPrice += prices.HOLIDAY;
      } else if (isWeekday(date)) {
        tempPrice += prices.WEEKDAY;
      } else {
        tempPrice += prices.WEEKEND;
      }
    }

    const days = picked.length - 1;
    const personCnt = person >= 4 ? person : 4;
    let totalPrice = tempPrice + (ON_OFF_PRICE.OVER_FOUR * (personCnt - 4) + ON_OFF_PRICE.DOG * dog) * days;

    if (barbecue === 'Y') {
      totalPrice += ON_OFF_PRICE.BARBECUE;
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

  const openModal = () => {
    if (name === '' || phone === '') {
      alert('정보를 모두 입력해주세요.')
      return;
    }

    setShowModal(true);
  }

  const modalStyle = {
    content: {
      width: '80%',
      maxWidth: '600px',
      maxHeight: '80%',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

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
          <button onClick={
            () => setBaby(baby + 1)
          }>+
          </button>
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
        <p>예약 취소 시 <span className='anchor' onClick={() => setShowRefund(!showRefund)}>
          환불 규정</span>에 따라서 환불이 진행됩니다.
        </p>

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
            <p><b>인원초과:</b> {ON_OFF_PRICE.OVER_FOUR.toLocaleString()}원 x {person - 4}명 x {picked.length - 1}박</p>
          }
          {
            dog > 0 &&
            <p><b>반려견:</b> {ON_OFF_PRICE.DOG.toLocaleString()}원 x {dog}마리 x {picked.length - 1}박</p>
          }
          {
            barbecue === 'Y' &&
            <p><b>바베큐:</b> {ON_OFF_PRICE.BARBECUE.toLocaleString()}원</p>
          }
          {
            discount > 0 &&
            <p><b>환불불가 할인:</b> -{discount.toLocaleString()}원</p>
          }
        </div>
      </section>

      <section className='Deposit'>
        <h2>입금하기</h2>
        <div className='BankAccount'>카카오 3333053810252 채민기</div>
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
        <button className='large-btn' onClick={() => openModal(true)}>예약하기</button>
      </section>

      <ReactModal
        isOpen={showModal}
        style={modalStyle}
      >
        <div className='ModalTitle'>예약 전 주의사항</div>
        <ul className='ModalList'>
          <li>예약하신 인원 외 방문자 및 반려동물의 입실은 불가합니다.</li>
          <li>숙소의 모든 공간은 금연입니다.</li>
          <li>안전과 방범을 위해 앞마당에 CCTV가 설치되어 있습니다.</li>
          <li>주방에서 조리가 가능합니다 *고기나 생선구이, 튀김 등 냄새가 심한 요리를 금합니다. 간단한 요리, 밀키트 조리, 포장음식을 데워 드시기에 적합할 정도로 조리도구가 준비되어있습니다.</li>
          <li>침구 오염시 얼룩 제거 비용이 발생할 수 있으며, 제거 불가한 심한 얼룩이 생겼을 시 제품 구매 비용이 청구될수있습니다.</li>
          <li>모든 시설물·비품·소품의 이동을 삼가 주시기 바랍니다.</li>
          <li>실내외 모든 시설물 및 소품 및 비품의 훼손· 분실·파손 시 복구비용 및 영업손실 비용을 부담하셔야 합니다. 문제 발생 시 당황하시지 마시고 바로 연락 주시기 바랍니다.</li>
          <li>게스트의 부주의로 인해 일어난 안전사고, 귀중품 분실 및 파손은 호스트의 책임사항이 아닙니다.</li>
          <li>밤 10시 이후 정숙해주세요. 조용한 시골이라 주민분들이 일찍 주무십니다.</li>
          <li>지역 특성상 벌레와 곤충이 실내로 유입될 수 있습니다. 벌레 혹은 곤충에 예민하신 분들은 예약에 신중을 기해주세요. 이로 인한 환불은 불가합니다.</li>
        </ul>
        <div className='BtnWrap'>
          <button className='ModalBtn' onClick={() => setShowModal(false)}>거부</button>
          <button className='ModalBtn' onClick={() => saveReservation()}>동의</button>
        </div>
      </ReactModal>
    </div>
  );
}

export default OnOffReservation;
