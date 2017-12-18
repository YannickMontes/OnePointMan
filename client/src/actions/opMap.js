export const CHANGE_MAP_CENTER = 'CHANGE_MAP_CENTER';
export const CHANGE_MARKER_SELECT = 'CHANGE_MARKER_SELECT';
export const CHANGE_MARKER_GEOLOCATION = 'CHANGE_MARKER_GEOLOCATION';
export const CHANGE_PINPOINTS = 'CHANGE_PINPOINTS';
export const CHANGE_LOCATION_SELECT = 'CHANGE_LOCATION_SELECT';
export const CHANGE_MAP = 'CHANGE_MAP';
export const CHANGE_MARKER_MEMBERS = 'CHANGE_MARKER_MEMBERS';
export const CHANGE_PINPOINTS_DISPLAY = 'CHANGE_PINPOINTS_DISPLAY';
export const CHANGE_MARKER_MEMBER_DISPLAY = 'CHANGE_MARKER_MEMBER_DISPLAY';
export const CHANGE_TRACKINGS = 'CHANGE_TRACKINGS';

export function recenterMap (mapCenter, zoom, bounds){
    return {type: CHANGE_MAP_CENTER, mapCenter, zoom, bounds}
}

export function updateMarkerSelect (marker){
    return {type: CHANGE_MARKER_SELECT, marker}
}

export function updateMarkerMembers (markers){
    return {type: CHANGE_MARKER_MEMBERS, markers}
}

export function updateMarkerGeoLocation (markers, idUser){
    return {type: CHANGE_MARKER_GEOLOCATION, markers, idUser}
}

export function changePinPoints (pinPoints) {
    return {type : CHANGE_PINPOINTS, pinPoints}
}

export function changeLocationSelect (locationSelect) {
    return {type : CHANGE_LOCATION_SELECT, locationSelect}
}

export function changeMap (map) {
    return {type : CHANGE_MAP, map}
}

export function changeMarkerMemberDisplay() {
    return {type : CHANGE_MARKER_MEMBER_DISPLAY}
}

export function changePinPointDisplay () {
    return {type : CHANGE_PINPOINTS_DISPLAY}
}

export function changeTrackings(trackings) {
    return {type : CHANGE_TRACKINGS, trackings}
}