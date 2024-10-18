import React from 'react';
import './MainV2.scss';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import ForestImg from '../../images/Forest/1.webp';
import OnOffImg from '../../images/OnOff/1.jpg';
import BlonImg from '../../images/Blon/1.jpg';
import SpaceImg from '../../images/Space/1.jpg';
import DangDangImg from '../../images/dangdang.jpg';
import SunghoonImg from '../../images/sunghoon.jpg';
import FarmImg from '../../images/farm.jpg';
import Layout from "../Layout/Layout";

const MainV2 = () => {
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Layout>
      <div className='MainV2'>
        <section className='brand-logo'>
          <h1>나믄자리</h1>
          <p>당신을 위해 남은 자리에서<br/>좋은 일이 생길거에요</p>
          <button className='project-intro-btn' onClick={() => navigate('/project-intro')}>
            프로젝트 소개
          </button>
        </section>

        <section className='accommodations'>
          <Slider {...sliderSettings}>
            <div className='photo-stack' onClick={() => navigate('/forest')}>
              <img
                src={ForestImg}
                alt='백년한옥별채'
                className='photo'
              />
            </div>
            <div className='photo-stack' onClick={() => navigate('/boulogne')}>
              <img
                src={BlonImg}
                alt='블로뉴숲'
                className='photo'
              />
            </div>
            <div className='photo-stack' onClick={() => navigate('/on-off')}>
              <img
                src={OnOffImg}
                alt='온오프스테이'
                className='photo'
              />
            </div>
            <div className='photo-stack' onClick={() => navigate('/on-off-space')}>
              <img
                src={SpaceImg}
                alt='온오프스페이스'
                className='photo'
              />
            </div>
          </Slider>
        </section>

        <section className='space-rental'>
          <Slider {...sliderSettings}>
            <div className='photo-stack' onClick={() => navigate('/on-off-space')}>
              <img
                src={DangDangImg}
                alt='원럽댕댕'
                className='photo'
              />
            </div>
            <div className='photo-stack' onClick={() => navigate('/on-off-space')}>
              <img
                src={FarmImg}
                alt='농장체험'
                className='photo'
              />
            </div>
          </Slider>
        </section>

        <section className='hosts'>
          <div className='host'>
            <img
              src={SunghoonImg}
              alt='판다부부'
              className='host-photo'
            />
            <p className='host-name'>판다부부</p>
          </div>
          <div className='host'>
            <img
              src={SunghoonImg}
              alt='은진이네'
              className='host-photo'
            />
            <p className='host-name'>은진이네</p>
          </div>
          <div className='host'>
            <img
              src={SunghoonImg}
              alt='제복이네'
              className='host-photo'
            />
            <p className='host-name'>제복이네</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default MainV2;