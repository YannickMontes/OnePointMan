import React, {Component} from 'react';
import {connect} from "react-redux";
import LoginComponent from "../components/LoginComponent";
import {loginRequest} from "../actions/opLogin";
import openSocket from 'socket.io-client';
import NotificationManager from 'react-notifications';


class LoginContainer extends Component {

    constructor(props) {
        super(props);

        //TODO: establish websocket connection
        const socket = openSocket('http://localhost:3002');

        socket.on('Notification', (data) => {
            //alert(data);
            notify(data);
            //nm.info(data, 'Success');
        });
    }

    render() {
        return (
            <LoginComponent login={this.props.loginRequest}/>
        )
    }
}

function mapStateToProps(state) {

    return {
        opLogin: state.opLogin,
    }
}

function notify(message) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(message);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(message);
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
}

//fonctions
const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: () => {
            dispatch(loginRequest())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
