import React, {useState, useEffect} from 'react';
import axios from "axios";
import ReactModal from 'react-modal';
import {BLON_PRICE} from "../../constants";

const BlonReservation = ({picked, reservedName, reservedPhone}) => {
    const [howMany, setHowMany] = useState(4);      // 반려견 표함 총 인원수
    const [person, setPerson] = useState(4);
    const [baby, setBaby] = useState(0);
    const [dog, setDog] = useState(0);
    const [barbecue, setBarbecue] = useState('N');
    const [basePrice, setBasePrice] = useState(0);
    const [price, setPrice] = useState(0);
    const [priceOption, setPriceOption] = useState('refundable');
    const [discount, setDiscount] = useState(0);
    const [receipt, setReceipt] = useState('N');
    const [receiptNum, setReceiptNum] = useState('');
    const [tax, setTax] = useState(0);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [showRefund, setShowRefund] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showRevisitModal, setShowRevisitModal] = useState(false);
    const [revisit, setRevisit] = useState('N');

    useEffect(() => {
        calcPrice();
    }, [])

    useEffect(() => {
        calcHowMany();
    }, [person, baby, dog])

    useEffect(() => {
        calcPrice();
    }, [howMany, barbecue, receipt, priceOption])

    // 재방문 여부 확인
    const checkBeforeSave = () => {
        if (name === '' || phone === '' || (receipt === 'Y' && receiptNum === '')) {
            alert('정보를 모두 입력해주세요.')
            return false;
        }

        if (reservedName.includes(name) && reservedPhone.includes(phone)) {
            setPrice(price * 0.7);
            setShowRevisitModal(true);
            setRevisit('Y');
        } else {
            saveReservation();
        }
    }

    const saveReservation = () => {
        const bedding = person > 4 ? 1 : 0;
        try {
            axios.post('/api/reservation/blon', {picked, name, phone, person, baby, dog, bedding, barbecue, price, priceOption, receipt, receiptNum, revisit})
              .then(() => {
                  alert(`예약해주셔서 감사합니다! 입금하실 금액은 ${price.toLocaleString()}원입니다.`);
                  window.location.href = '/';
              })
        } catch (e) {
            alert('오류가 발생했습니다. 관리자에게 문의해주세요.');
            console.log('error: /api/reservation/blon');
            console.log({picked, name, phone, person, baby, dog, bedding, barbecue, price, priceOption, receipt, receiptNum, revisit});
        }
    }

    const calcHowMany = () => {
        if (person + dog < 4) {
            setHowMany(4);
        } else {
            setHowMany(person + dog);
        }
    }

    const calcPrice = () => {

        // 연휴 (체크아웃 일)
        const holidays = ['2022-12-25','2023-01-01','2023-01-21','2023-01-22','2023-01-23','2023-01-24'];
        // 평일을 주말로 처리하고 싶을 때 (체크아웃 일)
        const weekends = ['2022-12-26','2023-01-02','2023-03-01','2023-05-05'];

        const isSummer = (date) => {
            return date.slice(5, 7) === '07' || date.slice(5, 7) === '08'
        }

        let dayArr = [];
        for (const date of picked) {
            let dayType;

            const dayIdx = new Date(date).getDay();

            if (isSummer(date)) {
                if (holidays.includes(date)) {
                    dayType = 'summerHoliday';
                } else if (dayIdx === 0 || dayIdx === 6 || weekends.includes(date)) {
                    dayType = 'summerWeekend';
                } else {
                    dayType = 'summerWeekday';
                }
            } else {
                if (holidays.includes(date)) {
                    dayType = 'normalHoliday';
                } else if (dayIdx === 0 || dayIdx === 6 || weekends.includes(date)) {
                    dayType = 'normalWeekend';
                } else {
                    dayType = 'normalWeekday';
                }
            }

            dayArr.push(dayType);
        }

        let tempPrice = 0;
        for (let i = 0; i < dayArr.length - 1; i++) {
            switch (dayArr[i + 1]) {
                case 'summerHoliday':
                    tempPrice += BLON_PRICE.SUMMER.HOLIDAY;
                    break;
                case 'summerWeekend':
                    tempPrice += BLON_PRICE.SUMMER.WEEKEND;
                    break;
                case 'summerWeekday':
                    tempPrice += BLON_PRICE.SUMMER.WEEKDAY;
                    break;
                case 'normalHoliday':
                    tempPrice += BLON_PRICE.NORMAL.HOLIDAY;
                    break;
                case 'normalWeekend':
                    tempPrice += BLON_PRICE.NORMAL.WEEKEND;
                    break;
                case 'normalWeekday':
                    tempPrice += BLON_PRICE.NORMAL.WEEKDAY;
                    break;
            }
        }

        const days = picked.length - 1;
        let totalPrice = tempPrice + (15000 * (howMany - 4)) * days;

        if (barbecue === 'Y') {
            totalPrice += 20000;
        }

        if (priceOption === 'nonrefundable') {
            setDiscount(totalPrice * 0.1);
            totalPrice *= 0.9;
        } else {
            setDiscount(0);
        }

        if (receipt === 'Y') {
            setTax(totalPrice * 0.1);
            totalPrice *= 1.1;
        } else {
            setTax(0);
        }

        setBasePrice(tempPrice);
        setPrice(totalPrice);
    }

    const toggleRefund = () => {
        if (showRefund) setShowRefund(false);
        else setShowRefund(true);
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
        <div className='reservation'>
            <section>
                <h2>선택한 날짜</h2>
                <ul>
                    {picked.map(element => {return <li>{element}</li>})}
                </ul>
            </section>

            <section className='HowMany'>
                <h2>인원수 선택 (최대 6인)</h2>
                <div>
                    <p>인원</p>
                    <button onClick={() => {if (person > 1) setPerson(person - 1)}}>-</button>
                    <span>{person}</span>
                    <button onClick={() => {if (person + baby < 6) setPerson(person + 1)}}>+</button>
                </div>
                <div>
                    <p>영유아(36개월 미만)</p>
                    <button onClick={() => {if (baby > 0) setBaby(baby - 1)}}>-</button>
                    <span>{baby}</span>
                    <button onClick={() => {if (person + baby < 6) setBaby(baby + 1)}}>+</button>
                </div>
                <div>
                    <p>반려견</p>
                    <button onClick={() => {if (dog > 0) setDog(dog - 1)}}>-</button>
                    <span>{dog}</span>
                    <button onClick={() => setDog(dog + 1)}>+</button>
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
                <input type='radio' id='refundable' onClick={() => setPriceOption('refundable')} checked={priceOption === 'refundable'}/>
                <label htmlFor='refundable'><span/><b>환불가능 옵션</b></label>
                <p>예약 취소 시 <a onClick={() => toggleRefund()}>환불 규정</a>에 따라서 환불이 진행됩니다.</p>

                {
                    showRefund &&
                    <ul className='List'>
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

                <input type='radio' id='nonrefundable' onClick={() => setPriceOption('nonrefundable')} checked={priceOption === 'nonrefundable'}/>
                <label htmlFor='nonrefundable'><span/><b>환불불가 옵션</b></label>
                <p>10% 할인을 제공합니다. 예약을 취소하더라도 환불이 불가합니다.</p>
            </section>

            <section>
                <h2 style={{display: 'inline-block'}}>현금영수증 신청</h2>
                <span> (부가세 10% 별도)</span>
                <div>
                    <input type='radio' id='receiptY' onClick={() => setReceipt('Y')} checked={receipt === 'Y'}/>
                    <label htmlFor='receiptY'><span/>예</label>
                    <input type='radio' id='receiptN' onClick={() => setReceipt('N')} checked={receipt === 'N'}/>
                    <label htmlFor='receiptN'><span/>아니오</label>
                </div>
                {
                    receipt === 'Y' &&
                    <p>
                        <span>신청할 전화번호 or 사업자번호:</span>
                        <input type='text' size='14' pattern='[0-9]*' value={receiptNum}
                             onChange={(e) => {
                                 if (e.target.validity.valid) setReceiptNum(e.target.value)
                             }}
                        />
                    </p>
                }
            </section>

            <section className='PriceTotal'>
                <h2>총 이용요금</h2>
                <h2 className='Price'>{price.toLocaleString()}원</h2>
                <div className='PriceDetail'>
                    <p><b>숙박요금:</b> {basePrice.toLocaleString()}원 (총 {picked.length - 1}박)</p>
                    {
                        howMany > 4 &&
                        <p><b>인원초과:</b> 15,000원 x {howMany - 4}명 x {picked.length - 1}박</p>
                    }
                    {
                        barbecue === 'Y' &&
                        <p><b>바베큐:</b> 20,000원</p>
                    }
                    {
                        discount > 0 &&
                        <p><b>환불불가 할인:</b> -{discount.toLocaleString()}원</p>
                    }
                    {
                        receipt === 'Y' &&
                        <p><b>부가세:</b> {tax.toLocaleString()}원</p>
                    }
                </div>
            </section>

            <section className='Deposit'>
                <h2>입금하기</h2>
                <div className='BankAccount'>우체국 01414202194793 남은진</div>
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
                <button className='ReservationBtn' onClick={() => checkBeforeSave()}>예약하기</button>
            </section>

            <ReactModal
              isOpen={showRevisitModal}
              style={modalStyle}
            >
                <div className='ModalTitle'>재방문 할인</div>
                <div className='ModalContent'>
                    다시 한 번 찾아주셔서 감사합니다. 30% 할인을 제공드립니다.<br/>
                    최종 금액은 {price.toLocaleString()}원 입니다.
                </div>
                <div className='BtnWrap'>
                    <button className='ModalBtn Alone' onClick={() => saveReservation()}>예약하기</button>
                </div>
            </ReactModal>
        </div>
    );
}

export default BlonReservation;
