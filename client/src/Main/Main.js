import React from 'react';
import {Link} from 'react-router-dom';
import './Main.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faToggleOn } from '@fortawesome/free-solid-svg-icons'

const Main = () => {
    return (
        <div className={'Main'}>
            <div className={'Welcome'}>
                환영합니다 :)<br/>
                찾아오신 숙소를 선택하세요.
            </div>

            <Link to='/forest'>
                <FontAwesomeIcon icon={faHome} size="3x" className={'Icon'}/>
                <div className={'Button'}>
                    <span>소녀시대가 방문한 숙소!</span>
                    <br/>
                    " 백년 한옥 별채 "</div>
            </Link>

            <Link to='/on-off'>
                <FontAwesomeIcon icon={faToggleOn} size="3x" className={'Icon'}/>
                <div className={'Button'}>
                    <span>동해 최고의 감성 숙소</span>
                    <br/>
                    " ON OFF 스테이 "
                </div>
            </Link>
        </div>
    );
}

export default Main;