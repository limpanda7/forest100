import React from 'react';
import {Link} from 'react-router-dom';
import './Main.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faToggleOn, faLeaf, faTree, faPalette} from '@fortawesome/free-solid-svg-icons'

const Main = () => {
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
                <span>동해</span>
              </div>
            </Link>
          </td>
          <td>
            <Link to='/boulogne'>
              <FontAwesomeIcon icon={faTree} size="3x" className={'Icon'}/>
              <div className='menu-text'>
                블로뉴숲
                <br/>
                <span>포천</span>
              </div>
            </Link>
          </td>
        </tr>
        <tr>
          <td>
            <Link to='/on-off'>
              <FontAwesomeIcon icon={faToggleOn} size="3x" className={'Icon'}/>
              <div className='menu-text'>
                온오프스테이
                <br/>
                <span>동해</span>
              </div>
            </Link>
          </td>
          <td>
            <Link to='/on-off-space'>
              <FontAwesomeIcon icon={faPalette} size="3x" className={'Icon'}/>
              <div className='menu-text'>
                온오프스페이스
                <br/>
                <span>서울</span>
              </div>
            </Link>
          </td>
        </tr>
      </table>
    </div>
  );
}

export default Main;
