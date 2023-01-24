import React, {useState} from 'react';
import Layout from "../Layout/Layout";
import {Helmet} from "react-helmet";
import './Consulting.scss';

const Consulting = () => {

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    money: '',
    experience: false,
    content: '',
  });
  const {name, phone, address, money, experience, content} = form;

  console.log(form)
  const handleInput = e => {
    if (e.target.validity.valid) {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
  }

  const handleRadio = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.id.endsWith('Y'),
    });
  }

  return (
    <Layout
      currentPage='Home'
    >
      <div className='Consulting'>
        <Helmet>
          <title>::: 컨설팅 신청하기 :::</title>
        </Helmet>

        <div className='Title'>
          <span>컨설팅 신청하기</span>
        </div>

        <section>
          숙소 창업에 관심이 있으신가요?<br/>
          인테리어부터 홈페이지 제작까지, 저희가 가진 모든 노하우를 통해 원활한 숙소 창업을 도와드립니다.<br/>
          아래 양식에 맞게 작성해주시면 연락 드리겠습니다.
        </section>

        <section>
          <div className='InputWrap'>
            <span>이름: </span>
            <input type='text' name='name' value={name} onChange={handleInput}/>
          </div>

          <div className='InputWrap'>
          <span>전화번호: </span>
          <input type='text' name='phone' value={phone} onChange={handleInput}
                 pattern='[0-9]*' maxLength={11}
          />
          </div>

          <div className='InputWrap'>
            <span>사업부지의 위치: </span>
            <input type='text' name='address' value={address} onChange={handleInput}/>
          </div>

          <div className='InputWrap'>
            <span>투자규모: </span>
            <input className='AlignRight' type='text' name='money' value={money} onChange={handleInput}/>
            <span>만원</span>
          </div>

          <div className='InputWrap'>
            <span>인테리어 경험: </span>
            <div className='RadioBtn'>
              <input type='radio' id='experienceY' name='experience' checked={experience} onClick={handleRadio}/>
              <label htmlFor='experienceY'><span/>예</label>
              <input type='radio' id='experienceN' name='experience' checked={!experience} onClick={handleRadio}/>
              <label htmlFor='experienceN'><span/>아니오</label>
            </div>
          </div>

          <div className='InputWrap'>
            <span>문의내용: </span>
            <textarea rows={10} cols={40} name='content' value={content} onChange={handleInput}/>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Consulting;
