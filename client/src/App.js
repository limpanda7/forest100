import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Main from './Main/Main';
import Forest from './Forest/Forest';
import OnOff from './OnOff/OnOff';

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Main}/>
                <Route exact path='/forest' component={Forest}/>
                <Route exact path='/on-off' component={OnOff}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;