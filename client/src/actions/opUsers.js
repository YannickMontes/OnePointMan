
export const ADD_USER = 'ADD_USER';
export const CHANGE_SEARCH = 'CHANGE_SEARCH';
export const DELETE_USER = 'DELETE_USER';
export const GET_USERS = 'GET_USERS';
export const CHANGE_USERS = 'CHANGE_USERS';
export const CHANGE_ID_GROUP = 'CHANGE_ID_GROUP';
export const SEND_DELETE_USER = 'SEND_DELETE_USER';
export const GET_FRIENDS = 'GET_FRIENDS';
export const SET_FRIENDS = 'SET_FRIENDS';
export const GET_PHOTO_FRIENDS = 'GET_PHOTO_FRIENDS';
export const SET_PHOTO_FRIENDS = 'SET_PHOTO_FRIENDS';
export const FRIENDS_TO_ADD = 'FRIENDS_TO_ADD';
export const ADD_USER_GROUP = 'ADD_USER_GROUP';
export const STAY_GROUP = 'STAY_GROUP';
export const PHOTO_GROUP = 'PHOTO_GROUP';
export const SET_PHOTO_GROUP = 'SET_PHOTO_GROUP';

export function addUser (arrayUsers, idGroup){
    return {type: ADD_USER, arrayUsers, idGroup}
}

export function changeSearch(newSearch) {
    return {type: CHANGE_SEARCH, newSearch}
}

export function changeDeleteUser (user) {
    return {type: DELETE_USER, user}
}

export function getUsers(idGroup, idUser) {
    return {type: GET_USERS, idGroup, idUser}
}

export function changeUsers(users) {
    return {type: CHANGE_USERS, users}
}

export function sendDeleteUser(user, idGroup, idUser) {
    return {type: SEND_DELETE_USER, user, idGroup, idUser}
}

export function getFriends(idUser) {
    return {type: GET_FRIENDS, idUser}
}

export function setFriends(friends) {
    return {type: SET_FRIENDS, friends}
}

export function getPhotoFriends(idFriend) {
    return {type: GET_PHOTO_FRIENDS, idFriend}
}

export function setPhotoFriends(idFriend, url) {
    return {type: SET_PHOTO_FRIENDS, idFriend, url}
}

export function friendsToAdd(friends) {
    return {type: FRIENDS_TO_ADD, friends}
}

export function addUserGroup (idUser, idGroup, idToAdd){
    return {type: ADD_USER_GROUP, idUser, idGroup, idToAdd}
}

export function changeIdGroup(idGroup) {
    return {type: CHANGE_ID_GROUP, idGroup}
}

export function stayGroup(idUser, idGroup) {
    return {type: STAY_GROUP, idUser, idGroup}
}

export function photoGroup(idUser) {
    return {type: PHOTO_GROUP, idUser}
}

export function setPhotoGroup(idUser, url) {
    return {type: SET_PHOTO_GROUP, idUser, url}
}