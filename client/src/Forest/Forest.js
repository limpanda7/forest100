import React, {useState, useEffect} from 'react';
import axios from "axios";
import './Forest.scss';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import Slider from 'react-slick';
import ForestReservation from "./ForestReservation";
import Layout from "../Layout/Layout";

const Forest = () => {

    const [reserved, setReserved] = useState([]);
    const [showLocation, setShowLocation] = useState(false);
    const [picked, setPicked] = useState([]);
    const [currentPage, setCurrentPage] = useState('Home');

    useEffect(() => {
        getReserved();
    }, []);

    const getReserved = () => {
        axios.get('/api/getReserved')
            .then((res) => {
                let tempArr = [];
                for (const element of res.data) {
                    tempArr.push(moment(element.date).format('YYYY-MM-DD'));
                }
                setReserved(tempArr);
            });
    }

    const moveToReservation = () => {
        if (picked.length === 0) {
            alert('예약 날짜를 선택해주세요!')
            return false;
        } else {
            setCurrentPage('Reservation');
            window.scrollTo(0, 0);
        }
    }

    const toggleLocation = () => {
        if (showLocation === true) setShowLocation(false);
        else setShowLocation(true);
    }

    const calcRange = (value) => {
        let tempArr = [];

        // 모든 날짜 계산
        let startDate = new Date(value[0]);
        let endDate = new Date(value[1]);
        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);
        while(startDate <= endDate) {
            tempArr.push(startDate.toISOString().split("T")[0]);
            startDate.setDate(startDate.getDate() + 1);
        }

        // 마감된 날짜와 겹치는지 여부
        for (const element of tempArr) {
            if (reserved.includes(element)) {
                alert('예약할 수 없는 날짜가 포함되어 있습니다. 날짜를 다시 선택해주세요.');
                return false;
            }
        }

        setPicked(tempArr);
    }

    return (
        <Layout>
            <div className="Forest">
            {
                currentPage === 'Home' &&
                    <>
                        <h2 className='Title'>
                            <span>백년 한옥 별채</span>에서<br/>
                            편안한 시골체험을 해보세요.
                        </h2>

                        <iframe className='Video'
                                src="https://www.youtube.com/embed/2PQT69JwiEY"
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen></iframe>

                        <div className='Clean'>
                            코로나확산 방지를 위해 마스크를 반드시 착용해주시고 손씻기와 방역에 동참해주시길 부탁드립니다.<br/>
                            침구는 항상 청결하게 준비되어 있으니 안심하시고 찾아주세요!
                        </div>

                        <ul className='List'>
                            <li>
                                100년된 한옥의 별채입니다 :-)<br/>
                                주변에는 피톤치드 가득한 산책로가 있고 여러종류의 꽃과 나무, 그리고 열매도 맛볼수 있습니다.
                            </li>
                            <li>넓은 마당이 있어 차량 3대 이상도 주차가 가능합니다.</li>
                            <li>텃밭에서 나는 채소들을 직접 재배하여 요리할 수 있도록 제공합니다.</li>
                            <li>반려견은 인원수에 포함합니다. 털날림이 적은 견종만 가능합니다.</li>
                        </ul>

                        <hr/>

                        <h2>침대/침구 유형</h2>
                        <div className='Beds'>
                            <div className='Bed'>
                                <b>1번 침실</b><br/>
                                더블 침대 1개
                            </div>
                            <div className='Bed'>
                                <b>2번 침실</b><br/>
                                싱글 침대 1개
                            </div>
                        </div>

                        <hr/>

                        <h2>편의시설</h2>
                        <ul className='List'>
                            <li>TV</li>
                            <li>무선 인터넷</li>
                            <li>에어컨, 난방</li>
                            <li>주방 (전자레인지, 냉장고, 전기밥솥)</li>
                            <li>기본 조리도구, 식기류</li>
                            <li>바베큐 그릴</li>
                            <li>발코니</li>
                            <li>뒷마당</li>
                            <li>무료주차</li>
                        </ul>

                        <hr/>
                        <h2>위치</h2>

                        <iframe className='Map'
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3166.511124703915!2d129.1265640155865!3d37.472263137278524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3561b9b40c1818d9%3A0xef52d1dc46730d66!2z6rCV7JuQ64-EIOuPme2VtOyLnCDrjIDqtazrj5kg6rWs66-47Iuk6ri4IDk2LTE!5e0!3m2!1sko!2skr!4v1621694052376!5m2!1sko!2skr"
                                allowFullScreen="" loading="lazy"/>
                        <a href='geo:37.4722631,129.126564?q=구미실길+96-1' target='_blank'>지도 앱에서 보기</a>
                        <p>주변에 주택이 많고 대부분 농사를 지으시는 분들입니다. 시골감성을 마음껏 누리세요!</p>

                        <button className='LocationBtn' onClick={() => toggleLocation()}>자세한 위치 정보</button>

                        {
                            showLocation &&
                            <ul className='List Location'>
                                <li><b>도로명 주소</b><br/>
                                    강원도 동해시 구미실길 96-1</li>
                                <li>SK주유소를 끼고 오른쪽 아랫길로 내려와 담벼락을 끼고 쭉 오시면, 언덕길 지나 3거리에서 좌회전 하면 숙소가 보입니다.<br/>
                                    (가끔 네비가 다른 곳으로 인도하는 경우가 있다고 하는데 참고해주세요!)</li>
                                <li>동해역(ktx, 무궁화) > 숙소<br/>
                                    - 버스 21-1 (22분) +도보8분<br/>
                                    - 택시 3.9km (6분)</li>
                                <li><b>인근해변</b><br/>
                                    -추암 촛대바위/해수욕장<br/>
                                    버스 :북평국가산업단지 정류장 >161 or 162번<br/>
                                    약 18분<br/>
                                    택시 :3km 약4분<br/>
                                    #백사장은 작으나 야경이 멋지고 음식점과 카페가 많습니다.<br/><br/>

                                    -삼척쏠비치 :4.3km 자가용으로 6분<br/>
                                    #추암해수욕장과 인접해있으며 워터파크가 있습니다.<br/><br/>

                                    -망상해수욕장:16km 자가용으로 22분<br/>
                                    #백사장이 넓은편이며 오토캠핑과 서핑을 즐기기에 적합합니다.</li>
                            </ul>
                        }

                        <hr/>

                        <h2>이용요금</h2>
                        <p>성인 2인 기준: 1박 240,000원</p>
                        <ul className='List'>
                            <li>2인 초과 시 1인당: 1박 12,000원</li>
                            <li>4인 초과 시 사랑방을 이용하실 수 있습니다.<br/>(1박 50,000원)</li>
                            <li>바베큐 이용요금: 20,000원</li>
                            <li>입금계좌: 카카오 3333058451192 남은비</li>
                        </ul>

                        <hr/>

                        <h2>예약하기</h2>
                        <Calendar
                            className='Calendar'
                            minDate={new Date()}
                            calendarType='US'
                            tileDisabled={({ date }) => {
                                if(reserved.find(x => x === moment(date).format("YYYY-MM-DD"))){
                                    return true;
                                }
                            }}
                            selectRange={true}
                            onChange={(value) => calcRange(value)}
                        />

                        <button className='ReservationBtn' onClick={() => moveToReservation()}>선택한 날짜로 예약하기</button>

                        <hr/>

                        <h2>문의</h2>
                        <ul className='List'>
                            <li>카카오톡 ID: eunbibi1001</li>
                            <li>인스타그램 DM: f_orest100</li>
                        </ul>
                    </>
            }
            {
                currentPage === 'Reservation' &&
                    <ForestReservation picked={picked} setPicked={setPicked} setCurrentPage={setCurrentPage} getReserved={getReserved}/>
            }
            </div>
        </Layout>
    );
}

export default Forest;