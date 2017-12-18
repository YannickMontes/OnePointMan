import {
    BIND_DRAWINGS_GROUP, CHANGE_DELETE, CHANGE_DESCRIPTION, DRAW, SET_DRAWING_TO_SHOW, SET_DRAWINGS, TRANSITION
} from "../actions/opCanvas";

//ajouter le reste dans l'import

//pour le register e mail
let initialState = {
    errors: '',
    draw: false,
    drawings: '',
    description: '',
    drawingsGroup: [],
    drawingsToShow: [],
    idDelete: ''
};

export default function reducer (state = initialState, action ){

    switch (action.type){
        case DRAW:
            return {...state , draw: action.boolean, error:''};
        case SET_DRAWINGS:
            return {...state, drawings: action.drawings, error:''};
        case CHANGE_DESCRIPTION:
            return {...state, description: action.description, error:''};
        case BIND_DRAWINGS_GROUP:
            return {...state, drawingsGroup: action.drawings, error:''};
        case SET_DRAWING_TO_SHOW:
            return {...state, drawingsToShow: action.drawing, error:''};
        case CHANGE_DELETE:
            return {...state, idDelete: action.id, error:''};
        default:
            return state
    }

}