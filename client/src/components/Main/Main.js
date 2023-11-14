import React from 'react';
import {Link} from 'react-router-dom';
import './Main.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faToggleOn, faTree} from '@fortawesome/free-solid-svg-icons'

const Main = () => {
  return (
    <div className={'Main'}>
      <div className={'Welcome'}>
        환영합니다 :)<br/>
        찾아오신 곳을 선택하세요.
      </div>

      <div className='menu-item'>
        <Link to='/boulogne'>
          <FontAwesomeIcon icon={faTree} size="3x" className={'Icon'}/>
          <div className='menu-text'>
            <span>숲과 호수 사이 북스테이</span>
            <br/>
            블로뉴숲 (포천)
          </div>
        </Link>
      </div>

      <div
        className='menu-item'
        onClick={() => alert('신개념 공간대여 서비스가 준비중입니다. 서울 성북구에서 만나요!')}
      >
        <FontAwesomeIcon icon={faToggleOn} size="3x" className={'Icon'}/>
        <div className='menu-text'>
          <span>휴식의 스위치를 켜는 곳</span>
          <br/>
          ON OFF 공간대여 (서울-준비중)
        </div>
      </div>
    </div>
  );
}

export default Main;
