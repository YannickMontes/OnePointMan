import React, { Component } from 'react';
import {Provider} from 'react-redux';
import {Switch} from 'react-router-dom'
import {PrivateRoute, PublicRoute} from "./components/CustomRoute";
import {ConnectedRouter} from 'react-router-redux';
import {history, store} from './store.js';
import LoginContainer from "./containers/LoginContainer";
import DashboardContainer from "./containers/DashboardContainer";
import HandleAuthContainer from "./containers/HandleAuthContainer";
import CanvasContainer from "./containers/CanvasContainer";
import TestImage from "./components/TestImage";


class App extends Component {
  render() {
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Switch>
                    <PublicRoute
                        exact
                        path="/"
                        component={LoginContainer}/>
                    <PublicRoute
                        exact
                        path="/handleauth"
                        component={HandleAuthContainer}/>
                    <PublicRoute
                        exact
                        path="/canvas"
                        component={CanvasContainer}/>
                    <PrivateRoute
                        exact
                        path="/Home"
                        component={DashboardContainer}/>
                    <PrivateRoute
                        exact
                        path="/drawings"
                        component={TestImage}/>
                </Switch>
            </ConnectedRouter>
        </Provider>
    );
  }
}

export default App;
