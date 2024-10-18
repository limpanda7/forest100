import './Layout.scss';
import { slide as Menu } from "react-burger-menu";

const Layout = ({ children }) => {
  return (
    <div className="Layout">
      <Menu>
        <div>
          <h2>나믄자리</h2>
          <div>프로젝트 소개</div>
          <div>호스트 소개</div>
        </div>

        <div>
          <h2>공간들</h2>
          <div>백년한옥별채</div>
          <div>블로뉴숲</div>
          <div>온오프스테이</div>
          <div>온오프스페이스</div>
        </div>

        <div>
          <h2>프로그램</h2>
          <div>반려견 간식만들기</div>
          <div>농장체험</div>
        </div>
      </Menu>
      {children}
    </div>
  );
}

export default Layout;