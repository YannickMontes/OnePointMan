export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const CHANGE_FORM = 'CHANGE_FORM';
export const CLEAR_SESSION = 'CLEAR_SESSION';
export const SENDING_REQUEST = 'SENDING_REQUEST';
export const LOGOUT = 'LOGOUT';
export const SET_AUTH = 'SET_AUTH';
export const LOGIN = 'LOGIN';
export const IDUSER = 'IDUSER';
export const GET_PHOTO_USER = 'GET_PHOTO_USER';
export const SET_PHOTO_USER = 'SET_PHOTO_USER';

export function loginRequest (){
    return {type: LOGIN_REQUEST}
}

export function sendingRequest (sending){
    return {type: SENDING_REQUEST, sending}
}

export function setAuthState (newAuthState){
    return {type: SET_AUTH, newAuthState}
}

export function login (isAdminState) {
    return {type: LOGIN , isAdminState}
}

export function logout (){
    return {type: LOGOUT}
}

export function idUser(id) {
    return {type: IDUSER, id}
}

export function getPhotoUser(idUser) {
    return {type: GET_PHOTO_USER, idUser}
}

export function setPhotoUser(url) {
    return {type: SET_PHOTO_USER, url}
}