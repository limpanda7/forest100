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

      <Link to='/boulogne'>
        <FontAwesomeIcon icon={faTree} size="3x" className={'Icon'}/>
        <div className={'Button'}>
          <span>숲과 호수 사이 북스테이</span>
          <br/>
          블로뉴숲
        </div>
      </Link>

      <Link to='/'>
        <FontAwesomeIcon icon={faToggleOn} size="3x" className={'Icon'}/>
        <div className={'Button'}>
          <span>휴식의 스위치를 켜는 곳</span>
          <br/>
          ON OFF 스파 (준비중)
        </div>
      </Link>
    </div>
  );
}

export default Main;
