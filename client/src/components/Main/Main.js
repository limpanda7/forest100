import React from 'react';
import {Link} from 'react-router-dom';
import './Main.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHome, faLeaf, faTree} from '@fortawesome/free-solid-svg-icons'

const Main = () => {
  return (
    <div className={'Main'}>
      <div className={'Welcome'}>
        환영합니다 :)<br/>
        찾아오신 곳을 선택하세요.
      </div>

      <div className='menu-item'>
        <Link to='/forest'>
          <FontAwesomeIcon icon={faLeaf} size="3x" className={'Icon'}/>
          <div className='menu-text'>
            <span>소녀시대가 방문한 숙소</span>
            <br/>
            백년한옥별채 (동해)
          </div>
        </Link>
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

      <div className='menu-item'>
        <Link to='https://www.airbnb.co.kr/rooms/1025333167977475414' target='_blank'>
          <FontAwesomeIcon icon={faHome} size="3x" className={'Icon'}/>
          <div className='menu-text'>
            <span>제트스파를 누릴 수 있는</span>
            <br/>
            봉구 스테이 (서울)
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Main;
