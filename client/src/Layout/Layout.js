import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import './Layout.scss';

const Layout = ({ children, history }) => {

    return (
        <div className={'Layout'}>
            <div className={'Header'}>
                <Link to='/'>
                    {'<'}
                </Link>
                <div className='Path'>
                    {
                        history.location.pathname === '/forest' &&
                        '백년 한옥 별채'
                    }
                    {
                        history.location.pathname === '/on-off' &&
                            'ON OFF 스테이'
                    }
                </div>
            </div>
            <div className={'Children'}>
                {children}
            </div>
        </div>
    );
}

export default withRouter(Layout);