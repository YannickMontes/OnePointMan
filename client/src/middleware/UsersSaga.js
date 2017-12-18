import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {store} from '../store';
import {
    ADD_USER_GROUP, addUser,
    changeFriends, changeUsers, DELETE_USER_TEST, GET_FRIENDS, GET_PHOTO_FRIENDS, GET_USERS,
    getPhotoFriends,
    getUsers, PHOTO_GROUP, photoGroup, SEND_DELETE_USER, setFriends, setPhotoFriends, setPhotoGroup, STAY_GROUP,
    stayGroup
} from "../actions/opUsers";
import {getGroups, setPhoto} from "../actions/opGroups";
import {setPhotoUser} from "../actions/opLogin";

export function * requestUsersGroup() {
    while (true) {
        let user = yield take(GET_USERS);
        let id = user.idUser;
        let idGroup = user.idGroup;

        let server = "http://localhost:3001/"+idGroup+"/"+id;

        axios.get(server)
            .then(function (response) {
                if (!!response.data.status && response.data.status === 'success') {
                    store.dispatch(changeUsers(response.data.message));
                }
                else if(response.data.status === 'fail') {
                    alert(response.data.message);
                }
                else {
                    alert('Erreur lors de la récupération des utilisateurs d\'un groupe');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function * requestAddUsers() {
    while (true) {
        let user = yield take(ADD_USER_GROUP);
        let idUser = user.idUser;
        let id = user.idToAdd;
        let idGroup = user.idGroup;

        let server = "http://localhost:3001/users/createuser";

        axios.post(server, {
            iduser: id,
            idgroup: idGroup
        })
            .then(function (response) {
                if (!!response.status && response.status === 200) {
                    store.dispatch(getGroups(idUser, idGroup));
                }
                else if(response.data.status === 'fail') {
                    alert(response.data.message);
                }
                else {
                    alert('Erreur lors de l\'ajout d\'un membre au groupe');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function * requestDeleteUser() {
    while (true) {
        let user = yield take(SEND_DELETE_USER);
        let idUser = user.idUser;
        let id = user.user.iduser;
        let idGroup = user.idGroup;

        let server = "http://localhost:3001/users/deleteuser";

        axios.post(server, {
            iduser: id,
            idgroup: idGroup,
        })
            .then(function (response) {
                if (!!response.data.status && response.data.status === "success") {
                    store.dispatch(getGroups(idUser, idGroup));
                }
                else if(response.data.status === 'fail') {
                    alert(response.data.message);
                }
                else {
                    alert('Erreur lors de la suppression d\'un membre au groupe');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function * requestFriends() {
    while (true) {
        let user = yield take(GET_FRIENDS);
        let id = user.idUser;

        let server = "http://localhost:3001/users/userFriends/"+id;
        axios.get(server)
            .then(function (response) {
                if (!!response.status && response.status === 200) {
                    let friends = response.data.friendlist;
                    store.dispatch(setFriends(friends));
                    friends.forEach(friend => {
                        store.dispatch(getPhotoFriends(friend.id));
                    })
                }
                else if(response.status === 'fail') {
                    alert(response.data.message);
                }
                else {
                    alert('Erreur lors de la récupération des amis');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function * requestPhoto() {
    while (true) {
        let user = yield take(GET_PHOTO_FRIENDS);
        let id = user.idFriend;

        let server = "https://graph.facebook.com/"+id+"/picture?redirect=false&type=normal";

        axios.get(server)
            .then(function (response) {
                if(!!response.status && response.status === 200) {
                    store.dispatch(setPhotoFriends(id, response.data.data.url));
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export function * requestGroupInfo() {
    while (true) {
        let user = yield take(STAY_GROUP);
        let idUser = user.idUser;
        let idGroup = user.idGroup;

        let server = "http://localhost:3001/groups/getGroupInfo/"+idGroup;

        axios.get(server)
            .then(function (response) {
                console.log(response);
                if(!!response.status && response.status === 200) {
                    let membres = response.data.listeMembres;
                    let groupe = membres.map(user => {
                        return {...user, nomuser: user.nom}
                    });
                    store.dispatch(addUser(groupe, idGroup));

                    groupe.forEach(user => {
                        store.dispatch(photoGroup(user.iduser));
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export function * requestPhotoUsers() {
    while (true) {
        let user = yield take(PHOTO_GROUP);
        let id = user.idUser;
        let server = "https://graph.facebook.com/"+id+"/picture?redirect=false&type=normal";

        axios.get(server)
            .then(function (response) {
                if(!!response.status && response.status === 200) {
                    store.dispatch(setPhotoGroup(id, response.data.data.url));
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export function * UsersFlow() {
    yield fork(requestUsersGroup);
    yield fork(requestAddUsers);
    yield fork(requestDeleteUser);
    yield fork(requestFriends);
    yield fork(requestPhoto);
    yield fork(requestGroupInfo);
    yield fork(requestPhotoUsers);
}