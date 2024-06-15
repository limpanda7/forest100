import Slider from "react-slick";
import img1 from "../../images/Space/1.jpg";
import img2 from "../../images/Space/2.jpg";
import img3 from "../../images/Space/3.jpg";
import img4 from "../../images/Space/4.jpg";
import img5 from "../../images/Space/5.jpg";
import img6 from "../../images/Space/6.jpg";
import img7 from "../../images/Space/7.jpg";
import img8 from "../../images/Space/8.jpg";
import img9 from "../../images/Space/9.jpg";
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
          좋은 공간에서 좋은 생각으로 하고싶은 것을 하세요!<br/>
          <br/>
          단, 소음이 발생하지 않는 조건이랍니다 (❗️파티룸 사용불가 / 적발 시 즉각 퇴실조치 됩니다)<br/>
          <br/>
          이런 분들께 추천해요<br/>
          ✔ 직장생활에서 벗어나 새로운 일을 계획하시는 분 / 사업아이템을 집중해서 연구하는 시간이 필요할거에요! (비즈니스 회의 및 공모전, 팀플을 위한 소규모 학습공간에 적합합니다)<br/>
          <br/>
          ✔ 재능이 있어 일일클래스를 열어보고 싶으신 분 / 사전 미팅 후 클래스공간을 열어드릴게요!<br/>
          <br/>
          ✔ 소모임을 열고 싶으신 분/ 다양한 보드게임이 준비되어 있어요!
        </section>

        <section>
          <div className="DescTitle">시설안내</div>
          <ul>
            <li>빔프로젝트&스크린 : 팀플을 위한 프레젠테이션 장소에 OK</li>
            <li>테이블(8인)에 모여 앉아 일 모드 스위치 ON</li>
            <li>전자피아노(Yamaha P-125wh) /이어폰 잭 有 (아이패드가 있는 분들은 연동가능합니다)</li>
            <li>전자레인지/커피포트 : 준비되어있는 티와 커피를 즐기세요!</li>
            <li>냉동/냉장고: 좋아하는 음식을 가져와 보관하고 마음껏 드세요.(단, 처리는 깔끔하게😊)</li>
            <li>옷걸이/신발선반: 정돈된 상태로 이용할 수 있어요.</li>
            <li>식기류 (접시, 유리잔, 와인잔, 맥주잔, 수저포크,가위, 국자, 도마)</li>
            <li>충전기 (8핀2, C 타입2)/ HDMI</li>
            <li>화장실/미니싱크대</li>
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
      </div>
    </>
  );
}

export default SpaceIntro;