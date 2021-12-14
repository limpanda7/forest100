import React, {useState, useEffect} from 'react';
import axios from "axios";
import ReactModal from 'react-modal';
import './OnOff.scss';

const OnOffReservation = ({picked, setPicked, setCurrentPage, getReserved}) => {

    const [howMany, setHowMany] = useState(4);
    const [adult, setAdult] = useState(4);
    const [baby, setBaby] = useState(0);
    const [dog, setDog] = useState(0);
    const [bedding, setBedding] = useState(0);
    const [barbecue, setBarbecue] = useState('N');
    const [studentEvent, setStudentEvent] = useState('N');
    const [basePrice, setBasePrice] = useState(0);
    const [price, setPrice] = useState(0);
    const [priceOption, setPriceOption] = useState('refundable');
    const [discount, setDiscount] = useState(0);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [showRefund, setShowRefund] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        calcPrice();
    }, [])

    useEffect(() => {
        calcHowMany();
    }, [adult, baby, dog])

    useEffect(() => {
        calcPrice();
    }, [howMany, bedding, barbecue, studentEvent, priceOption])

    const saveReservation = () => {
        axios.post('/api/saveReservation2', {picked, name, phone, adult, baby, dog, bedding, barbecue, studentEvent, price, priceOption})
            .then(() => {
                alert(`예약해주셔서 감사합니다! 입금하실 금액은 ${price.toLocaleString()}원입니다.`);
                window.location.href = '/';
            })
    }

    const calcHowMany = () => {
        if (adult + baby + dog < 4) {
            setHowMany(4);
        } else {
            setHowMany(adult + baby + dog);
        }
    }

    const calcPrice = () => {

        const holidays = ['2022-01-01','2022-01-02','2022-01-29','2022-01-30','2022-01-31','2022-02-01','2022-02-02'];
        let tempPrice = 0;

        let dayArr = [];
        for (const date of picked) {

            const dayIdx = new Date(date).getDay();
            if (holidays.includes(date)) {
                dayArr.push('holiday');
            } else if (dayIdx === 0 || dayIdx === 6) {
                dayArr.push('weekend');
            } else if (date.slice(5, 7) === '01' || date.slice(5, 7) === '02' || date.slice(5, 7) === '03') {
                dayArr.push('weekdayDiscount');
            } else {
                dayArr.push('weekday');
            }
        }

        for (let i = 0; i < dayArr.length - 1; i++) {
            if (dayArr[i + 1] === 'holiday') {
                tempPrice += 400000;
            } else if (dayArr[i + 1] === 'weekday') {   // 일월화수목
                if (studentEvent === 'Y') {
                    tempPrice += 135000;
                } else {
                    tempPrice += 150000;
                }
            } else if (dayArr[i + 1] === 'weekend') {    // 금토
                tempPrice += 300000;
            } else if (dayArr[i + 1] === 'weekdayDiscount') {   // 1~3월 평일 할인
                if (studentEvent === 'Y') {
                    tempPrice += 90000;
                } else {
                    tempPrice += 100000;
                }
            }
        }

        const days = picked.length - 1;
        let totalPrice = tempPrice + (12000 * (howMany - 4)) * days + (10000 * bedding);
        if (barbecue === 'Y') {
            totalPrice += 20000;
        }
        if (priceOption === 'nonrefundable') {
            setDiscount(price * 0.1);
            totalPrice *= 0.9;
        } else {
            setDiscount(0);
        }

        setBasePrice(tempPrice);
        setPrice(totalPrice);
    }

    const toggleRefund = () => {
        if (showRefund) setShowRefund(false);
        else setShowRefund(true);
    }

    const openModal = () => {
        if (name === '' || phone === '') {
            alert('정보를 모두 입력해주세요.')
            return false;
        }

        setShowModal(true);
    }

    const modalStyle = {
        content: {
            width: '80%',
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
        <div className='Reservation'>
            <button onClick={() => {setCurrentPage('Home'); setPicked([])}}>뒤로가기</button>

            <h2>선택한 날짜</h2>
            <ul>
                {picked.map(element => {return <li>{element}</li>})}
            </ul>

            <div className='HowMany'>
                <h2>인원수 선택</h2>
                <div>
                    <p>성인</p>
                    <button onClick={() => {if (adult > 1) setAdult(adult - 1)}}>-</button>
                    <span>{adult}</span>
                    <button onClick={() => setAdult(adult + 1)}>+</button>
                </div>
                <div>
                    <p>유아</p>
                    <button onClick={() => {if (baby > 0) setBaby(baby - 1)}}>-</button>
                    <span>{baby}</span>
                    <button onClick={() => setBaby(baby + 1)}>+</button>
                </div>
                <div>
                    <p>반려견</p>
                    <button onClick={() => {if (dog > 0) setDog(dog - 1)}}>-</button>
                    <span>{dog}</span>
                    <button onClick={() => setDog(dog + 1)}>+</button>
                </div>
                <br/>
                <div>
                    <p>추가침구</p>
                    <button onClick={() => {if (bedding > 0) setBedding(bedding - 1)}}>-</button>
                    <span>{bedding}</span>
                    <button onClick={() => setBedding(bedding + 1)}>+</button>
                </div>
            </div>

            <div className='Barbecue'>
                <h2>바베큐 선택</h2>
                <div className='RadioBtn'>
                    <input type='radio' id='barbecueY' onClick={() => setBarbecue('Y')} checked={barbecue === 'Y'}/>
                    <label htmlFor='barbecueY'><span/>예</label>
                    <input type='radio' id='barbecueN' onClick={() => setBarbecue('N')} checked={barbecue === 'N'}/>
                    <label htmlFor='barbecueN'><span/>아니오</label>
                </div>
            </div>

            <div className='Barbecue'>
                <h2>대학생 평일 할인</h2>
                <p>학생증을 인증하시는 대학생에게 평일 10% 할인을 제공합니다.</p>
                <div className='RadioBtn'>
                    <input type='radio' id='studentY' onClick={() => setStudentEvent('Y')} checked={studentEvent === 'Y'}/>
                    <label htmlFor='studentY'><span/>예</label>
                    <input type='radio' id='studentN' onClick={() => setStudentEvent('N')} checked={studentEvent === 'N'}/>
                    <label htmlFor='studentN'><span/>아니오</label>
                </div>
            </div>

            <div className='PriceOption'>
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

                <br/>
                <input type='radio' id='nonrefundable' onClick={() => setPriceOption('nonrefundable')} checked={priceOption === 'nonrefundable'}/>
                <label htmlFor='nonrefundable'><span/><b>환불불가 옵션</b></label>
                <p>10% 할인을 제공합니다. 예약을 취소하더라도 환불이 불가합니다.</p>
            </div>

            <div className='PriceTotal'>
                <h2>총 이용요금</h2>
                <h2 className='Price'>{price.toLocaleString()}원</h2>
                <div className='PriceDetail'>
                    <p><b>숙박요금:</b> {basePrice.toLocaleString()}원 (총 {picked.length - 1}박)</p>
                    {
                        howMany > 4 &&
                        <p><b>인원초과:</b> 12,000원 x {howMany - 4}명 x {picked.length - 1}박</p>
                    }
                    {
                        bedding > 0 &&
                        <p><b>추가침구:</b> 10,000원 x {bedding}개</p>
                    }
                    {
                        barbecue === 'Y' &&
                        <p><b>바베큐:</b> 20,000원</p>
                    }
                    {
                        discount > 0 &&
                        <p><b>환불불가할인:</b> -{discount.toLocaleString()}원</p>
                    }
                </div>
            </div>

            <div className='Deposit'>
                <h2>입금하기</h2>
                <div className='BankAccount'>카카오 3333053810252 채민기</div>
                <span>입금하실 분 성함:</span>
                <input type='text' size='6' onChange={(e) => setName(e.target.value)}/><br/>
                <span>전화번호:</span>
                <input type='text' size='14' onChange={(e) => setPhone(e.target.value)}/>
                <p>
                    위 계좌로 <b>{price.toLocaleString()}원</b>을 입금해주세요.<br/>
                    3시간 내에 입금 해 주셔야 예약이 확정됩니다.
                </p>
            </div>

            <button className='ReservationBtn' onClick={() => openModal(true)}>예약하기</button>

            <ReactModal
                isOpen={showModal}
                style={modalStyle}
            >
                <div className='ModalTitle'>예약 전 주의사항</div>
                <ul className='ModalList'>
                    <li>예약하신 인원 외 방문자 및 반려동물의 입실은 불가합니다.</li>
                    <li>실내 공간에서 절대 금연입니다.</li>
                    <li>안전과 방범을 위해 CCTV가 설치되어 있습니다.</li>
                    <li>주방에서 조리가 가능합니다  *고기나 생선구이, 튀김 등 냄새가 심한 요리를 금합니다. 간단한 요리, 밀키트 조리, 포장음식을 데워 드시기에 적합할 정도로 조리도구가 준비되어있습니다. 깨끗한 환경이 오래 유지될 수 있도록 배려 부탁드립니다</li>
                    <li>침구 오염시 얼룩 제거 비용이 발생할 수 있으며, 제거 불가한 심한 얼룩이 생겼을 시 제품 구매 비용이 청구될수있습니다.</li>
                    <li>모든 시설물·비품·소품의 이동을 삼가 주시기 바랍니다.</li>
                    <li>실내외 모든 시설물 및 소품 및 비품의 훼손· 분실·파손 시  복구비용 및 영업손실 비용을 부담하셔야 합니다. 문제 발생 시 당황하시지 마시고 바로 연락 주시기 바랍니다.</li>
                    <li>게스트의 부주의로 인해 일어난 안전사고, 귀중품 분실 및 파손은 호스트의 책임사항이 아닙니다.</li>
                    <li>조용한 시골 마을입니다. 이웃분들께 피해가 되는 행동은 삼가부탁드립니다.</li>
                    <li>방역을 실시하고 있으나, 지역 특성상 벌레와 곤충이 실내로 유입될 수 있습니다. 벌레 혹은 곤충에 예민하신 분들은 예약에 신중을 기해주세요. 이로 인한 환불은 불가합니다.</li>
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