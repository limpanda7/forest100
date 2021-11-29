import React, {useState, useEffect} from 'react';
import axios from "axios";
import {Helmet} from "react-helmet";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import Slider from 'react-slick';
import './OnOff.scss';
import OnOffReservation from "./OnOffReservation";
import Layout from "../Layout/Layout";

import img1 from '../images/OnOff/1.jpg';
import img2 from '../images/OnOff/2.jpg';
import img3 from '../images/OnOff/3.jpg';
import img4 from '../images/OnOff/4.jpg';
import img5 from '../images/OnOff/5.jpg';
import img6 from '../images/OnOff/6.jpg';
import img7 from '../images/OnOff/7.jpg';
import img8 from '../images/OnOff/8.jpg';
import img9 from '../images/OnOff/9.jpg';
import img10 from '../images/OnOff/10.jpg';
import img11 from '../images/OnOff/11.jpg';
import img12 from '../images/OnOff/12.jpg';
import img13 from '../images/OnOff/13.jpg';

const OnOff = () => {

    const [reserved, setReserved] = useState([]);
    const [showLocation, setShowLocation] = useState(false);
    const [picked, setPicked] = useState([]);
    const [currentPage, setCurrentPage] = useState('Home');

    useEffect(() => {
        getReserved();
    }, []);

    const getReserved = () => {
        axios.get('/api/getReserved2')
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
                <Helmet>
                    <title>::: ON OFF 스테이 :::</title>
                </Helmet>
                {
                    currentPage === 'Home' &&
                    <>
                        <h2 className='Title'>
                            <span>ON OFF 스테이</span><br/>
                            휴식의 스위치를 ON🔺<br/>
                            일상의 스트레스는 OFF🔻
                        </h2>

                        <div className='Slider'>
                            <Slider {...sliderSetting}>
                                <div><img src={img1} alt={''}/></div>
                                <div><img src={img2} alt={''}/></div>
                                <div><img src={img3} alt={''}/></div>
                                <div><img src={img4} alt={''}/></div>
                                <div><img src={img5} alt={''}/></div>
                                <div><img src={img11} alt={''}/></div>
                                <div><img src={img6} alt={''}/></div>
                                <div><img src={img7} alt={''}/></div>
                                <div><img src={img8} alt={''}/></div>
                                <div><img src={img9} alt={''}/></div>
                                <div><img src={img10} alt={''}/></div>
                                <div><img src={img12} alt={''}/></div>
                                <div><img src={img13} alt={''}/></div>
                            </Slider>
                        </div>

                        <ul className='List'>
                            <li>집 전체를 단독으로 사용하시게 됩니다. (부분적인 사용을 원하실 경우 메세지로 요청주세요)</li>
                            <li>공기가 맑고 조용하며, 주변에 힐링 관광지가 있어 관광과 휴식을 동시에 누리기에 적합합니다.</li>
                            <li>체크인: 18시 / 체크아웃: 15시</li>
                            <li>반려견은 인원수에 포함됩니다. 털날림이 적은 견종만 가능합니다.</li>
                        </ul>

                        <hr/>

                        <h2>침대/침구 유형</h2>
                        <div className='Beds'>
                            <div className='Bed'>
                                <b>1번 침실</b><br/>
                                퀸사이즈 침대 1개
                            </div>
                            <div className='Bed'>
                                <b>2번 침실</b><br/>
                                퀸사이즈 침대 1개
                            </div>
                        </div>

                        <hr/>

                        <h2>편의시설</h2>
                        <ul className='List'>
                            <li>무선 인터넷</li>
                            <li>도서 및 읽을거리</li>
                            <li>빔프로젝터</li>
                            <li>난방</li>
                            <li>주방 (냉장고, 인덕션, 전자레인지)</li>
                            <li>기본 조리도구, 식기류</li>
                            <li>전기 그릴 (추가요금 X)</li>
                            <li>바베큐 화로 (추가요금 O)</li>
                            <li>앞마당</li>
                            <li>무료주차</li>
                        </ul>

                        <hr/>
                        <h2>위치</h2>

                        <iframe className='Map'
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d395.7307178455782!2d129.0677103!3d37.4879664!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3561becc4f8ba9e7%3A0x3056ae1168a133e3!2z6rCV7JuQ64-EIOuPme2VtOyLnCDsgrztmZTrj5kg66y066aJMeq4uCA5LTI!5e0!3m2!1sko!2skr!4v1629545600943!5m2!1sko!2skr"
                            allowFullScreen="" loading="lazy"/>
                        <a href='geo:37.4879664,129.0677103?q=무릉1길+9-2' target='_blank'>지도 앱에서 보기</a>

                        <p>조용하고 평온한 분위기의 동네입니다.</p>
                        <p>선한 동네사람들의 온정이 가득하며 시골분위기를 가득 느끼실 수 있습니다.</p>
                        <p>밤에는 달과별이 잘 보이고 휴식과 업무를 하기에 적합합니다.</p>

                        <button className='LocationBtn' onClick={() => toggleLocation()}>자세한 위치 정보</button>

                        {
                           showLocation &&
                           <ul className='List Location'>
                               <li><b>도로명 주소</b><br/>
                                    강원도 동해시 무릉1길 9-2</li>
                               <li>주차: 무릉복지회관 측면 공용주차장</li>

                               <li><b>교통</b><br/>
                                *동해역( KTX) <br/>
                                -버스: 171 송정동주민센터>삼화동주민센터 (35분)<br/>
                                        111,311, 132, 131  송정동주민센터>삼화시장 (37분)<br/>
                                - 택시 6.4km (11분) <br/>
                                <br/>
                                *동해시종합버스터미널<br/>
                                -버스:111, 311, 132 동해감리교회>삼화시장 (58분)<br/>
                                -택시:8.9km (15분) 
                               </li>

                               <li><b>인근해변 & 관광지</b><br/>
                               -무릉별유천지 :4.8km  약14분<br/>
                                펜트하우스3 촬영지로 스카이 글라이더,루지, 알파인코스터 ,짚라인 등 이용할 수 있습니다:) <br/>
                                <br/>
                                -무릉건강숲  : 4.2km 약6분<br/>
                                # 2만 4천평 규모의 친환경 힐링센터로 각종 테마체험을 즐기실 수 있습니다. <br/>
                                <br/>
                                -무릉계곡 삼화사 :4.2km 약6분<br/>
                                #템플스테이 체험 가능하며 입장료는 무료입니다 (템플스테이 인원 외 2,000원) <br/>
                                <br/>
                                -추암 촛대바위/해수욕장 : 9.2km 약12분<br/>
                                #백사장은 작으나 야경이 멋지고 횟집과 카페가 있습니다:) <br/>
                                <br/>
                                -삼척쏠비치 :11km  약14분<br/>
                                #추암해수욕장과 인접해있으며 워터파크가 있으며 산토리니테라스에서 이국적인 분위기를 느낄 수 있습니다 :) <br/>
                                <br/>
                                -한섬해수욕장: 9.1km 약15분<br/>
                                #시내근처에 있는 해수욕장으로  산책로가 있고 바다뷰 터널 핫스팟이 있습니다 :) <br/>
                                <br/>
                                -망상해수욕장:17km  23분<br/>
                                #백사장이 넓은편이며 오토캠핑과 서핑을 즐기기에 적합합니다.<br/>
                                </li>
                           </ul>
                        }

                        <hr/>

                        <h2>이용요금 안내</h2>
                        <p>4인기준 1박: 주말 300,000원 / 평일 150,000원</p>
                        <p>(신정 및 구정연휴: 성수기 요금 적용)</p>
                        <ul className='List'>
                            <li>4인 초과 시 1인당: 1박 12,000원</li>
                            <li>추가침구: 개당 10,000원</li>
                            <li>바베큐 이용요금: 20,000원</li>
                            <li>입금계좌: 카카오 3333053810252 채민기</li>
                        </ul>

                        <hr/>

                        <h2>진행중인 이벤트</h2>
                        <p>⭐새해맞이 평일 할인⭐️</p>
                        <ul className='List'>
                            <li>2022년 1~3월 평일을 100,000원으로 할인 제공합니다.</li>
                        </ul>
                        {/*<p>⭐️Event 2 대학생 평일 할인⭐️</p>*/}
                        {/*<ul className='List'>*/}
                        {/*    <li>학생증을 인증하시는 대학생에게 평일 10% 할인을 제공합니다.</li>*/}
                        {/*</ul>*/}

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
                            <li>카카오톡 ID: skfk1600</li>
                            <li>인스타그램 DM: on.offstay</li>
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