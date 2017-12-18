import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {store} from '../store';
import {GET_PHOTO_USER, getPhotoUser, idUser, LOGIN_REQUEST, setPhotoUser} from "../actions/opLogin";
import {push} from "react-router-redux";

export function* requestLoginBack() {

    while (true) {

        yield take(LOGIN_REQUEST);

        let server = "http://localhost:3001/fblogin";

        axios.get(server)
            .then(function (response) {
                console.log(response);
                if (!!response.status && response.status === 200) {
                    window.location.href = response.data.redirectURI + 'client_id=' + response.data.client_id + '&redirect_uri=' + response.data.redirect_uri
                            +'&scope='+response.data.scope;
                } else {
                    alert('Erreur lors du Login');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function * requestPhotoUser() {
    while (true) {
        let user = yield take(GET_PHOTO_USER);
        let id = user.idUser;

        let server = "http://graph.facebook.com/"+id+"/picture?redirect=false&type=normal";

        axios.get(server)
            .then(function (response) {
                if(!!response.status && response.status === 200) {
                    store.dispatch(setPhotoUser(response.data.data.url));
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export function* LoginFlow() {
    yield fork(requestLoginBack);
    yield fork(requestPhotoUser);
}
