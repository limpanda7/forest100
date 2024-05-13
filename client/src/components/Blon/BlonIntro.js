import {useEffect} from "react";
import Slider from "react-slick";
import img1 from "../../images/Blon/1.jpg";
import img2 from "../../images/Blon/2.jpg";
import img3 from "../../images/Blon/3.jpg";
import img4 from "../../images/Blon/4.jpg";
import img5 from "../../images/Blon/5.jpg";
import img6 from "../../images/Blon/6.jpg";
import img7 from "../../images/Blon/7.jpg";
import img8 from "../../images/Blon/8.jpg";
import img9 from "../../images/Blon/9.jpg";
import img10 from "../../images/Blon/10.jpg";
import img11 from "../../images/Blon/11.jpg";
import img12 from "../../images/Blon/12.jpg";
import img13 from "../../images/Blon/13.jpg";
import img14 from "../../images/Blon/14.jpg";
import img15 from "../../images/Blon/15.jpg";
import {BLON_PRICE} from "../../constants";

const BlonIntro = () => {
  useEffect(() => {
    new window.daum.roughmap.Lander({
      "timestamp": "1688304044735",
      "key": "2fdo8",
    }).render();
  }, []);

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
        </Slider>
      </div>

      <div className='contents'>
        <section>
          <div className="DescTitle">Stay</div>
          <ul>
            <li>기준인원 4인, 최대 6인 + 반려견 2마리</li>
            <li>체크인 3시 / 체크아웃 11시</li>
            <li>객실정보: 침실1(퀸사이즈), 침실2(퀸사이즈), 거실, 주방, 화장실, 마당, 테라스</li>
          </ul>
        </section>

        <section>
          <div className="DescTitle">Rooms</div>

          <p className='Ptitle'>Bathroom</p>
          <ul>
            <li>어메니티<br/>(샴푸/린스/바디워시/바디타올/치약/핸드워시)</li>
            <li>수건</li>
          </ul>

          <p className='Ptitle'>Kitchen</p>
          <ul>
            <li>냉장고/가스레인지 3구/전자레인지</li>
            <li>식기/컵/냄비/프라이팬/수저/가위/칼/집게</li>
            <li>6인용 아일랜드원목식탁 및 의자</li>
            <li>에어프라이기/토스트기</li>
          </ul>

          <p className='Ptitle'>Bedroom 1</p>
          <ul>
            <li>퀸사이즈 침대/침구/에어컨</li>
            <li>원목화장대</li>
            <li>리클라이너쇼파</li>
            <li>행거</li>
          </ul>

          <p className='Ptitle'>Bedroom 2</p>
          <ul>
            <li>퀸사이즈 침대/침구</li>
            <li>거울/드라이기</li>
            <li>행거</li>
          </ul>

          <p className='Ptitle'>Book Stay</p>
          <ul>
            <li>4인 책상/의자 2</li>
            <li>400여권의 서적</li>
            <li>블루투스 오디오</li>
            <li>감성라디오</li>
            <li>통기타</li>
            <li>루미큐브/스케치북/색연필</li>
            <li>필사도구</li>
            <li>WI-FI/4way냉난방기</li>
            <li>시네마빔/노트북</li>
            <span>(*별도의 TV는 비치되어 있지 않습니다.)</span>
          </ul>

          <p className='Ptitle'>Garden & Terrace</p>
          <ul>
            <li>6인 테이블 및 의자 / 야외조명</li>
            <li>바베큐존 (바베큐신청시 화로,토치,집게,숯 제공 / 이용요금 {BLON_PRICE.BARBECUE.toLocaleString()}원)</li>
          </ul>
        </section>

        <section>
          <div className="DescTitle">Location</div>

          <ul>
            <li>도로명 주소: 경기 포천시 영북면 산정호수로322번길 38</li>
            <li>지번 주소: 경기 포천시 영북면 산정리 519-12</li>
          </ul>

          <div id="daumRoughmapContainer1688304044735"
               className="root_daum_roughmap root_daum_roughmap_landing daum-map"></div>
        </section>

        <section>
          <div className="DescTitle">INSTAGRAM</div>
          <a href='https://www.instagram.com/boulogne_forest/' target='_blank' className='anchor'>
            <p>@boulogne_forest</p>
          </a>
        </section>
      </div>
    </>
  );
}

export default BlonIntro;
