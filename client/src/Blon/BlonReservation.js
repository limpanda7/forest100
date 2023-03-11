import React, {useState, useEffect} from 'react';
import axios from "axios";
import ReactModal from 'react-modal';
import './Blon.scss';

const BlonReservation = ({picked, reservedName, reservedPhone}) => {
    const [howMany, setHowMany] = useState(4);      // 반려견 표함 총 인원수
    const [person, setPerson] = useState(4);
    const [baby, setBaby] = useState(0);
    const [dog, setDog] = useState(0);
    const [bedding, setBedding] = useState(0);
    const [barbecue, setBarbecue] = useState('N');
    const [studentEvent, setStudentEvent] = useState('N');
    const [basePrice, setBasePrice] = useState(0);
    const [price, setPrice] = useState(0);
    const [priceOption, setPriceOption] = useState('refundable');
    const [discount, setDiscount] = useState(0);
    const [receipt, setReceipt] = useState('N');
    const [tax, setTax] = useState(0);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [showRefund, setShowRefund] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showRevisitModal, setShowRevisitModal] = useState(false);
    const [revisit, setRevisit] = useState('N');
    // const [allWeekDay, setAllWeekDay] = useState(false);
    const [wholeUse, setWholeUse] = useState('N');

    useEffect(() => {
        calcPrice();
    }, [])

    useEffect(() => {
        calcHowMany();
    }, [person, baby, dog])

    useEffect(() => {
        calcPrice();
    }, [howMany, bedding, barbecue, receipt, studentEvent, priceOption, wholeUse])

    // 재방문 여부 확인
    const checkBeforeSave = () => {
        if (reservedName.includes(name) && reservedPhone.includes(phone)) {
            setPrice(price * 0.7);
            setShowRevisitModal(true);
            setRevisit('Y');
        } else {
            saveReservation();
        }
    }

    const saveReservation = () => {
        let autoBedding = 0;
        if (person + baby > 4) {
            autoBedding = 1;
        }
        axios.post('/api/saveReservation2', {picked, name, phone, person, baby, dog, autoBedding, barbecue, studentEvent, price, priceOption, receipt, revisit, wholeUse})
            .then(() => {
                alert(`예약해주셔서 감사합니다! 입금하실 금액은 ${price.toLocaleString()}원입니다.`);
                window.location.href = '/';
            })
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
        // 특수한 날짜만 처리하고 싶을 때 (체크아웃 일)
        const specialDays = ['2022-12-31'];
        let tempPrice = 0;

        let dayArr = [];
        for (const date of picked) {

            const dayIdx = new Date(date).getDay();
            if (holidays.includes(date)) {
                dayArr.push('holiday');
            } else if (specialDays.includes(date)) {
                dayArr.push('special');
            } else if (dayIdx === 0 || dayIdx === 6 || weekends.includes(date)) {
                dayArr.push('weekend');
            // } else if (date.slice(5, 7) === '01' || date.slice(5, 7) === '02') {
            //     dayArr.push('weekdayDiscount');
            } else {
                dayArr.push('weekday');
            }
        }

        for (let i = 0; i < dayArr.length - 1; i++) {
            if (dayArr[i + 1] === 'holiday') {
                tempPrice += global.config.onoff_holiday;
            } else if (dayArr[i + 1] === 'special') {
                tempPrice += 320000;
            } else if (dayArr[i + 1] === 'weekday') {   // 일월화수목
                if (studentEvent === 'Y') {
                    tempPrice += 180000;
                } else {
                    tempPrice += global.config.onoff_weekday;
                }
            } else if (dayArr[i + 1] === 'weekend') {    // 금토
                tempPrice += global.config.onoff_weekend;
            // } else if (dayArr[i + 1] === 'weekdayDiscount') {   // 1~3월 평일 할인
            //     if (studentEvent === 'Y') {
            //         tempPrice += 90000;
            //     } else {
            //         tempPrice += 100000;
            //     }
            }
        }

        const days = picked.length - 1;
        let totalPrice = tempPrice + (15000 * (howMany - 4)) * days;
        // let totalPrice = tempPrice + (12000 * (howMany - 4)) * days + (10000 * bedding);

        // if (!dayArr.includes('holiday') && !dayArr.includes('weekend')) {
        //     setAllWeekDay(true);
        //     if (wholeUse === 'Y')
        //         totalPrice += 50000;
        // }

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
        <div className='Reservation'>
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

            {/*{*/}
            {/*    allWeekDay &&*/}
            {/*    <div className='Barbecue'>*/}
            {/*        <h2>집 전체 사용</h2>*/}
            {/*        <div className='RadioBtn'>*/}
            {/*            <input type='radio' id='wholeUseY' onClick={() => setWholeUse('Y')} checked={wholeUse === 'Y'}/>*/}
            {/*            <label htmlFor='wholeUseY'><span/>예</label>*/}
            {/*            <input type='radio' id='wholeUseN' onClick={() => setWholeUse('N')} checked={wholeUse === 'N'}/>*/}
            {/*            <label htmlFor='wholeUseN'><span/>아니오</label>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*}*/}

            <section>
                <div className='Barbecue'>
                    <h2>바베큐 선택</h2>
                    <div className='RadioBtn'>
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

            {/*<div className='Barbecue'>*/}
            {/*    <h2>대학생 평일 할인</h2>*/}
            {/*    <p>학생증을 인증하시는 대학생에게 평일 10% 할인을 제공합니다.</p>*/}
            {/*    <div className='RadioBtn'>*/}
            {/*        <input type='radio' id='studentY' onClick={() => setStudentEvent('Y')} checked={studentEvent === 'Y'}/>*/}
            {/*        <label htmlFor='studentY'><span/>예</label>*/}
            {/*        <input type='radio' id='studentN' onClick={() => setStudentEvent('N')} checked={studentEvent === 'N'}/>*/}
            {/*        <label htmlFor='studentN'><span/>아니오</label>*/}
            {/*    </div>*/}
            {/*</div>*/}

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
                <div className='RadioBtn'>
                    <input type='radio' id='receiptY' onClick={() => setReceipt('Y')} checked={receipt === 'Y'}/>
                    <label htmlFor='receiptY'><span/>예</label>
                    <input type='radio' id='receiptN' onClick={() => setReceipt('N')} checked={receipt === 'N'}/>
                    <label htmlFor='receiptN'><span/>아니오</label>
                </div>
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
                    {/*{*/}
                    {/*    bedding > 0 &&*/}
                    {/*    <p><b>추가침구:</b> 10,000원 x {bedding}개</p>*/}
                    {/*}*/}
                    {/*{*/}
                    {/*    wholeUse === 'Y' &&*/}
                    {/*    <p><b>집 전체 사용:</b> 50,000원</p>*/}
                    {/*}*/}
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
                <div className='BankAccount'>카카오 3333053810252 채민기</div>
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
                <button className='ReservationBtn' onClick={() => openModal(true)}>예약하기</button>
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
                    <li>주방에서 조리가 가능합니다  *고기나 생선구이, 튀김 등 냄새가 심한 요리를 금합니다. 간단한 요리, 밀키트 조리, 포장음식을 데워 드시기에 적합할 정도로 조리도구가 준비되어있습니다.</li>
                    <li>침구 오염시 얼룩 제거 비용이 발생할 수 있으며, 제거 불가한 심한 얼룩이 생겼을 시 제품 구매 비용이 청구될수있습니다.</li>
                    <li>모든 시설물·비품·소품의 이동을 삼가 주시기 바랍니다.</li>
                    <li>실내외 모든 시설물 및 소품 및 비품의 훼손· 분실·파손 시  복구비용 및 영업손실 비용을 부담하셔야 합니다. 문제 발생 시 당황하시지 마시고 바로 연락 주시기 바랍니다.</li>
                    <li>게스트의 부주의로 인해 일어난 안전사고, 귀중품 분실 및 파손은 호스트의 책임사항이 아닙니다.</li>
                    <li>밤 10시 이후 정숙해주세요. 조용한 시골이라 주민분들이 일찍 주무십니다. </li>
                    <li>지역 특성상 벌레와 곤충이 실내로 유입될 수 있습니다. 벌레 혹은 곤충에 예민하신 분들은 예약에 신중을 기해주세요. 이로 인한 환불은 불가합니다.</li>
                </ul>
                <div className='BtnWrap'>
                    <button className='ModalBtn' onClick={() => setShowModal(false)}>거부</button>
                    <button className='ModalBtn' onClick={() => checkBeforeSave()}>동의</button>
                </div>
            </ReactModal>

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
