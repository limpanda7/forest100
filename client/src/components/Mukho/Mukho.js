import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import './Mukho.scss';
import Header from "../Header/Header";

const Mukho = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='Mukho'>
      <Header
        title='묵호쉴래'
        handleGoBack={() => navigate('/')}
      />

      <div className='contents'>
        <section className='coming-soon'>
          <div className="coming-soon-content">
            <h2>🚧 준비 중</h2>
            <p>7월부터 예약 가능하도록 준비중입니다.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Mukho; 