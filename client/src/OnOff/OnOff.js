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
import img14 from '../images/OnOff/14.jpg';
import img15 from '../images/OnOff/15.jpg';
import img16 from '../images/OnOff/16.jpg';

const OnOff = () => {

    const [reserved, setReserved] = useState([]);
    const [reservedName, setReservedName] = useState([]);
    const [reservedPhone, setReservedPhone] = useState([]);
    const [showLocation, setShowLocation] = useState(false);
    const [showTour, setShowTour] = useState(false);
    const [showRefund, setShowRefund] = useState(false);
    const [picked, setPicked] = useState([]);
    const [currentPage, setCurrentPage] = useState('Home');

    useEffect(() => {
        getReserved();
    }, []);

    const getReserved = () => {
        axios.get('/api/getReserved2')
            .then((res) => {
                let tempReserved = [];
                let tempReservedName = [];
                let tempReservedPhone = [];
                for (const element of res.data) {
                    tempReserved.push(moment(element.date).format('YYYY-MM-DD'));

                    if (!tempReservedName.includes(element.name)) {
                        tempReservedName.push(element.name);
                    }

                    if (!tempReservedPhone.includes(element.phone)) {
                        tempReservedPhone.push(element.phone);
                    }
                }
                setReserved(tempReserved);
                setReservedName(tempReservedName);
                setReservedPhone(tempReservedPhone);
            });
    }

    const moveToReservation = () => {
        if (picked.length === 0) {
            alert('예약 날짜를 선택해주세요!')
            return false;
        } else if (picked.length === 1) {
            alert('체크인 날짜와 체크아웃 날짜를 선택해주세요.')
        } else {
            setCurrentPage('Reservation');
            window.scrollTo(0, 0);
        }
    }

    const toggleLocation = () => {
        if (showLocation) setShowLocation(false);
        else setShowLocation(true);
    }

    const toggleTour = () => {
        if (showTour) setShowTour(false);
        else setShowTour(true);
    }

    const toggleRefund = () => {
        if (showRefund) setShowRefund(false);
        else setShowRefund(true);
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

    const goToHome = () => {
        setCurrentPage('Home');
        setPicked([]);
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
        <Layout currentPage={currentPage} goToHome={goToHome}>
            <div className="OnOff">
                <Helmet>
                    <title>::: 온오프스테이 :::</title>
                </Helmet>
                {
                    currentPage === 'Home' &&
                    <>
                        <div className='Title'>
                            <span>ON OFF 스테이</span><br/>
                            휴식의 스위치를 ON🔺<br/>
                            일상의 스트레스는 OFF🔻
                        </div>

                        <div className='Slider'>
                            <Slider {...sliderSetting}>
                                <div><img src={img1} alt={''}/></div>
                                <div><img src={img2} alt={''}/></div>
                                <div><img src={img3} alt={''}/></div>
                                <div><img src={img4} alt={''}/></div>
                                <div><img src={img5} alt={''}/></div>
                                <div><img src={img6} alt={''}/></div>
                                <div><img src={img7} alt={''}/></div>
                                <div><img src={img8} alt={''}/></div>
                                <div><img src={img9} alt={''}/></div>
                                <div><img src={img10} alt={''}/></div>
                                <div><img src={img11} alt={''}/></div>
                                <div><img src={img12} alt={''}/></div>
                                <div><img src={img13} alt={''}/></div>
                                <div><img src={img14} alt={''}/></div>
                                <div><img src={img15} alt={''}/></div>
                                <div><img src={img16} alt={''}/></div>
                            </Slider>
                        </div>

                        <iframe className='Video'
                                src="https://www.youtube.com/embed/UIgIAsuUrHw"
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen></iframe>

                        <section>
                            <div className="DescTitle">STAY</div>
                            <p style={{color: '#760c0c'}}>★★ 현재 숙소 정비로 인해 3월부터 이용이 가능합니다 ★★</p>
                            <ul>
                                <li>기준인원: 기준 4인, 최대 6인 + 반려견 2마리</li>
                                <li>체크인 3시 / 체크아웃 11시</li>
                                <li>객실정보: 침실1(퀸사이즈), 침실2(퀸사이즈), 거실, 큰주방, 세컨주방, 북스테이1, 북스테이2, 화장실(내부,외부), 마당, 루프탑</li>
                            </ul>
                        </section>

                        {/*<p className='Ptitle'>추가 안내사항</p>*/}
                        {/*<ul>*/}
                        {/*    <li>평일 (일~목) 예약시 침실2, 세컨주방, 북스테이2 사용이 제한되며, 전체사용 요청시 5만원 추가요금 발생됩니다.</li>*/}
                        {/*</ul>*/}

                        <section>
                            <div className="DescTitle">ROOM</div>

                            <p className='Ptitle'>BATHROOM</p>
                            <ul>
                                <li>어메니티<br/>(샴푸/린스/바디워시/바디타올/치약)</li>
                                <li>수건</li>
                            </ul>

                            <p className='Ptitle'>KITCHEN</p>
                            <ul>
                                <li>냉장고/인덕션 2구/전자레인지</li>
                                <li>식기/컵/냄비/프라이팬/수저/가위/칼/집게/와인잔/와인오프너</li>
                                <li>드립백/전기포트</li>
                            </ul>

                            <p className='Ptitle'>SECOND KITCHEN</p>
                            <ul>
                                <li>토스트기</li>
                                <li>식기/냄비/프라이팬/수저/가위/칼/집게/컵</li>
                            </ul>

                            <p className='Ptitle'>LIVINGROOM</p>
                            <ul>
                                <li>통유리창문</li>
                                <li>WI-FI/에어컨/4인식탁/2인사이드테이블</li>
                                <li>시네마빔/노트북(넷플릭스)</li>
                                <span>(*별도의 TV는 비치되어 있지 않습니다.)</span>
                            </ul>

                            <p className='Ptitle'>BEDROOM 1</p>
                            <ul>
                                <li>통유리창문</li>
                                <li>퀸사이즈 침대/침구</li>
                                <li>전신거울/빗/고데기/드라이기</li>
                            </ul>

                            <p className='Ptitle'>BEDROOM 2</p>
                            <ul>
                                <li>퀸사이즈 침대/침구/에어컨</li>
                                <li>전신거울/빗/드라이기</li>
                                <li>원형테이블/의자 2개</li>
                            </ul>

                            <p className='Ptitle'>BOOK STAY 1</p>
                            <ul>
                                <li>1인 책상/의자</li>
                                <li>서적</li>
                                <li>유아용 매트</li>
                            </ul>

                            <p className='Ptitle'>BOOK STAY 2</p>
                            <ul>
                                <li>2인 테이블</li>
                                <li>LP 턴테이블</li>
                                <li>서적</li>
                                <li>소파베드</li>
                            </ul>

                            <p className='Ptitle'>GARDEN & ROOFTOP</p>
                            <ul>
                                <li>4인 테이블 및 의자 / 야외조명</li>
                                <li>바베큐존 (바베큐신청시 화로,토치,집게,숯 제공 / 이용요금 2만원)</li>
                                <li>외부 화장실(온수X)</li>
                            </ul>
                        </section>

                        <section>
                            <div className="DescTitle">LOCATION</div>

                            <iframe className='Map'
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d395.7307178455782!2d129.0677103!3d37.4879664!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3561becc4f8ba9e7%3A0x3056ae1168a133e3!2z6rCV7JuQ64-EIOuPme2VtOyLnCDsgrztmZTrj5kg66y066aJMeq4uCA5LTI!5e0!3m2!1sko!2skr!4v1629545600943!5m2!1sko!2skr"
                                allowFullScreen="" loading="lazy"/>
                            <a href='geo:37.4879664,129.0677103?q=동해시+무릉1길+9-2' target='_blank'>지도 앱에서 보기</a>

                            <ul>
                                <li>도로명 주소: 강원도 동해시 무릉1길 9-2</li>
                                <li>주차: 무릉복지회관 측면 공용주차장</li>
                            </ul>

                            <button className='LocationBtn' onClick={() => toggleLocation()}>
                                {!showLocation ? '대중교통 정보' : '대중교통 정보 닫기'}
                            </button>

                            {
                                showLocation &&
                                <ul>
                                    <li>
                                        동해역 (KTX)<br/>
                                        -버스: 171 송정동주민센터 > 삼화동주민센터<br/>
                                        (35분)<br/>
                                        111,311, 132, 131 송정동주민센터 > 삼화시장<br/>
                                        (37분)<br/>
                                        -택시: 6.4km (11분)
                                    </li>
                                    <li>
                                        동해시 종합버스터미널<br/>
                                        -버스: 111, 311, 132 동해감리교회 > 삼화시장<br/>
                                        (58분)<br/>
                                        -택시: 8.9km (15분)
                                    </li>
                                </ul>
                            }

                            <button className='LocationBtn' onClick={() => toggleTour()}>
                                {!showTour ? '주변 관광 정보' : '주변 관광 정보 닫기'}
                            </button>

                            {
                                showTour &&
                                    <ul>
                                        <li>
                                            무릉별유천지: 4.8km 약14분<br/>
                                            펜트하우스3 촬영지로 스카이 글라이더, 루지, 알파인코스터, 짚라인 등 이용할 수 있습니다.
                                        </li>
                                        <li>
                                            무릉건강숲: 4.2km 약6분<br/>
                                            2만 4천평 규모의 친환경 힐링센터로 각종 테마체험을 즐기실 수 있습니다.
                                        </li>
                                        <li>
                                            무릉계곡 삼화사: 4.2km 약6분<br/>
                                            템플스테이 체험 가능하며 입장료는 무료입니다 (템플스테이 인원 외 2,000원)
                                        </li>
                                        <li>
                                            추암 촛대바위/해수욕장: 9.2km 약12분<br/>
                                            백사장은 작으나 야경이 멋지고 횟집과 카페가 있습니다.
                                        </li>
                                        <li>
                                            삼척쏠비치: 11km 약14분<br/>
                                            추암해수욕장과 인접해있으며 워터파크가 있으며 산토리니테라스에서 이국적인 분위기를 느낄 수 있습니다.
                                        </li>
                                        <li>
                                            한섬해수욕장: 9.1km 약15분<br/>
                                            시내근처에 있는 해수욕장으로  산책로가 있고 바다뷰 터널 핫스팟이 있습니다.
                                        </li>
                                        <li>
                                            망상해수욕장: 17km 23분<br/>
                                            백사장이 넓은편이며 오토캠핑과 서핑을 즐기기에 적합합니다.
                                        </li>
                                    </ul>
                            }
                        </section>

                        <section>
                            <div className="DescTitle">PRICE</div>
                            {/* 이벤트 문구 */}
                            {/*<p style={{color: '#760c0c'}}>*/}
                            {/*    <b>★ 10/22~10/31 가을 예약 이벤트 ★</b><br/>*/}
                            {/*    (예약일 기준이며, 숙박일 기준이 아닙니다.)<br/>*/}
                            {/*    (기존 예약자의 취소 후 재예약은 해당되지 않습니다.)*/}
                            {/*</p>*/}
                            {/*<p>*/}
                            {/*    4인기준 1박: <b>주말 <span className='Canceled'>300,000원</span> → {global.config.onoff_weekend.toLocaleString()}원<br/>*/}
                            {/*        <div className='LeftMargin'/>평일 <span className='Canceled'>200,000원</span> → {global.config.onoff_weekday.toLocaleString()}원</b>*/}
                            {/*    <div className='SpecialPrice'>설날∙추석 등 공휴일에는 연휴요금 적용됩니다.</div>*/}
                            {/*</p>*/}
                            <p>
                                4인기준 1박: <b>주말 {global.config.onoff_weekend.toLocaleString()}원 / 평일 {global.config.onoff_weekday.toLocaleString()}원</b><br/>
                                설날∙추석 등 공휴일에는 연휴요금 적용됩니다.
                            </p>
                            <ul>
                                <li>4인 초과 시 1인당: 1박 15,000원<br/>(추가침구 제공)</li>
                                {/*<li>추가침구: 개당 10,000원</li>*/}
                                <li>바베큐 이용요금: 20,000원</li>
                                <li>입금계좌: 카카오 3333053810252 채민기</li>
                                <li><a onClick={() => toggleRefund()}>환불 규정 보기</a></li>
                            </ul>

                            {
                                showRefund &&
                                <ul className='List Refund'>
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
                        </section>

                        {/*<h2>EVENT</h2>*/}
                        {/*<p>⭐️대학생 평일 할인⭐️</p>*/}
                        {/*<p>방학은 공기좋은 동해에서 보내자!<br/>대학생에게 평일 10% 할인을 제공합니다.</p>*/}

                        <section>
                            <div className="DescTitle">RESERVATION</div>
                            <p>
                                체크인 날짜와 체크아웃 날짜를 선택해주세요.<br/>
                                (체크인 3시 / 체크아웃 11시)
                            </p>
                            <p style={{color: '#760c0c'}}>★★ 현재 숙소 정비로 인해 3월부터 이용이 가능합니다 ★★</p>
                            <Calendar
                                className='Calendar'
                                minDate={new Date(2023, 1, 27)}
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
                        </section>

                        <section>
                            <div className="DescTitle">CONTACT</div>
                            <ul>
                                <li>카카오톡 ID: skfk1600</li>
                                <li>인스타그램 DM: on.offstay</li>
                            </ul>
                        </section>
                    </>
                }
                {
                    currentPage === 'Reservation' &&
                    <OnOffReservation picked={picked} setPicked={setPicked} setCurrentPage={setCurrentPage} getReserved={getReserved} reservedName={reservedName} reservedPhone={reservedPhone}/>
                }
            </div>
        </Layout>
    );
}

export default OnOff;
