import React, {useState, useEffect} from 'react';
import axios from "axios";
import './App.scss';

const Reservation = ({picked, setPicked, setCurrentPage}) => {

    const [howMany, setHowMany] = useState(2);
    const [adult, setAdult] = useState(2);
    const [baby, setBaby] = useState(0);
    const [dog, setDog] = useState(0);
    const [priceOption, setPriceOption] = useState('refundable');
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        calcPrice();
    }, [])

    useEffect(() => {
        calcHowMany();
    }, [adult, baby, dog])

    useEffect(() => {
        calcPrice();
    }, [howMany, priceOption])

    const saveReservation = () => {
        axios.post('/api/saveReserved', {picked})
            .then((res) => {
                alert('예약 신청이 완료되었습니다.');
                setCurrentPage('Home');
            })
    }

    const calcHowMany = () => {
        if (adult === 1) {
            setHowMany(2 + baby + dog);
        } else {
            setHowMany(adult + baby+ dog);
        }
    }

    const calcPrice = () => {
        const days = picked.length - 1;
        let price = (240000 + (12000 * (howMany - 2))) * days;
        if (adult + baby >= 5) {
            price += 30000 * days;
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
        <div>
            <button onClick={() => {setCurrentPage('Home'); setPicked([])}}>뒤로가기</button>

            <h2>선택한 날짜</h2>
            <ul>
                {picked.map(element => {return <li>{element}</li>})}
            </ul>

            <div className='HowMany'>
                <h2>인원수 선택</h2>
                <div className='People'>
                    <p>성인</p>
                    <button onClick={() => {if (adult > 1) setAdult(adult - 1)}}>-</button>
                    <span>{adult}</span>
                    <button onClick={() => setAdult(adult + 1)}>+</button>
                </div>
                <div className='Baby'>
                    <p>유아</p>
                    <button onClick={() => {if (baby > 0) setBaby(baby - 1)}}>-</button>
                    <span>{baby}</span>
                    <button onClick={() => setBaby(baby + 1)}>+</button>
                </div>
                <div className='Dog'>
                    <p>반려견</p>
                    <button onClick={() => {if (dog > 0) setDog(dog - 1)}}>-</button>
                    <span>{dog}</span>
                    <button onClick={() => setDog(dog + 1)}>+</button>
                </div>
                <p className='Notice'>5명 이상 숙박 시 사랑방 이용요금<br/>(1박 30,000원)이 추가됩니다.</p>
            </div>

            <h2>총 이용요금</h2>
            <input type='radio' id='refundable' onChange={() => setPriceOption('refundable')} checked={priceOption === 'refundable'}/>
            <label htmlFor='refundable'>환불가능 (예약금 + 잔금)</label>
            <br/>
            <input type='radio' id='nonrefundable' onClick={() => setPriceOption('nonrefundable')} checked={priceOption === 'nonrefundable'}/>
            <label htmlFor='nonrefundable'>환불불가 10% 할인 (일시불)</label>

            <h3>{price}원</h3>
            <div className='PriceDetail'>
                <p>기본요금: 240,000원 x {picked.length - 1}박</p>
                <p>인원초과: 12,000원 x {howMany - 2}명 x {picked.length - 1}박</p>
                {
                    adult + baby >= 5 &&
                    <p>사랑방: 30,000원 x {picked.length - 1}박</p>
                }
                <p>할인금액: {discount}원</p>
            </div>


        </div>
    );
}

export default Reservation;