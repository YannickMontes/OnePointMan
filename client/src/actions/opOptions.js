export const CHANGE_ADDRESS = 'CHANGE_ADDRESS';
export const CHANGE_SHARING_MODE = 'CHANGE_SHARING_MODE';
export const CHANGE_RDV_MODAL_VISIBILITY = 'CHANGE_RDV_MODAL_VISIBILITY';
export const CREATE_PINPOINT = 'CREATE_PINPOINT';
export const CHANGE_NEW_PINPOINT = 'CHANGE_NEW_PINPOINT';
export const CHANGE_RM_PP_MODAL_VISIBILITY = 'CHANGE_RM_PP_MODAL_VISIBILITY';
export const CHANGE_RM_PINPOINT = 'CHANGE_RM_PINPOINT';
export const DELETE_PINPOINT = 'DELETE_PINPOINT';
export const CHANGE_SHARING = 'CHANGE_SHARING';
export const SHARING_LOCATION_MODE = 'SHARING_LOCATION_MODE';

export function changeAddress (newAddress, validAddress){
    return {type: CHANGE_ADDRESS, newAddress, validAddress}
}

export function transmitSharingMode (isSharing, idUser, idGroup){
    return {type: SHARING_LOCATION_MODE, isSharing, idUser, idGroup}
}

export function changeSendingMode () {
    return {type : CHANGE_SHARING_MODE}
}

export function changeSharing (isSharing) {
    return {type : CHANGE_SHARING, isSharing}
}

export function changeRdvModalVisibility () {
    return {type : CHANGE_RDV_MODAL_VISIBILITY}
}

export function changeRmPpModalVisibility () {
    return {type : CHANGE_RM_PP_MODAL_VISIBILITY}
}

export function createPinPoint (pinPoint, idUser, idGroup) {
    return {type : CREATE_PINPOINT, pinPoint, idUser, idGroup}
}

export function deletePinPoint (idPinPoint, idUser, idGroup) {
    return {type : DELETE_PINPOINT, idPinPoint, idUser, idGroup}
}

export function changeNewPinPoint (pinPoint) {
    return {type : CHANGE_NEW_PINPOINT, pinPoint}
}

export function changePinPointToRemove (pinPointToRemove) {
    return {type : CHANGE_RM_PINPOINT, pinPointToRemove}
}