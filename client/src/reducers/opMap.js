import {

}  from '../actions/opMap';
import {CHANGE_FORM, LOGIN} from "../actions/opLogin";
import {CHANGE_MAP_CENTER} from "../actions/opMap";
import {CHANGE_MARKERS} from "../actions/opMap";
import {CHANGE_MARKER_GEOLOCATION} from "../actions/opMap";
import {CHANGE_MARKERS_SELECT} from "../actions/opMap";
import {CHANGE_PINPOINTS} from "../actions/opMap";
import {CHANGE_LOCATION_SELECT} from "../actions/opMap";
import {CHANGE_MARKER_SELECT} from "../actions/opMap";
import {CHANGE_NEW_PINPOINT} from "../actions/opOptions";
import {CHANGE_MAP} from "../actions/opMap";
import {CHANGE_MARKER_MEMBERS} from "../actions/opMap";
import {CHANGE_MARKER_MEMBER_DISPLAY} from "../actions/opMap";
import {CHANGE_PINPOINTS_DISPLAY} from "../actions/opMap";
import {CHANGE_TRACKINGS} from "../actions/opMap";

//ajouter le reste dans l'import

//pour le register e mail
let initialState = {
    isMarkerShown : true,
    isPinPointShown : true,
    mapCenter : { lat: 45.380002, lng: -71.925438 },
    bounds : {},
    trackings : [],
    zoom : 3,
    markerSelect : { lat: 45.380002, lng: -71.925438},
    locationSelect : "",
    pinPoints : [],
    markersGeoLocation : [],
    markersMembers : [],
    map : null
};

export default function reducer (state = initialState, action ){

    switch (action.type){

        case CHANGE_MAP_CENTER:
            return {...state , mapCenter: action.mapCenter, zoom : action.zoom, bounds : action.bounds};

        case CHANGE_LOCATION_SELECT:
            return {...state , locationSelect: action.locationSelect};
        case CHANGE_MARKER_SELECT:
            return {...state , markerSelect: action.marker};

        case CHANGE_MARKER_GEOLOCATION:
        return {...state, markersGeoLocation : action.markers};

        case CHANGE_MARKER_MEMBERS:
        return {...state, markersMembers : action.markers};

        case CHANGE_PINPOINTS:
            return {...state, pinPoints : action.pinPoints};

        case CHANGE_MAP:
            return {...state, map : action.map};

        case CHANGE_PINPOINTS_DISPLAY:
            return {...state, isPinPointShown : !state.isPinPointShown};

        case CHANGE_MARKER_MEMBER_DISPLAY:
            return {...state, isMarkerShown : !state.isMarkerShown};

        case CHANGE_TRACKINGS:
            return {...state, trackings : action.trackings};


        default:
            return state

    }

}