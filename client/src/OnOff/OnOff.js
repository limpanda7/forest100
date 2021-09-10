import React, {useState, useEffect} from 'react';
import axios from "axios";
import './OnOff.scss';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import Slider from 'react-slick';
import OnOffReservation from "./OnOffReservation";
import Layout from "../Layout/Layout";

const OnOff = () => {

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

    const sliderSetting = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        arrows: false,
    };

    return (
        <Layout>
            <div className="OnOff">
                {
                    currentPage === 'Home' &&
                    <>
                        <h2 className='Title'>
                            <span>ON OFF 스테이</span>에서<br/>
                            워케이션을 즐겨보세요.
                        </h2>

                        <div className='TitleSub'>
                            <b>ON >></b> 스위치를 켜고 아이디어를 생산하는 공간<br/>
                            <b>OFF >></b> 스위치를 끄고 나만의 쉼을 찾는 공간
                        </div>

                        <hr/>

                        <h3>‘워케이션’이란 단어를 들어보셨나요?</h3>
                        <ul className='List'>
                            <li>워케이션이란 <b>WORK</b>와 <b>VACATION</b>의 합성어로, 집이 아닌 다른 곳에서 일하면서 휴가와 같은 분위기를 즐기는 여행 형태를 뜻합니다.</li>
                            <li>에어비앤비가 한국인 천여명을 대상으로 진행한 설문조사 결과에 따르면, 응답자의 <b>61%</b>가 워케이션을 시도해 볼 의향이 있다고 밝혔습니다.</li>
                            <li>피로가 느껴지는 일상적 장소에서 벗어나, 자연 속에서 휴식을 취해보세요. </li>
                        </ul>

                        {/*<hr/>*/}

                        {/*<h2>침대/침구 유형</h2>*/}
                        {/*<div className='Beds'>*/}
                        {/*    <div className='Bed'>*/}
                        {/*        <b>1번 침실</b><br/>*/}
                        {/*        더블 침대 1개*/}
                        {/*    </div>*/}
                        {/*    <div className='Bed'>*/}
                        {/*        <b>2번 침실</b><br/>*/}
                        {/*        싱글 침대 1개*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/*<hr/>*/}

                        {/*<h2>편의시설</h2>*/}
                        {/*<ul className='List'>*/}
                        {/*    <li>TV</li>*/}
                        {/*    <li>무선 인터넷</li>*/}
                        {/*    <li>에어컨, 난방</li>*/}
                        {/*    <li>주방 (전자레인지, 냉장고, 전기밥솥)</li>*/}
                        {/*    <li>기본 조리도구, 식기류</li>*/}
                        {/*    <li>바베큐 그릴</li>*/}
                        {/*    <li>발코니</li>*/}
                        {/*    <li>뒷마당</li>*/}
                        {/*    <li>무료주차</li>*/}
                        {/*</ul>*/}

                        <hr/>
                        <h2>위치</h2>

                        <iframe className='Map'
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d395.7307178455782!2d129.0677103!3d37.4879664!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3561becc4f8ba9e7%3A0x3056ae1168a133e3!2z6rCV7JuQ64-EIOuPme2VtOyLnCDsgrztmZTrj5kg66y066aJMeq4uCA5LTI!5e0!3m2!1sko!2skr!4v1629545600943!5m2!1sko!2skr"
                            allowFullScreen="" loading="lazy"/>
                        <a href='geo:37.4879664,129.0677103?q=무릉1길+9-2' target='_blank'>지도 앱에서 보기</a>
                        {/*<p>주변에 주택이 많고 대부분 농사를 지으시는 분들입니다. 시골감성을 마음껏 누리세요!</p>*/}

                        {/*<button className='LocationBtn' onClick={() => toggleLocation()}>자세한 위치 정보</button>*/}

                        {/*{*/}
                        {/*    showLocation &&*/}
                        {/*    <ul className='List Location'>*/}
                        {/*        <li><b>도로명 주소</b><br/>*/}
                        {/*            강원도 동해시 구미실길 96-1</li>*/}
                        {/*        <li>SK주유소를 끼고 오른쪽 아랫길로 내려와 담벼락을 끼고 쭉 오시면, 언덕길 지나 3거리에서 좌회전 하면 숙소가 보입니다.<br/>*/}
                        {/*            (가끔 네비가 다른 곳으로 인도하는 경우가 있다고 하는데 참고해주세요!)</li>*/}
                        {/*        <li>동해역(ktx, 무궁화) > 숙소<br/>*/}
                        {/*            - 버스 21-1 (22분) +도보8분<br/>*/}
                        {/*            - 택시 3.9km (6분)</li>*/}
                        {/*        <li><b>인근해변</b><br/>*/}
                        {/*            -추암 촛대바위/해수욕장<br/>*/}
                        {/*            버스 :북평국가산업단지 정류장 >161 or 162번<br/>*/}
                        {/*            약 18분<br/>*/}
                        {/*            택시 :3km 약4분<br/>*/}
                        {/*            #백사장은 작으나 야경이 멋지고 음식점과 카페가 많습니다.<br/><br/>*/}

                        {/*            -삼척쏠비치 :4.3km 자가용으로 6분<br/>*/}
                        {/*            #추암해수욕장과 인접해있으며 워터파크가 있습니다.<br/><br/>*/}

                        {/*            -망상해수욕장:16km 자가용으로 22분<br/>*/}
                        {/*            #백사장이 넓은편이며 오토캠핑과 서핑을 즐기기에 적합합니다.</li>*/}
                        {/*    </ul>*/}
                        {/*}*/}

                        {/*<hr/>*/}

                        {/*<h2>이용요금 안내</h2>*/}
                        {/*<p>성인 2인 기준: 1박 240,000원</p>*/}
                        {/*<ul className='List'>*/}
                        {/*    <li>2인 초과 시 1인당: 1박 12,000원</li>*/}
                        {/*    <li>4인 초과 시 사랑방을 이용하실 수 있습니다.<br/>(1박 50,000원)</li>*/}
                        {/*    <li>바베큐 이용요금: 20,000원</li>*/}
                        {/*    <li>입금계좌: 카카오 3333058451192 남은비</li>*/}
                        {/*</ul>*/}

                        {/*<hr/>*/}

                        {/*<h2>예약하기</h2>*/}
                        {/*<Calendar*/}
                        {/*    className='Calendar'*/}
                        {/*    minDate={new Date()}*/}
                        {/*    calendarType='US'*/}
                        {/*    tileDisabled={({ date }) => {*/}
                        {/*        if(reserved.find(x => x === moment(date).format("YYYY-MM-DD"))){*/}
                        {/*            return true;*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*    selectRange={true}*/}
                        {/*    onChange={(value) => calcRange(value)}*/}
                        {/*/>*/}

                        <hr/>
                        <br/>
                        <button className='ReservationBtn'>10월 중순 오픈 예정</button>

                        <hr/>

                        <h2>문의</h2>
                        <ul className='List'>
                            <li>카카오톡 ID: eunbibi1001</li>
                            <li>인스타그램 DM: on_offstay</li>
                        </ul>
                    </>
                }
                {
                    currentPage === 'Reservation' &&
                    <OnOffReservation picked={picked} setPicked={setPicked} setCurrentPage={setCurrentPage} getReserved={getReserved}/>
                }
            </div>
        </Layout>
    );
}

export default OnOff;