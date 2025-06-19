import React, {useEffect} from 'react';
import {Navigate, Route, Routes, useLocation} from 'react-router-dom';

// styles
import './styles/normalize.scss';
import './styles/common.scss';
import './styles/sections.scss';
import './styles/buttons.scss';
import './styles/calendar.scss';
import './styles/layout.scss';
import './styles/input-radio.scss';
import './styles/modal.scss';
import './styles/reservation.scss';
import './styles/review.scss';
import './styles/slider.scss';
import './styles/tabs.scss';
import './styles/table.scss';

// components
import Main from './components/Main/Main';
import MainV2 from "./components/MainV2/MainV2";
import Forest from './components/Forest/Forest';
import OnOff from "./components/OnOff/OnOff";
import Blon from "./components/Blon/Blon";
import Admin from "./components/Admin/Admin";
import Space from "./components/Space/Space";
import Mukho from "./components/Mukho/Mukho";
import ReactGA from "react-ga4";

// context
import { ReservationProvider } from './contexts/ReservationContext';

const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

const App = () => {
  const location = useLocation();

  useEffect(() => {
    // 페이지가 변경될 때마다 트래킹
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return (
    <ReservationProvider>
      <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path='/v2' element={<MainV2/>}/>
        <Route path='forest' element={<Forest />} />
        <Route path='boulogne' element={<Blon/>}/>
        <Route path='on-off' element={<OnOff />} />
        <Route path='on-off-space' element={<Space />} />
        <Route path='new-accommodation' element={<Mukho />} />
        <Route path='admin' element={<Admin/>}/>
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </ReservationProvider>
  );
}

export default App;
