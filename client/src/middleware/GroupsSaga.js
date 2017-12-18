import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {store} from '../store';
import {
    ADD_GROUP,
    ADD_GROUP_TEST, changeGroups, GET_GROUPS, GET_INFOS_GROUP, GET_MESSAGE, GET_PHOTO, getGroups, getInfosGroup,
    getPhoto,
    SEND_CHANGE_NAME, setMessage,
    setPhoto, UPDATE_MESSAGE
} from "../actions/opGroups";
import {changePinPoints, changeTrackings, updateMarkerMembers} from "../actions/opMap";
import {addUser, changeIdGroup, changeUsers, stayGroup} from "../actions/opUsers";
import {changeSharing} from "../actions/opOptions";

export function * requestGroups() {
    while (true) {
        let user = yield take(GET_GROUPS);
        let id = user.idUser;
        let idGroup = user.idGroup;
        let server = "http://localhost:3001/groups/"+id;
        axios.get(server)
            .then(function (response) {
                if (!!response.data.status && response.data.status === 'success') {
                    let groups = response.data.message;
                    store.dispatch(changeGroups(groups));
                    let users = [];
                    groups.forEach(group => {
                        group.membres.forEach(membre => {
                            let duplicate = false;
                            users.forEach(user => {
                                if(user.iduser === membre.iduser) {
                                    duplicate = true;
                                }
                            });
                            if(!duplicate) {
                                users.push(membre);
                            }
                        })
                    });
                    store.dispatch(changeUsers(users));
                    groups.forEach(group => {
                        group.membres.forEach(membre => {
                            store.dispatch(getPhoto(membre.iduser));
                        })
                    });
                    if(!idGroup) {
                        store.dispatch(changeIdGroup(''));
                    }
                    else {
                        store.dispatch(stayGroup(id, idGroup));
                    }
                }
                else if(response.data.status === 'fail') {
                    alert(response.data.message);
                }
                else {
                    alert('Erreur lors de la récupération des groupes d\'un utilisateur');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function * requestAddGroup() {
    while (true) {
        let user = yield take(ADD_GROUP);
        let id = user.idUser;
        let groupName = user.groupName;

        let server = "http://localhost:3001/groups/creategroup/";

        axios.post(server, {
            groupname: groupName,
            iduser: id,
        })
            .then(function (response) {
                if (!!response.status && response.status === 200) {
                    store.dispatch(getGroups(id));
                }
                else if(response.data.status === 'fail') {
                    alert(response.data.message);
                }
                else {
                    alert('Erreur lors de la création d\'un groupe');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function * requestPhoto() {
    while (true) {
        let user = yield take(GET_PHOTO);
        let id = user.idUser;

        let server = "https://graph.facebook.com/"+id+"/picture?redirect=false&type=normal";

        axios.get(server)
            .then(function (response) {
                if(!!response.status && response.status === 200) {
                    store.dispatch(setPhoto(id, response.data.data.url));
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export function * requestInfosGroup() {
    while (true) {
        let user = yield take(GET_INFOS_GROUP);
        let idUser = user.idUser;
        let idGroup = user.idGroup;
        let server = "http://localhost:3001/groups/positions/"+idUser+"/"+idGroup;
        axios.get(server)
            .then(function (response) {
                if(!!response.data.status && response.data.status === 'success') {
                    console.log(response.data);
                    let pinpoints = response.data.message.pinpoints;
                    let newPinpoints = [];
                    pinpoints.map((pinPoint => {
                        if(!!pinPoint.idpinpoint) {
                            let newPinPoint = {
                                id: pinPoint.idpinpoint,
                                pos: {lt: Number(pinPoint.pinlt), lg: Number(pinPoint.pinlg)},
                                desc: pinPoint.description,
                                idCreator: pinPoint.idcreator,
                                date: pinPoint.daterdv,
                                showInfo: false
                            };
                            newPinpoints.push(newPinPoint);
                        }
                    }));
                    store.dispatch(changePinPoints(newPinpoints));


                    let userpositions = response.data.message.userpositions;
                    let newPositions = [];
                    userpositions.map((position => {
                        if(!!position.iduser) {
                            let newPosition = {
                                iduser: position.iduser,
                                pos: {lt: Number(position.userlt), lg: Number(position.userlg)},
                                desc: position.msg,
                                current: position.current,
                                date: position.dateposition,
                                showInfo: false,
                                firstname:position.prenom,
                                lastname:position.nom
                            };
                            newPositions.push(newPosition);
                        }
                    }));
                    store.dispatch(updateMarkerMembers(newPositions));

                    let isSharing = response.data.message.issharing;
                    store.dispatch(changeSharing(isSharing));

                    let trackings = response.data.message.trackings;

                    let trackingsFormat = [];
                    trackings.map((tracking => {
                        if(!!trackings.iduser) {
                            let newTracking = {
                                iduser: tracking.iduser,
                                path: tracking.tracking
                            };
                            trackingsFormat.push(newTracking);
                        }
                    }));
                    store.dispatch(changeTrackings(trackings));
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export function * requestChangeNameGroup() {
    while (true) {
        let user = yield take(SEND_CHANGE_NAME);
        let id = user.idUser;
        let groupName = user.groupName;
        let idGroup = user.idGroup;

        let server = "http://localhost:3001/groups/changegroupname";

        axios.post(server, {
            newgroupname: groupName,
            idgroup: idGroup,
        })
            .then(function (response) {
                if (!!response.status && response.status === 200) {
                    store.dispatch(getGroups(id));
                }
                else if(response.data.status === 'fail') {
                    alert(response.data.message);
                }
                else {
                    alert('Erreur lors de la création d\'un groupe');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function * requestMessage() {
    while (true) {
        let user = yield take(GET_MESSAGE);
        let id = user.id;
        console.log(id);
        let server = "http://localhost:3001/users/getmsg/"+id;

        axios.get(server)
            .then(function (response) {
                if (!!response.data.status && response.data.status === "success") {
                    store.dispatch(setMessage(response.data.message.msg));
                }
                else if(response.data.status === 'fail') {
                    alert(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function * requestUpdateMessage() {
    while (true) {
        let user = yield take(UPDATE_MESSAGE);
        let id = user.id;
        let message = user.message;
        let server = "http://localhost:3001/users/updatemsg";

        axios.post(server, {
            iduser: id,
            msg: message
        })
            .then(function (response) {
                if (!!response.data.status && response.data.status === "success") {
                    alert("update du message");
                }
                else if(response.data.status === 'fail') {
                    alert(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function * GroupsFlow() {
    yield fork(requestGroups);
    yield fork(requestAddGroup);
    yield fork(requestPhoto);
    yield fork(requestInfosGroup);
    yield fork(requestChangeNameGroup);
    yield fork(requestMessage);
    yield fork(requestUpdateMessage);

}