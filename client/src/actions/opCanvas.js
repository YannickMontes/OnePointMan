export const DRAW = 'DRAW';
export const SET_DRAWINGS = 'SET_DRAWINGS';
export const CHANGE_DESCRIPTION = 'CHANGE_DESCRIPTION';
export const SEND_DRAWING = 'SEND_DRAWING';
export const GET_DRAWINGS_GROUP = 'GET_DRAWINGS_GROUP';
export const BIND_DRAWINGS_GROUP = 'BIND_DRAWINGS_GROUP';
export const SET_DRAWING_TO_SHOW = 'SET_DRAWING_TO_SHOW';
export const CHANGE_DELETE = 'CHANGE_DELETE';
export const DELETE_DRAWING = 'DELETE_DRAWING';

export function draw (boolean){
    return {type: DRAW, boolean}
}

export function setDrawings(drawings) {
    return {type: SET_DRAWINGS, drawings}
}

export function changeDescription(description) {
    return {type:CHANGE_DESCRIPTION, description}
}

export function sendDrawing(drawing, idUser, idGroup, description, zoom, bounds) {
    return {type: SEND_DRAWING, drawing, idUser, idGroup, description, zoom, bounds}
}

export function getDrawingsGroup(idUser, idGroup) {
    return {type: GET_DRAWINGS_GROUP, idUser, idGroup}
}

export function bindDrawingsGroup(drawings) {
    return {type: BIND_DRAWINGS_GROUP, drawings}
}

export function chandeDelete(id) {
    return {type: CHANGE_DELETE, id}
}

export function deleteDrawing(id, idUser, idGroup) {
    return {type: DELETE_DRAWING, id, idUser, idGroup}
}

export function setDrawingToShow(drawing) {
    return {type: SET_DRAWING_TO_SHOW, drawing}
}