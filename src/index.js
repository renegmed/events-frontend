import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import App from './App';

import Home from './Home';
import MarkerInfoWindow from './MarkerInfoWindow';
import MarkerInfoWindowGmapsObj from './MarkerInfoWindowGmapsObj';
import MeshMap from './MeshMap';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
const defaultPath = process.env.REACT_APP_BASE_PATH;

ReactDOM.render(
    <Router>
        <App>
            <Switch>
                <Route exact path= {defaultPath} component={Home} />
                <Route path={`${defaultPath}marker-info-window`} component={MarkerInfoWindow} />
                <Route path={`${defaultPath}marker-info-window-gmaps-obj`} component={MarkerInfoWindowGmapsObj} />
                <Route path={`${defaultPath}mesh-map`} component={MeshMap} />
                <Redirect exact from="*" to={defaultPath} />
            </Switch>   
        </App>
    </Router>,
    document.getElementById('root')
);    

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
