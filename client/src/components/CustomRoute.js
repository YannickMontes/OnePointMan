import React from 'react';
import {Redirect, Route} from "react-router-dom";
import {store} from "../store";

function checkAuthRouter() {
	let {loggedIn} = store.getState().opLogin;
	//  loggedIn =  true;
	return loggedIn
}

/*Only logged in user can acess this route, or they are redirected to '/login' */
export const PrivateRoute = ({component: Component, ...rest}) => (
	<Route {...rest} render={props => (
		checkAuthRouter() ? (
			<Component {...props}/>
		) : (
			<Redirect to="/"/>
		)
	)}/>
);

/*Only not logged in user can acess this route, or they are redirected to '/' */
export const PublicRoute = ({component: Component, ...rest}) => (
	<Route {...rest} render={props => (
		!checkAuthRouter() ? (
			<Component {...props}/>
		) : (
			<Redirect to="/"/>
		)
	)}/>
);
