import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Main from './Main/Main';
import Forest from './Forest/Forest';
import OnOff from './OnOff/OnOff';
import Blon from "./Blon/Blon";
import Admin from "./Admin/Admin";
import Consulting from "./Consulting/Consulting";

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/forest' component={Forest} />
                <Route exact path='/on-off' component={OnOff} />
                <Route exact path='/boulogne' component={Blon} />
                <Route exact path='/admin' component={Admin} />
                <Route exact path='/consulting' component={Consulting} />
                <Route path='/' component={Main}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
