export const CHANGE_GROUP_NAME = 'CHANGE_GROUP_NAME';
export const ADD_GROUP = 'ADD_GROUP';
export const GET_GROUPS = 'GET_GROUPS';
export const CHANGE_GROUPS = 'CHANGE_GROUPS';
export const GET_PHOTO = 'GET_PHOTO';
export const SET_PHOTO = 'SET_PHOTO';
export const GET_INFOS_GROUP = 'GET_INFOS_GROUP';
export const SEND_CHANGE_NAME = 'SEND_CHANGE_NAME';
export const CHANGE_GROUP_ID = 'CHANGE_GROUP_ID';
export const GET_MESSAGE = 'GET_MESSAGE';
export const SET_MESSAGE = 'SET_MESSAGE';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';

export function changeGroupName (groupName){
    return {type: CHANGE_GROUP_NAME, groupName}
}

export function addGroup (groupName, idUser){
    return {type: ADD_GROUP, groupName, idUser}
}

export function getGroups(idUser, idGroup) {
    return {type: GET_GROUPS, idUser, idGroup}
}

export function changeGroups(groups) {
    return {type: CHANGE_GROUPS, groups}
}

export function getPhoto(idUser) {
    return {type: GET_PHOTO, idUser}
}

export function setPhoto(idUser, url) {
    return {type: SET_PHOTO, idUser, url}
}

export function getInfosGroup(idUser, idGroup) {
    return {type: GET_INFOS_GROUP, idUser, idGroup}
}

export function sendChangeName(idGroup, groupName, idUser) {
    return {type: SEND_CHANGE_NAME, idUser, idGroup, groupName}
}

export function changeGroupId(id) {
    return {type: CHANGE_GROUP_ID, id}
}

export function getMessage(id) {
    return {type: GET_MESSAGE, id}
}

export function setMessage(message) {
    return {type: SET_MESSAGE, message}
}

export function updateMessage(id, message) {
    return {type: UPDATE_MESSAGE, id, message}
}