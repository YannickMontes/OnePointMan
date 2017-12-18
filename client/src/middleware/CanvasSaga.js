import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {HANDLE_AUTH_REQ} from "../actions/opHandleAuth";
import {store} from '../store';
import {getPhotoUser, idUser, setAuthState} from "../actions/opLogin";
import {push} from "react-router-redux";
import {
    bindDrawingsGroup, DELETE_DRAWING, GET_DRAWINGS_GROUP, getDrawingsGroup,
    SEND_DRAWING
} from "../actions/opCanvas";
import {stayGroup} from "../actions/opUsers";

export function* requestSendDrawing() {

    while (true) {

        let drawing = yield take(SEND_DRAWING);

        let draw = drawing.drawing;
        let idUser = drawing.idUser;
        let idGroup = drawing.idGroup;
        let description = drawing.description;
        let zoom = drawing.zoom;
        let bounds = drawing.bounds;

        let server = "http://localhost:3001/drawing/createdrawing";

        axios.post(server, {
            iduser: idUser,
            idgroup: idGroup,
            description: description,
            zoom: zoom,
            nelt: bounds.north.lat,
            nelg: bounds.north.lng,
            swlt: bounds.south.lat,
            swlg: bounds.south.lng,
            img: draw,

        })
            .then(function (response) {
                if (!!response.status && response.status === 200) {
                    store.dispatch(stayGroup(idUser, idGroup));
                    store.dispatch(getDrawingsGroup(idUser, idGroup));
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export function* requestGetDrawings() {

    while (true) {

        let drawing = yield take(GET_DRAWINGS_GROUP);

        let idUser = drawing.idUser;
        let idGroup = drawing.idGroup;
        let server = "http://localhost:3001/groups/drawings/" + idUser + "/" + idGroup;

        axios.get(server)
            .then(function (response) {
                if (!!response.data.status && response.data.status === 'success') {
                    let drawings = response.data.message.drawings;
                    if (drawings !== 0) {
                        let newDrawings = drawings.map(dessin => {
                            return {...dessin, show: false};
                        });
                        store.dispatch(bindDrawingsGroup(newDrawings));
                    }
                    else {
                        console.log("Ce groupe n'a pas d'images");
                        store.dispatch(bindDrawingsGroup([]));
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export function* requestDeleteDrawing() {

    while (true) {

        let drawing = yield take(DELETE_DRAWING);

        let idDrawing = drawing.id;
        let idUser = drawing.idUser;
        let idGroup = drawing.idGroup;
        let server = "http://localhost:3001/drawing/deletedrawing";

        axios.post(server, {
            iddrawing: idDrawing
        })
            .then(function (response) {
                if (!!response.data.status && response.data.status === 'success') {
                        store.dispatch(getDrawingsGroup(idUser, idGroup));
                        alert("GR8 JOB M8");
                    }
                    else {
                        console.log("Fail to delete");
                    }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export function* CanvasFlow() {
    yield fork(requestSendDrawing);
    yield fork(requestGetDrawings);
    yield fork(requestDeleteDrawing);
}
