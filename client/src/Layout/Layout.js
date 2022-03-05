import React, {useState, useEffect} from 'react';
import {withRouter, Link} from 'react-router-dom';
import './Layout.scss';

const Layout = ({ children, history, currentPage, goToHome }) => {

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        window.addEventListener('scroll', () => setScrollY(window.scrollY));
    }, [])

    return (
        <div className={'Layout'}>
            <div className={'Header'}>
                {
                    currentPage === 'Home' ?
                        <>
                            <Link className='BackWrap' to='/'>
                                {'<'}
                                <span className='Back' style={{display: scrollY < 100 ? 'block' : 'none'}}>숙소 목록</span>
                            </Link>
                            <div className='Path' style={{display: scrollY >= 100 ? 'block' : 'none'}}>
                                {
                                    history.location.pathname === '/forest' &&
                                    '백년 한옥 별채'
                                }
                                {
                                    history.location.pathname === '/on-off' &&
                                    'ON OFF 스테이'
                                }
                            </div>
                        </>
                        :
                        <div className='BackWrap' onClick={() => goToHome()}>
                            {'<'}
                            <span className='Back' >뒤로가기</span>
                        </div>
                }
            </div>
            <div className={'Children'}>
                {children}
            </div>
        </div>
    );
}

export default withRouter(Layout);