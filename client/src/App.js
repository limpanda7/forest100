import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

// styles
import './styles/normalize.scss';
import './styles/common.scss';
import './styles/sections.scss';
import './styles/buttons.scss';
import './styles/calendar.scss';
import './styles/header.scss';
import './styles/input-radio.scss';
import './styles/modal.scss';
import './styles/reservation.scss';
import './styles/review.scss';
import './styles/slider.scss';
import './styles/tabs.scss';

// components
import Main from './components/Main/Main';
import Forest from './components/Forest/Forest';
import OnOff from './components/OnOff/OnOff';
import Blon from "./components/Blon/Blon";

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/qa' component={Forest} />
                <Route exact path='/on-off' component={OnOff} />
                <Route exact path='/boulogne' component={Blon} />
                <Route path='/' component={Main}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
