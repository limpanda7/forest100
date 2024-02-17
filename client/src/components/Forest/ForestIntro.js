import {useEffect, useState} from "react";
import Slider from "react-slick";
import img1 from "../../images/Forest/1.webp";
import img2 from "../../images/Forest/2.jpg";
import img3 from "../../images/Forest/3.jpg";
import img4 from "../../images/Forest/4.jpg";
import img5 from "../../images/Forest/5.jpg";
import img6 from "../../images/Forest/6.jpg";
import img7 from "../../images/Forest/7.jpg";
import img11 from "../../images/Forest/11.jpg";
import img12 from "../../images/Forest/12.webp";
import ssImg1 from "../../images/Forest/ss1.png";
import ssImg2 from "../../images/Forest/ss2.png";
import ssImg3 from "../../images/Forest/ss3.png";
import ssImg4 from "../../images/Forest/ss4.png";
import ssImg5 from "../../images/Forest/ss5.png";
import ssImg6 from "../../images/Forest/ss6.png";
import ssImg7 from "../../images/Forest/ss7.png";
import ssImg8 from "../../images/Forest/ss8.png";
import ssImg9 from "../../images/Forest/ss9.png";
import ssImg10 from "../../images/Forest/ss10.png";

const ForestIntro = () => {

  const [showLocation, setShowLocation] = useState(false);

  useEffect(() => {
    new window.daum.roughmap.Lander({
      "timestamp": "1688303532806",
      "key": "2fdo6",
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
          <div><span>(출처: JTBC)</span><img src={ssImg1} alt={''}/></div>
          <div><span>(출처: JTBC)</span><img src={ssImg2} alt={''}/></div>
          <div><span>(출처: JTBC)</span><img src={ssImg3} alt={''}/></div>
          <div><span>(출처: JTBC)</span><img src={ssImg4} alt={''}/></div>
          <div><span>(출처: JTBC)</span><img src={ssImg5} alt={''}/></div>
          <div><span>(출처: JTBC)</span><img src={ssImg6} alt={''}/></div>
          <div><span>(출처: JTBC)</span><img src={ssImg7} alt={''}/></div>
          <div><span>(출처: JTBC)</span><img src={ssImg9} alt={''}/></div>
          <div><span>(출처: JTBC)</span><img src={ssImg10} alt={''}/></div>
          <div><span>(출처: JTBC)</span><img src={ssImg8} alt={''}/></div>
          <div><img src={img7} alt={''}/></div>
          <div><img src={img5} alt={''}/></div>
          <div><img src={img1} alt={''}/></div>
          <div><img src={img2} alt={''}/></div>
          <div><img src={img3} alt={''}/></div>
          <div><img src={img4} alt={''}/></div>
          <div><img src={img6} alt={''}/></div>
          <div><img src={img11} alt={''}/></div>
          <div><img src={img12} alt={''}/></div>
        </Slider>
      </div>

      <div className='contents'>
        <section>
          <ul>
            <li>
              100년 된 한옥의 별채입니다.<br/>
              주변에는 피톤치드 가득한 산책로가 있고 여러종류의 꽃과 나무, 그리고 열매도 맛볼수 있습니다.
            </li>
            <li>넓은 마당이 있어 차량 3대 이상도 주차가 가능합니다.</li>
            <li>텃밭에서 나는 채소들을 직접 재배하여 요리할 수 있도록 제공합니다.</li>
            <li>반려견은 인원수에 포함합니다. 털날림이 적은 견종만 가능합니다.</li>
          </ul>
        </section>

        <section>
          <div className="DescTitle">Stay</div>
          <ul>
            <li>
              <li>기준인원 2인, 최대 6인 + 반려견 2마리</li>
            </li>
            <li>
              체크인 15시, 체크아웃 11시
            </li>
            <li>무료 주차</li>
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

          <p className='Ptitle'>Kitchen, LivingRoom</p>
          <ul>
            <li>냉장고/인덕션/전자레인지/에어프라이기/환풍기/토스트기/에어컨</li>
            <li>4인테이블</li>
            <li>식기/컵/냄비/프라이팬/수저/가위/칼/집게/와인잔/와인오프너</li>
            <li>전기포트/드립백</li>
          </ul>

          <p className='Ptitle'>Bedroom 1</p>
          <ul>
            <li>퀸사이즈 침대/침구</li>
            <li>테이블/의자</li>
            <li>TV/에어컨</li>
          </ul>

          <p className='Ptitle'>Bedroom 2</p>
          <ul>
            <li>더블 사이즈 침대/침구</li>
            <li>화장대/의자</li>
            <li>미니책장/서적</li>
            <li>헤어드라이기/빗/고데기</li>
          </ul>

          <p className='Ptitle'>Veranda</p>
          <ul>
            <li>4인 의자/전신거울 2개/식물</li>
            <li>포토존</li>
          </ul>

          <p className='Ptitle'>Terrace</p>
          <ul>
            <li>6인 테이블/방석/야외조명</li>
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
                - 택시 3.9km (6분)
              </li>
              <li><b>인근해변</b><br/>
                -추암 촛대바위/해수욕장<br/>
                버스 :북평국가산업단지 정류장 >161 or 162번<br/>
                약 18분<br/>
                택시 :3km 약4분<br/>
                #백사장은 작으나 야경이 멋지고 음식점과 카페가 많습니다.<br/><br/>

                -삼척쏠비치 :4.3km 자가용으로 6분<br/>
                #추암해수욕장과 인접해있으며 워터파크가 있습니다.<br/><br/>

                -망상해수욕장:16km 자가용으로 22분<br/>
                #백사장이 넓은편이며 오토캠핑과 서핑을 즐기기에 적합합니다.
              </li>
            </ul>
          }
        </section>

        <section>
          <div className="DescTitle">Contact</div>


          <li>카카오톡: eunbibi1001</li>
          <li>인스타그램:&nbsp;
            <a href='https://www.instagram.com/hanok.100/' target='_blank' className='anchor'>
              @hanok.100
            </a></li>
        </section>
      </div>
    </>
  );
}

export default ForestIntro;
