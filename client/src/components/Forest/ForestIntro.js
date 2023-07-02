import {useEffect, useState} from "react";
import Slider from "react-slick";
import img1 from "../../images/Forest/1.jpg";
import img2 from "../../images/Forest/2.jpg";
import img3 from "../../images/Forest/3.jpg";
import img4 from "../../images/Forest/4.jpg";
import img5 from "../../images/Forest/5.jpg";
import img6 from "../../images/Forest/6.jpg";
import img7 from "../../images/Forest/7.jpg";
import img8 from "../../images/Forest/8.jpg";
import img9 from "../../images/Forest/9.jpg";
import img10 from "../../images/Forest/10.jpg";
import img11 from "../../images/Forest/11.jpg";
import img12 from "../../images/Forest/12.jpg";
import img13 from "../../images/Forest/13.jpg";
import img14 from "../../images/Forest/14.jpg";
import img15 from "../../images/Forest/15.jpg";
import img16 from "../../images/Forest/16.jpg";
import img17 from "../../images/Forest/17.jpg";
import img18 from "../../images/Forest/18.jpg";
import img19 from "../../images/Forest/19.jpg";
import img20 from "../../images/Forest/20.jpg";
import img21 from "../../images/Forest/21.jpg";
import img22 from "../../images/Forest/22.jpg";
import img23 from "../../images/Forest/23.jpg";

const ForestIntro = () => {

    const [showLocation, setShowLocation] = useState(false);

    useEffect(() => {
        new window.daum.roughmap.Lander({
            "timestamp" : "1688303532806",
            "key" : "2fdo6",
        }).render();
    }, []);

    const toggleLocation = () => {
        if (showLocation) setShowLocation(false);
        else setShowLocation(true);
    }

    const sliderSetting = {
        dots: true,
        fade: true,
        dotsClass: 'dots',
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 2500,
    };

    return (
        <>
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
                    <div><img src={img17} alt={''}/></div>
                    <div><img src={img18} alt={''}/></div>
                    <div><img src={img19} alt={''}/></div>
                    <div><img src={img20} alt={''}/></div>
                    <div><img src={img21} alt={''}/></div>
                    <div><img src={img22} alt={''}/></div>
                    <div><img src={img23} alt={''}/></div>
                </Slider>
            </div>

            <section>
                <div className="DescTitle">Prologue</div>
                <p>여러분들은 지친 일상속 잠시나마 숨통이 트일 수 있는 나만의 숲이 있으신가요?</p>
                <p>나지막한 부엌과 따스한 햇살, 싱그러운 풀내음이 그 과정이 되어줄 것입니다.</p>
                <p>백년한옥별채인 포레스트에서 그 물음의 답을 얻으셨으면 좋겠습니다.</p>
            </section>

            <section>
                <div className="DescTitle">Stay</div>
                <ul>
                    <li>
                        기준인원: 기준 4인, 최대 6인 + 반려동물 1마리<br/>
                        (최대 6인인 경우 사랑방 예약 부탁드립니다)
                    </li>
                    <li>
                        체크인 15시, 체크아웃 11시<br/>
                        (객실 상태에 따라 early check-in이 가능합니다)
                    </li>
                    <li>무료 주차 (3대 이하)</li>
                </ul>
            </section>

            <section>
                <div className="DescTitle">Rooms</div>

                <p className='Ptitle'>Bathroom</p>
                <ul>
                    <li>어메니티<br/>(샴푸/컨디셔너/바디워시/칫솔/치약/핸드워시/종량제봉투)</li>
                    <li>수건</li>
                    <li>비데</li>
                </ul>

                <p className='Ptitle'>Kitchen , Livingroom</p>
                <ul>
                    <li>냉장고/인덕션/전자레인지/에어프라이기/환풍기/토스트기/에어컨</li>
                    <li>4인테이블</li>
                    <li>식기/컵/냄비/프라이팬/수저/가위/칼/집게/와인잔/와인오프너</li>
                    <li>전기포트/드립백</li>
                    <li>생수 1L, 웰컴 과일</li>
                </ul>

                <p className='Ptitle'>Bedroom1</p>
                <ul>
                    <li>퀸사이즈 침대/침구</li>
                    <li>테이블/의자</li>
                    <li>TV/단스탠드/에어컨</li>
                    <li>행거</li>
                </ul>

                <p className='Ptitle'>Bedroom2</p>
                <ul>
                    <li>더블 사이즈 침대/침구</li>
                    <li>화장대/의자</li>
                    <li>행거</li>
                    <li>미니책장/서적</li>
                    <li>단스탠드</li>
                    <li>헤어드라이기/빗/고데기</li>
                </ul>

                <p className='Ptitle'>Veranda</p>
                <ul>
                    <li>4인 의자/전신거울 2개/식물</li>
                    <li>포토존</li>
                </ul>

                <p className='Ptitle'>Terrace</p>
                <ul>
                    <li>6인 테이블 / 방석 / 야외조명</li>
                    <li>캠핑도구 (휴지, 조명)</li>
                    <li>바베큐 (신청 시 화로,토치,숯,집게 제공)</li>
                </ul>
            </section>

            <section>
                <div className="DescTitle">Location</div>
                <ul>
                    <li>주소: 강원도 동해시 구미실길 96-1</li>
                </ul>

                <div id="daumRoughmapContainer1688303532806"
                     className="root_daum_roughmap root_daum_roughmap_landing daum-map"></div>

                <button className='LocationBtn' onClick={toggleLocation}>
                    {!showLocation ? '자세한 위치 정보' : '자세한 위치 정보 닫기'}
                </button>

                {
                  showLocation &&
                  <ul className='List Location'>
                      <li>SK주유소를 끼고 오른쪽 아랫길로 내려와 담벼락을 끼고 쭉 오시면, 언덕길 지나 3거리에서 좌회전 하면 숙소가 보입니다.</li>
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
            </section>

            <section>
                <div className="DescTitle">Instagram</div>
                <a href='https://www.instagram.com/myownforestt/' target='_blank'>
                    <p>@myownforestt</p>
                </a>
            </section>
        </>
    );
}

export default ForestIntro;
