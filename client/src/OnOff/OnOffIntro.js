import Slider from "react-slick";
import img1 from "../images/OnOff/1.jpg";
import img2 from "../images/OnOff/2.jpg";
import img3 from "../images/OnOff/3.jpg";
import img4 from "../images/OnOff/4.jpg";
import img5 from "../images/OnOff/5.jpg";
import img6 from "../images/OnOff/6.jpg";
import img7 from "../images/OnOff/7.jpg";
import img8 from "../images/OnOff/8.jpg";
import img9 from "../images/OnOff/9.jpg";
import img10 from "../images/OnOff/10.jpg";
import img11 from "../images/OnOff/11.jpg";
import img12 from "../images/OnOff/12.jpg";
import img13 from "../images/OnOff/13.jpg";
import img14 from "../images/OnOff/14.jpg";
import img15 from "../images/OnOff/15.jpg";
import img16 from "../images/OnOff/16.jpg";
import './OnOff.scss';
import {useState} from "react";

const OnOffIntro = () => {

    const [showLocation, setShowLocation] = useState(false);
    const [showTour, setShowTour] = useState(false);

    const toggleLocation = () => {
        if (showLocation) setShowLocation(false);
        else setShowLocation(true);
    }

    const toggleTour = () => {
        if (showTour) setShowTour(false);
        else setShowTour(true);
    }

    const sliderSetting = {
        fade: true,
        dotsClass: 'dots',
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <>
            {/*<div className='Title'>*/}
            {/*    <span>ON OFF 스테이</span><br/>*/}
            {/*    휴식의 스위치를 ON🔺<br/>*/}
            {/*    일상의 스트레스는 OFF🔻*/}
            {/*</div>*/}

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
                <ul>
                    <li>기준인원: 기준 4인, 최대 6인 + 반려견 2마리</li>
                    <li>체크인 3시 / 체크아웃 11시</li>
                    <li>객실정보: 침실1(퀸사이즈), 침실2(퀸사이즈), 북스테이 룸1, 북스테이 룸2, 거실, 메인 주방, 세컨 주방, 내부 화장실, 외부 화장실, 마당, 루프탑</li>
                </ul>
            </section>

            {/*<p className='Ptitle'>추가 안내사항</p>*/}
            {/*<ul>*/}
            {/*    <li>평일 (일~목) 예약시 침실2, 세컨주방, 북스테이2 사용이 제한되며, 전체사용 요청시 5만원 추가요금 발생됩니다.</li>*/}
            {/*</ul>*/}

            <section>
                <div className="DescTitle">ROOMS</div>

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
                <div className="DescTitle">CONTACT</div>
                <ul>
                    <li>카카오톡 ID: skfk1600</li>
                    <li>인스타그램 DM: on.offstay</li>
                </ul>
            </section>
        </>
    );
}

export default OnOffIntro;