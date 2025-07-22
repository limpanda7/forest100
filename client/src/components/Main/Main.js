import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Main.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faToggleOn, faLeaf, faTree, faPalette, faHeart} from '@fortawesome/free-solid-svg-icons'

const Main = () => {
  const navigate = useNavigate();

  return (
    <div className={'Main'}>
      <table>
        <tr>
          <td>
            <Link to='/forest'>
              <FontAwesomeIcon icon={faLeaf} size="3x" className={'Icon'}/>
              <div className='menu-text'>
                백년한옥별채
                <br/>
                <span>동해 숙소</span>
              </div>
            </Link>
          </td>
          <td>
            <Link to='/boulogne'>
              <FontAwesomeIcon icon={faTree} size="3x" className={'Icon'}/>
              <div className='menu-text'>
                블로뉴숲
                <br/>
                <span>포천 숙소</span>
              </div>
            </Link>
          </td>
        </tr>
        <tr>
          <td>
            <Link to='/on-off'>
              <FontAwesomeIcon icon={faToggleOn} size="3x" className={'Icon'}/>
              <div className='menu-text'>
                온오프 스테이
                <br/>
                <span>동해 단기임대</span>
              </div>
            </Link>
          </td>
          <td>
            <Link to='/on-off-space'>
              <FontAwesomeIcon icon={faPalette} size="3x" className={'Icon'}/>
              <div className='menu-text'>
                온오프 스페이스
                <br/>
                <span>서울 공간대여</span>
              </div>
            </Link>
          </td>
        </tr>
      </table>

      <div className='philosophy-btn'>
        <a href='https://nameun-jari.web.app/' target='_blank' rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faHeart} size="2x" className={'Icon'}/>
          <div className='menu-text'>
            브랜드 스토리
            <br/>
            <span>나믄자리</span>
          </div>
        </a>
      </div>

      {/*<Link to='/apple'>*/}
      {/*  <button className="apple-btn">*/}
      {/*    🍎EVENT🍎<br/>백년한옥사과 예약하기*/}
      {/*  </button>*/}
      {/*</Link>*/}

      <div className='admin-btn' onClick={() => navigate('/admin')}>
        FOREST 100
      </div>
    </div>
  );
}

export default Main;
