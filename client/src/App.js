import React, {useState, useEffect} from 'react';
import './App.scss';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

import BannerImg from './images/banner1.webp';
import MapImg from './images/map.png';

const App = () =>{

    const [showLocation, setShowLocation] = useState(false);
    const [date, setDate] = useState(new Date());
    const [reserved, setReserved] = useState([]);

    useEffect(() => {
        apiReserved();
    }, []);

    const toggleLocation = () => {
        if (showLocation === true) setShowLocation(false);
        else setShowLocation(true);
    }

    const apiReserved = () => {
        fetch('/api/data')
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                let tempArr = [];
                for (const element of data) {
                    tempArr.push(moment(element.date).format('YYYY-MM-DD'));
                }
                setReserved(tempArr);
            });
    }

    return (
        <div className="App">
            <img src={BannerImg} />

            <h2 className='Title'>100년 한옥의 별채에서<br/>편안한 시골체험을 해보세요:)<br/>[동해시 민박업등록숙소]</h2>

            <hr/>

            <div className='Clean'>
                코로나확산 방지를 위해 마스크를 반드시 착용해주시고 손씻기와 방역에 동참해주시길 부탁드립니다. (가급적 숙소에만 머무는 것을 추천드립니다.)<br/>
                침구는 항상 청결하게 준비되어 있으니 안심하시고 찾아주세요 !
            </div>

            <ul>

                <li>100년된 한옥의 별채입니다 :-)<br/>
                주변에는 피톤치드 가득한 산책로가 있고 여러종류의 꽃과 나무, 그리고 열매도 맛볼수 있습니다.<br/>
                    넓은 마당이 있어 차량 3대 이상도 주차가 가능합니다.</li>

                <li>동해시와 삼척시를 여행하기에 좋은 위치에 있습니다.<br/>
                    인근해변: 추암, 쏠비치(자가용 필요)</li>

                <li>도심을 떠나 혼자 여행하시는 분이나, 커플, 가족단위의 게스트도 환영합니다:D</li>

                <li>궁금하신 사항은 메세지를 주시면 신속히 응답드립니다.</li>

                <li>텃밭에서 나는 채소들을 직접 재배하여 요리할 수 있도록 제공합니다:)</li>

                <li>반려견은 인원수에 포함합니다. 털날림이 적은 견종만 가능합니다:)</li>
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
                    더블 침대 1개
                </div>
            </div>

            <hr/>

            <h2>편의시설</h2>
            <ul>
                <li>TV</li>
                <li>무선 인터넷</li>
                <li>에어컨, 난방</li>
                <li>주방 (전자레인지, 냉장고, 전기밥솥)</li>
                <li>기본 조리도구, 식기류</li>
                <li>바베큐 그릴 (추가요금 2만원)</li>
                <li>발코니</li>
                <li>뒷마당</li>
                <li>무료주차</li>
            </ul>

            <hr/>
            <h2>위치</h2>

            <img src={MapImg} />
            <a href='http://naver.me/GmFzmP9P' target='_blank'>네이버 지도에서 보기</a>
            <p>주변에 주택이 많고 대부분 농사를 지으시는 분들입니다. 시골감성을 마음껏 누리세요!</p>

            <button className='LocationBtn' onClick={() => toggleLocation()}>자세한 위치 정보</button>

            {
                showLocation &&
                <ul className='Location'>
                    <li><b>도로명 주소</b><br/>
                        강원도 동해시 구미실길 96-1</li>

                    <li>sk주유소 혹은 이마트24시 편의점을 끼고 오른쪽 아랫길로 내려와 우회전 하여 담벼락을 끼고 쭉 오시면, 언덕길 지나 3거리에서 좌회전 하면 숙소가 보입니다.<br/>
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

            <h2>예약현황</h2>
            <Calendar
                className='Calendar'
                onChange={setDate}
                value={date}
                tileDisabled={({ date }) => {
                    if(reserved.find(x=>x===moment(date).format("YYYY-MM-DD"))){
                        return true;
                    }
                }}
                minDate={new Date()}
                calendarType='US'
            />

        </div>
    );
}

export default App;