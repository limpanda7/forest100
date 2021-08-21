import React from 'react';
import {Link} from 'react-router-dom';
import './Layout.scss';

const Layout = ({ children }) => {
    return (
        <div className={'Layout'}>
            <div className={'Header'}>
                <Link to='/'>
                    {'<'} 숙소목록
                </Link>
            </div>
            <div className={'Children'}>
                {children}
            </div>
        </div>
    );
}

export default Layout;