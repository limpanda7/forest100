import React, {useEffect} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';

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
import Forest from './components/Forest/Forest';
import OnOff from "./components/OnOff/OnOff";
import Blon from "./components/Blon/Blon";
import Admin from "./components/Admin/Admin";
import Space from "./components/Space/Space";
import Apple from "./components/Apple/Apple";

const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Main/>}/>
      <Route path='forest' element={<Forest />} />
      <Route path='boulogne' element={<Blon/>}/>
      <Route path='on-off' element={<OnOff />} />
      <Route path='on-off-space' element={<Space />} />
      <Route path='admin' element={<Admin/>}/>
      <Route path='apple' element={<Apple/>}/>
      <Route path='*' element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
