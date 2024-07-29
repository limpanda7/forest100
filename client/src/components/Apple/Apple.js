import Header from "../Header/Header";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import './Apple.scss';

const Apple = () => {
  const navigate = useNavigate();

  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [address, setAddress] = React.useState("");
  const [coupon, setCoupon] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [price, setPrice] = useState(0);

  const saveReservation = () => {

  }

  return (
    <>
      <Header
        title='백년한옥사과 예약하기'
        handleGoBack={() => navigate('/')}
      />
      <div className='Apple contents'>
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

        <section>
          <h2>🍎쿠폰코드</h2>
          <span className='input-label'>쿠폰코드:</span>
          <input type='text' value={coupon} size='6'
                 onChange={(e) => setCoupon(e.target.value)}/>
        </section>

        <section className='Deposit'>
          <h2>🍎입금하기</h2>
          <div className='BankAccount'>카카오 3333058451192 남은비</div>
          <p>
            위 계좌로 <b>{price.toLocaleString()}원</b>을 입금해주세요.<br/>
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
    </>
  );
}

export default Apple;