import React, {useEffect, useState} from "react";
import axios from "axios";
import moment from "moment";
import './Admin.scss';
import ReactModal from "react-modal";

const Admin = () => {
  const [password, setPassword] = useState('');
  const [target, setTarget] = useState(null);
  const [targetKo, setTargetKo] = useState(null);
  const [reserved, setReserved] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [id, setId] = useState(0);

  useEffect(() => {
    switch (password) {
      case '0125':
        setTarget('blon');
        setTargetKo('블로뉴숲')
        break;
      default:
        break;
    }
  }, [password]);

  useEffect(() => {
    if (target) {
      getFullReservation();
    }
  }, [target]);

  const getFullReservation = async() => {
    const {data} = await axios.get(`/api/fullReservation/${target}`);
    setReserved(data);
  };

  const deleteReserved = async() => {
    await axios.delete(`/api/reservation/${target}/${id}`);
    setIsDeleteModal(false);
    getFullReservation();
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
  };

  return (
    <div className='Admin'>
      <h2>관리자 페이지 {targetKo && `- ${targetKo}`}</h2>
      {
        !['1234', '0192', '0125'].includes(password) ?
          <input
            placeholder='비밀번호'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          :
          <table>
            <tr>
              <th>체크인</th>
              <th>체크아웃</th>
              <th>예약자명</th>
              <td></td>
            </tr>
            {
              reserved.map((row, i) => {
                return (
                  <tr key={i}>
                    <td>{moment(row.checkin_date).format('YYYY-MM-DD')}</td>
                    <td>{moment(row.checkout_date).format('YYYY-MM-DD')}</td>
                    <td>{row.name}</td>
                    <td>
                      <button onClick={() => {
                        setId(row.id);
                        setIsDeleteModal(true);
                      }}>
                        삭제
                      </button>
                    </td>
                  </tr>
                );
              })
            }
          </table>
      }

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
    </div>
  );
}

export default Admin;