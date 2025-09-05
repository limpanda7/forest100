import React, {useEffect, useState} from "react";
import axios from "axios";
import moment from "moment";
import './Admin.scss';
import ReactModal from "react-modal";
import {useNavigate} from "react-router-dom";
import cn from "classnames";
import Header from "../Header/Header";

const Admin = () => {
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [target, setTarget] = useState(null);
  const [targetKo, setTargetKo] = useState(null);
  const [reserved, setReserved] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isInfoModal, setIsInfoModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [id, setId] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    switch (password) {
      case process.env.REACT_APP_FOREST_PASSWORD:
        setTarget('forest');
        setTargetKo('백년한옥별채');
        setIsLogin(true);
        break;
      case process.env.REACT_APP_ON_OFF_PASSWORD:
        setTarget('on_off');
        setTargetKo('온오프스테이');
        setIsLogin(true);
        break;
      case process.env.REACT_APP_BLON_PASSWORD:
        setTarget('blon');
        setTargetKo('블로뉴숲');
        setIsLogin(true);
        break;
      default:
        break;
    }
  }, [password]);

  useEffect(() => {
    if (target) {
      init();
    }
  }, [target]);

  const init = async() => {
    const {data: homepageReserved} = await axios.get(`/api/full-reservation/${target}`);
    const {data: airbnbReserved} = await axios.get(`/api/ical/${target}`);
    let tempReserved = [];
    for (const element of homepageReserved) {
      tempReserved.push({
        ...element,
        type: 'homepage',
        checkin_date: new Date(
          new Date(element.checkin_date).toISOString().slice(0, -1)
        ).toString(),
        checkout_date: new Date(
          new Date(element.checkout_date).toISOString().slice(0, -1)
        ).toString(),
      });
    }
    for (const element of airbnbReserved) {
      tempReserved.push({
        ...element,
        type: 'airbnb',
        checkin_date: new Date(
          new Date(element.start_dt).toISOString().slice(0, -1)
        ).toString(),
        checkout_date: new Date(
          new Date(element.end_dt).toISOString().slice(0, -1)
        ).toString(),
      });
    }

    tempReserved.sort((a, b) => new Date(a.checkin_date) - new Date(b.checkin_date));
    setReserved(tempReserved);
  }

  const showDetail = (row) => {
    if (row.name) {
      setSelected(row);
      setIsInfoModal(true);
    } else {
      window.open('https://www.airbnb.com/hosting/reservations/details/' + row.reservation_id, '_blank');
    }
  }

  const deleteReserved = async() => {
    await axios.delete(`/api/reservation/${target}/${id}`);
    setIsDeleteModal(false);
    init();
  }

  const handleGoBack = () => {
    if (target) {
      setPassword('');
      setIsLogin(false);
      setTarget(null);
      setTargetKo(null);
      setReserved([]);
    } else {
      navigate('/');
    }
  }

  const modalStyle = {
    content: {
      width: '80%',
      maxWidth: '600px',
      maxHeight: '80%',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
    info: {
      marginBottom: '10px',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: '#ddd',
      border: 'none',
      color: '#333',
      padding: '8px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'background-color 0.3s ease'
    }
  };

  return (
    <>
      <Header
        title={targetKo ? '관리자 페이지 - ' + targetKo : '관리자 페이지'}
        handleGoBack={handleGoBack}
      />

      <div className='Admin'>
        {
          !isLogin ?
            <input
              placeholder='비밀번호'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            :
            <table>
              <thead>
                <tr>
                  <th style={{width: '60px'}}>체크인</th>
                  <th style={{width: '60px'}}>체크아웃</th>
                  <th style={{width: '40px'}}>구분</th>
                  <th>이름/끝번호</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  reserved.map((row, i) => {
                    return (
                      <tr key={i}>
                        <td>{moment(row.checkin_date).format('MM-DD')}</td>
                        <td>{moment(row.checkout_date).format('MM-DD')}</td>
                        <td className={cn(row.name ? 'homepage-cell' : 'airbnb-cell')}>
                          {row.name ? '홈' : '에'}
                        </td>
                        <td>{row.name || row.phone_last_digits || '(막아둔날짜)'}</td>
                        <td>
                          {
                            (row.name || row.phone_last_digits) &&
                            <button onClick={() => {
                              showDetail(row);
                            }}>
                              상세
                            </button>
                          }
                        </td>
                        <td>
                          {
                            row.name &&
                            <button onClick={() => {
                              setId(row.id);
                              setIsDeleteModal(true);
                            }}>
                              삭제
                            </button>
                          }
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
        }
      </div>

      <ReactModal
        isOpen={isInfoModal}
        style={modalStyle}
      >
        <div className='reservation-info'>
          {
            selected &&
            <>
              <div style={modalStyle.info}>
                기간: {moment(selected.checkin_date).format('YYYY-MM-DD')} ~ {moment(selected.checkout_date).format('YYYY-MM-DD')}
              </div>
              <div style={modalStyle.info}>이름: {selected.name}</div>
              <div style={modalStyle.info}>전화번호: {selected.phone}</div>
              <div style={modalStyle.info}>인원수: {selected.person}명, 영유아 {selected.baby}명, 반려견 {selected.dog}마리</div>
              <div style={modalStyle.info}>추가침구: {selected.bedding}개</div>
              <div style={modalStyle.info}>바베큐 이용여부: {selected.barbecue}</div>
              <div style={modalStyle.info}>이용금액: {selected.price.toLocaleString()}</div>
              <div style={modalStyle.info}>환불옵션: {selected.price_option === 'refundable' ? '환불가능' : '환불불가'}</div>
            </>
          }
        </div>
        <button
          style={modalStyle.closeButton}
          onClick={() => setIsInfoModal(false)}
        >
          X
        </button>
      </ReactModal>

      <ReactModal
        isOpen={isDeleteModal}
        style={modalStyle}
      >
        정말 삭제하시겠습니까?
        <div className='BtnWrap'>
          <button className='ModalBtn' onClick={() => setIsDeleteModal(false)}>취소</button>
          <button className='ModalBtn' onClick={() => deleteReserved()}>삭제</button>
        </div>
      </ReactModal>
    </>
  );
}

export default Admin;