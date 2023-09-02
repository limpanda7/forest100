import React from 'react';
import {Route, Routes} from 'react-router-dom';

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
import OnOff from './components/OnOff/OnOff';
import Blon from "./components/Blon/Blon";
import Admin from "./components/Admin/Admin";

const App = () => {
    return (
        <Routes>
          <Route path='/' element={<Main />} />
          {/*<Route path='forest' element={<Forest />} />*/}
          <Route path='on-off' element={<OnOff />} />
          <Route path='boulogne' element={<Blon />} />
          <Route path='admin' element={<Admin />} />
        </Routes>
    );
}

export default App;
