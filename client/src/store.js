import { applyMiddleware, createStore , compose } from "redux"
import createHistory from 'history/createBrowserHistory';
//import { createLogger } from 'redux-logger';
import rootSaga from "./middleware";
import createSagaMiddleware from "redux-saga";
import {routerMiddleware} from "react-router-redux";
import reducers from "./reducers/index";

let middlewares =  [];

let history = createHistory ();
middlewares.push(routerMiddleware(history));

const saga = createSagaMiddleware();
middlewares.push(saga);




let middleware = applyMiddleware (...middlewares);
if(window.__REDUX_DEVTOOLS_EXTENSION__){
    middleware = compose(middleware, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}

//create store
const store = createStore(reducers, middleware);


saga.run(rootSaga);
export  {store, history};
