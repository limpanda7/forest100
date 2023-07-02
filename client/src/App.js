import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

// styles
import './styles/common.scss';
import './styles/normalize.scss';

// components
import Main from './components/Main/Main';
import OnOff from './components/OnOff/OnOff';
import Blon from "./components/Blon/Blon";
import Consulting from "./components/Consulting/Consulting";

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/on-off' component={OnOff} />
                <Route exact path='/boulogne' component={Blon} />
                <Route exact path='/consulting' component={Consulting} />
                <Route path='/' component={Main}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
