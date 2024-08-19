import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import './Apple.scss';
import AppleImg from '../../images/Apple.jpg';
import axios from "axios";

const fiveKgPrice = 54000;
const tenKgPrice = 88000;

const Apple = () => {
  const navigate = useNavigate();
  const [fiveKg, setFiveKg] = useState(0);
  const [tenKg, setTenKg] = useState(0);
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [address, setAddress] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [isSameAsReceiver, setIsSameAsReceiver] = useState(false);
  const [price, setPrice] = useState(0);

  let isRequested = false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    calcPrice();
  }, [fiveKg, tenKg]);

  const calcPrice = () => {
    setPrice(fiveKg * fiveKgPrice + tenKg * tenKgPrice);
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsSameAsReceiver(checked);
    if (checked) {
      setName(receiverName);
      setPhone(receiverPhone);
    }
  };

  const saveReservation = () => {
    if (isRequested) {
      return;
    }

    if (fiveKg === 0 && tenKg === 0) {
      alert('최소 1박스 이상 주문해주세요.');
      return;
    }

    if (receiverName === '' || receiverPhone === '' || address === '' || name === '' || phone === '') {
      alert('정보를 모두 입력해주세요.');
      return;
    }

    if (window.confirm(`입금자: ${name}, 전화번호: ${phone}가 맞습니까?`)) {
      try {
        isRequested = true;
        axios.post('/api/reservation/apple', {
          name,
          phone,
          fiveKg,
          tenKg,
          price,
          receiverName,
          receiverPhone,
          address,
        })
          .then(() => {
            alert(`예약해주셔서 감사합니다! 입금하실 금액은 ${price.toLocaleString()}원입니다.`);
            window.location.href = '/';
          })
      } catch (e) {
        isRequested = false;
        alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        console.log('error: /api/reservation/forest');
        console.log({name, phone, fiveKg, tenKg, price, receiverName, receiverPhone, address});
      }
    }
  }

  return (
    <div className='reservation-page'>
      <img src={AppleImg} alt="AppleImg" />
      <div className='Apple contents'>
        <section className='HowMany'>
          <h2>🍎수량</h2>
          <div>
            <p>5 kg</p>
            <button onClick={() => {
              if (fiveKg > 0) setFiveKg(fiveKg - 1)
            }}>-
            </button>
            <span>{fiveKg}</span>
            <button onClick={() => {
              setFiveKg(fiveKg + 1)
            }}>+
            </button>
          </div>
          <div>
            <p>10 kg</p>
            <button onClick={() => {
              if (tenKg > 0) setTenKg(tenKg - 1)
            }}>-
            </button>
            <span>{tenKg}</span>
            <button onClick={() => {
              setTenKg(tenKg + 1)
            }}>+
            </button>
          </div>
        </section>

        <section className='PriceTotal'>
          <h2>🍎총 금액</h2>
          <h2 className='Price'>{price.toLocaleString()}원</h2>
          <div className='PriceDetail'>
            <p><b>5 kg:</b> {fiveKgPrice.toLocaleString()} x {fiveKg}박스 = {(fiveKgPrice * fiveKg).toLocaleString()}</p>
            <p><b>10 kg:</b> {tenKgPrice.toLocaleString()} x {tenKg}박스 = {(tenKgPrice * tenKg).toLocaleString()}</p>
          </div>
        </section>

        <section className='receiver-section'>
          <h2>🍎받으실 분</h2>
          <div>
            <span className='input-label'>받으실 분 성함:</span>
            <input type='text' value={receiverName} size='6'
                   onChange={(e) => setReceiverName(e.target.value)}/>
          </div>

          <div>
            <span className='input-label'>받으실 분 전화번호:</span>
            <input type='text' value={receiverPhone} size='14'
                   onChange={(e) => setReceiverPhone(e.target.value)}/>
          </div>

          <div>
            <span className='input-label'>받으실 분 주소:</span>
            <input type='text' value={address} style={{width: '340px'}}
                   onChange={(e) => setAddress(e.target.value)}/>
          </div>
        </section>

        <section className='Deposit'>
          <h2>🍎입금하기</h2>
          <div className='BankAccount'>카카오 79420205681 남은비</div>
          <p>
            위 계좌로 <b>{price.toLocaleString()}원</b>을 입금해주세요.<br/>
          </p>
          <p>
            <span className='input-label'>입금하실 분 성함:</span>
            <input
              type='text'
              size='6'
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSameAsReceiver}
            /><br/>
            <span className='input-label'>전화번호:</span>
            <input
              type='text'
              size='14'
              pattern='[0-9]*'
              value={phone}
              maxLength={11}
              onChange={(e) => {
                if (e.target.validity.valid) setPhone(e.target.value)
              }}
              disabled={isSameAsReceiver}
            /><br/>
            <label className="checkbox-wrap">
              <input type="checkbox" checked={isSameAsReceiver} onChange={handleCheckboxChange}/>
              <span>받는 사람과 동일</span>
            </label>
          </p>
          <button className='large-btn' onClick={saveReservation}>
            예약하기
          </button>
        </section>
      </div>
    </div>
  );
}

export default Apple;