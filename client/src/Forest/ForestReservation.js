import React, {useState, useEffect} from 'react';
import axios from "axios";
import './Forest.scss';

const ForestReservation = ({picked, setPicked, setCurrentPage, getReserved}) => {

    const [howMany, setHowMany] = useState(2);
    const [adult, setAdult] = useState(2);
    const [baby, setBaby] = useState(0);
    const [dog, setDog] = useState(0);
    const [guestRoom, setGuestRoom] = useState('N');
    const [barbecue, setBarbecue] = useState('N');
    const [barbecueEvent, setBarbecueEvent] = useState(false);
    const [price, setPrice] = useState(0);
    const [priceOption, setPriceOption] = useState('refundable');
    const [discount, setDiscount] = useState(0);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        calcPrice();
    }, [])

    useEffect(() => {
        calcHowMany();
        if (adult + baby <= 4) {
            setGuestRoom('N');
        }
    }, [adult, baby, dog])

    useEffect(() => {
        calcPrice();
    }, [howMany, guestRoom, barbecue, barbecueEvent, priceOption])

    const saveReservation = () => {

        if (name === '' || phone === '') {
            alert('정보를 모두 입력해주세요.')
            return false;
        }

        axios.post('/api/saveReservation', {picked, name, phone, adult, baby, dog, guestRoom, barbecue, barbecueEvent, price, priceOption})
            .then((res) => {
                if (priceOption === 'refundable') {
                    alert(`예약해주셔서 감사합니다! 입금하실 금액은 ${price * 0.1}원입니다.`);
                } else {
                    alert(`예약해주셔서 감사합니다! 입금하실 금액은 ${price}원입니다.`);
                }
                window.location.reload();
            })
    }

    const calcHowMany = () => {
        if (adult === 1 && baby === 0 && dog=== 0) {
            setHowMany(2);
        } else {
            setHowMany(adult + baby + dog);
        }
    }

    const calcPrice = () => {
        const days = picked.length - 1;

        let price = (300000 + (12000 * (howMany - 2))) * days;

        if (guestRoom === 'Y') {
            price += 50000 * days;
        }
        if (barbecue === 'Y' && barbecueEvent === false) {
            price += 20000;
        }
        if (priceOption === 'nonrefundable') {
            setDiscount(price * 0.1);
            price *= 0.9;
        } else {
            setDiscount(0);
        }
        setPrice(price);
    }

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
            </div>

            {
                adult + baby > 4 &&
                    <div>
                        <p>사랑방 이용 (1박 50,000원)</p>
                        <div>
                            <input type='radio' id='guestRoomY' onClick={() => setGuestRoom('Y')} checked={guestRoom === 'Y'}/>
                            <label htmlFor='guestRoomY'><span/>예</label>
                            <input type='radio' id='guestRoomN' onClick={() => setGuestRoom('N')} checked={guestRoom === 'N'}/>
                            <label htmlFor='guestRoomN'><span/>아니오</label>
                        </div>
                    </div>
            }

            <div className='Barbecue'>
                <h2>바베큐 선택</h2>
                <div className='RadioBtn'>
                    <input type='radio' id='barbecueY' onClick={() => setBarbecue('Y')} checked={barbecue === 'Y'}/>
                    <label htmlFor='barbecueY'><span/>예</label>
                    <input type='radio' id='barbecueN' onClick={() => setBarbecue('N')} checked={barbecue === 'N'}/>
                    <label htmlFor='barbecueN'><span/>아니오</label>
                </div>
                {
                    barbecue === 'Y' &&
                    <p>
                        ★★★유투브 영상 댓글 이벤트★★★<br/>
                        숙박 하신 후 <a href='https://youtu.be/2PQT69JwiEY' target='_blank'>숙소 소개영상</a>에 댓글을 달아 주시면 바베큐를 무료로 이용하실 수 있습니다.<br/>
                        이벤트에 참여하시려면 체크하세요
                        <input type='checkbox' onClick={(e) => setBarbecueEvent(e.target.checked)}/>
                    </p>
                }
            </div>

            <div className='PriceOption'>
                <h2>환불옵션 선택</h2>
                <input type='radio' id='refundable' onClick={() => setPriceOption('refundable')} checked={priceOption === 'refundable'}/>
                <label htmlFor='refundable'><span/><b>환불가능 옵션</b></label>
                <p>
                    예약할 때 예약금을 10% 지불하고, 체크인 이틀 전 나머지 90%를 지불합니다. <br/>
                    예약을 취소하더라도 예약금은 환불되지 않습니다. 원활한 서비스를 위해 양해 부탁드립니다 :-)
                </p>
                <br/>
                <input type='radio' id='nonrefundable' onClick={() => setPriceOption('nonrefundable')} checked={priceOption === 'nonrefundable'}/>
                <label htmlFor='nonrefundable'><span/><b>환불불가 옵션 (10% 할인)</b></label>
                <p>예약할 때 100% 지불합니다. 예약을 취소하더라도 환불이 불가합니다.</p>
            </div>

            <div className='PriceTotal'>
                <h2>총 이용요금</h2>
                <h2 className='Price'>{price.toLocaleString()}원</h2>
                <div className='PriceDetail'>
                    <p><b>2인기준:</b> 300,000원 x {picked.length - 1}박</p>
                    {
                        howMany > 2 &&
                        <p><b>인원초과:</b> 12,000원 x {howMany - 2}명 x {picked.length - 1}박</p>
                    }
                    {
                        guestRoom === 'Y' &&
                        <p><b>사랑방:</b> 50,000원 x {picked.length - 1}박</p>
                    }
                    {
                        barbecue === 'Y' &&
                        <p><b>바베큐:</b> {barbecueEvent ? '0원' : '20,000원'}</p>
                    }
                    {
                        discount > 0 &&
                        <p><b>환불옵션 할인금액:</b> {discount}원</p>
                    }
                </div>
            </div>

            <div className='Deposit'>
                <h2>입금하기</h2>
                <div className='BankAccount'>카카오뱅크 3333058451192 남은비</div>
                <span>입금하실 분 성함:</span>
                <input type='text' size='6' onChange={(e) => setName(e.target.value)}/><br/>
                <span>전화번호:</span>
                <input type='text' size='14' onChange={(e) => setPhone(e.target.value)}/>
                {
                    priceOption === 'refundable' &&
                        <>
                            <p>
                                위 계좌로 예약금 <b>{(price * 0.1).toLocaleString()}원</b>을 입금해주세요.<br/>
                                3시간 내에 입금 해 주셔야 예약이 확정됩니다.
                            </p>
                        </>
                }
                {
                    priceOption === 'nonrefundable' &&
                    <>
                        <p>
                            위 계좌로 <b>{price.toLocaleString()}원</b>을 입금해주세요.<br/>
                            3시간 내에 입금 해 주셔야 예약이 확정됩니다.
                        </p>
                    </>
                }
            </div>

            <button className='ReservationBtn' onClick={() => saveReservation()}>예약완료</button>


        </div>
    );
}

export default ForestReservation;