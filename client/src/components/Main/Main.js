import React from 'react';
import {Link} from 'react-router-dom';
import './Main.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faToggleOn, faTree } from '@fortawesome/free-solid-svg-icons'

const Main = () => {
    return (
        <div className={'Main'}>
            <div className={'Welcome'}>
                환영합니다 :)<br/>
                찾아오신 숙소를 선택하세요.
            </div>

            {/*<Link to='/forest'>*/}
            {/*    <FontAwesomeIcon icon={faHome} size="3x" className={'Icon'}/>*/}
            {/*    <div className={'Button'}>*/}
            {/*        <span>소녀시대가 방문한 별채</span>*/}
            {/*        <br/>*/}
            {/*        " 포레스트 "</div>*/}
            {/*</Link>*/}

            <Link to='/on-off'>
                <FontAwesomeIcon icon={faToggleOn} size="3x" className={'Icon'}/>
                <div className={'Button'}>
                    <span>휴식의 스위치를 켜는 곳 (동해)</span>
                    <br/>
                    " ON OFF 스테이 "
                </div>
            </Link>

            <Link to='/boulogne'>
                <FontAwesomeIcon icon={faTree} size="3x" className={'Icon'}/>
                <div className={'Button'}>
                    <span>숲과 호수 사이 북스테이 (포천)</span>
                    <br/>
                    " 블로뉴숲 "
                </div>
            </Link>
        </div>
    );
}

export default Main;
