import Slider from "react-slick";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart} from '@fortawesome/free-solid-svg-icons';
import img1 from "../../images/Space/1.jpg";
import img2 from "../../images/Space/2.jpg";
import img3 from "../../images/Space/3.jpg";
import img4 from "../../images/Space/4.jpg";
import img5 from "../../images/Space/5.jpg";
import img6 from "../../images/Space/6.jpg";
import img7 from "../../images/Space/7.jpg";
import img8 from "../../images/Space/8.jpg";
import img9 from "../../images/Space/9.jpeg";
import img10 from "../../images/Space/10.jpg";
import img11 from "../../images/Space/11.jpg";

const SpaceIntro = () => {
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
        </Slider>
      </div>

      <div className='contents'>
        <section>
          <div className="DescTitle">공간소개</div>
          일상을 여행처럼, 여행을 일상처럼 사는 호스트의 공간입니다.<br/>
          좋은 공간에서 좋은 생각으로 하고 싶은 것을 해보세요!<br/>
          <br/>
          단, 소음이 발생하지 않는 조건이랍니다 (❗️파티룸 사용불가 / 적발 시 즉각 퇴실조치)<br/>
          <br/>
          이런 분들께 추천해요<br/>
          <br/>
          ✔️ 직장생활에서 벗어나 새로운 일을 계획하시는 분<br/>
          → 사업 아이템을 연구하거나 집중할 시간이 필요할 거예요! (비즈니스 회의, 공모전 준비, 소규모 학습공간에 적합합니다)<br/>
          <br/>
          ✔️ 재능이 있어 일일 클래스를 열어보고 싶으신 분<br/>
          → 사전 미팅 후 클래스 공간을 열어드립니다!<br/>
          <br/>
          ✔️ 소모임을 열고 싶으신 분<br/>
          → 다양한 보드게임이 준비되어 있어요!<br/>
          <br/>
          ✔️ 건강과 운동을 병행하고 싶으신 분<br/>
          → 트레드밀(런닝머신)과 필라테스 리포머로 가볍게 몸을 풀어보세요.<br/>
        </section>

        <section>
          <div className="DescTitle">시설안내</div>
          <ul>
            <li>빔프로젝터 & 스크린 : 팀플/프레젠테이션에 OK</li>
            <li>대형테이블 : 함께 앉아 일 모드 스위치 ON</li>
            <li>커피포트 : 준비된 티와 커피를 즐기세요</li>
            <li>옷걸이 / 신발 선반 : 정돈된 상태로 이용 가능</li>
            <li>식기류 (접시, 유리잔, 수저, 포크, 가위, 도마)</li>
            <li>충전기 (8핀 2개, C타입 2개) / HDMI</li>
            <li>화장실/미니싱크대</li>
            <li>트레드밀(런닝머신), 리포머(필라테스 기구)</li>
          </ul>
        </section>

        <section>
          <div className="DescTitle">유의사항</div>
          <ul>
            <li>주차불가합니다.</li>
            <li>금연공간입니다.</li>
            <li>화장실은 외부 통로에 있습니다.</li>
            <li>사용하신 모든 집기 및 소품은 제자리에 놓아주세요. (비치된 물품 파손및 분실 시 배상금이 청구될 수 있습니다.)</li>
            <li>퇴실이 늦어질 경우 추가요금이 발생합니다. (5분초과 시 부가)</li>
            <li>퇴실 시 냉난방기 및 출입문을 확인해주세요.</li>
            <li>보안 및 안전을 위한 실내 cctv 작동중입니다.</li>
            <li>실내화를 신어주세요.</li>
            <li>19시 이후 소음에 주의해주세요.</li>
          </ul>
        </section>

        <section>
          <div className="DescTitle">위치</div>
          <ul>
            <li>서울 성북구 정릉로40길 11 1층</li>
          </ul>
        </section>

        <section>
          <div className="DescTitle">문의</div>
          <ul>
            <li>카카오톡 ID: eunbibi1001</li>
            <li>인스타그램:&nbsp;
              <a href='https://www.instagram.com/onoff_space_/' target='_blank' className='anchor'>
                @onoff_space_
              </a>
            </li>
          </ul>
        </section>

        <section className="brand-story-section">
          <div className="brand-story-btn">
            <a href='https://nameun-jari.web.app/' target='_blank' rel='noopener noreferrer'>
              <FontAwesomeIcon icon={faHeart} size="lg" className={'brand-icon'}/>
              <div className='brand-text'>
                브랜드 스토리
                <br/>
                <span>나믄자리</span>
              </div>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

export default SpaceIntro;
