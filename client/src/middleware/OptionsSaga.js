import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {store} from '../store';
import {CHANGE_MARKER_GEOLOCATION} from "../actions/opMap";
import {CREATE_PINPOINT, DELETE_PINPOINT, SHARING_LOCATION_MODE} from "../actions/opOptions";
import {setPhotoUser} from "../actions/opLogin";
import {getInfosGroup} from "../actions/opGroups";

export function* transmitPosition() {

    while (true) {
        let args = yield take(CHANGE_MARKER_GEOLOCATION);
        let position = args.markers[0];
        let idUser = Number(args.idUser);
        let data = {
            iduser: idUser,
            userlg: position.lng,
            userlt: position.lat
        };
        let server = "http://localhost:3001/users/updateposition";
        axios.post(server, data, {
            headers: {
                'Content-Type': 'application/json'
            }})
        .then(function (response) {
            //console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export function* transmitSharingMode() {

    while (true) {
        let args = yield take(SHARING_LOCATION_MODE);
        let idUser = Number(args.idUser);
        let idGroup = Number(args.idGroup);
        let isSharing = args.isSharing;
        let data = {
            iduser: idUser,
	        idgroup: idGroup,
	        positionSharing : isSharing
        };
        let server = "http://localhost:3001/users/updatepositionsharing";
        axios.post(server, data, {
            headers: {
                'Content-Type': 'application/json'
            }})
            .then(function (response) {
                //console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function* createPinPoint() {

    while (true) {
        let pinPointArgs = yield take(CREATE_PINPOINT);
        let pinPoint = pinPointArgs.pinPoint;
        let userId = pinPointArgs.idUser;
        let groupId = pinPointArgs.idGroup;
        console.log(pinPoint);
        console.log(userId);
        console.log(groupId);
        let server = "http://localhost:3001/pinpoint/createpinpoint";
        axios.post(server, pinPoint, {
            headers: {
                'Content-Type': 'application/json'
            }})
        .then(function (response) {
            console.log(response);
            if(response.status === 200) {
                store.dispatch(getInfosGroup(userId, groupId));
            } else {
                console.log(response.status);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export function* deletePinPoint() {

    while (true) {
        let pinPointArgs = yield take(DELETE_PINPOINT);
        let idPinPoint = pinPointArgs.idPinPoint;
        let userId = pinPointArgs.idUser;
        let groupId = pinPointArgs.idGroup;
        let data = {
            iduser: Number(userId),
	        idgroup: Number(groupId),
	        idpinpoint: Number(idPinPoint)
        }
        console.log(idPinPoint);
        console.log(userId);
        console.log(groupId);
        let server = "http://localhost:3001/pinpoint/deletepinpoint";
        axios.post(server, data, {
            headers: {
                'Content-Type': 'application/json'
            }})
            .then(function (response) {
                console.log(response);
                if(response.status === 200) {
                    store.dispatch(getInfosGroup(userId, groupId));
                } else {
                    console.log(response.status);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}


export function* OptionsFlow() {
    yield fork(transmitPosition);
    yield fork(createPinPoint);
    yield fork(deletePinPoint);
    yield fork(transmitSharingMode);
}