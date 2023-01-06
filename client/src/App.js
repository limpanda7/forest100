import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Main from './Main/Main';
import Forest from './Forest/Forest';
import OnOff from './OnOff/OnOff';
import Admin from "./Admin/Admin";
import RN from "./RN/RN";

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/forest' component={Forest}/>
                <Route exact path='/on-off' component={OnOff}/>
                <Route exact path='/admin' component={Admin}/>
                <Route exact path='/rn' component={RN}/>
                <Route path='/' component={Main}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
