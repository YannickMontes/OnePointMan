
//ajouter le reste dans l'import

//pour le register e mail
import {
    ADD_USER, CHANGE_ID_GROUP, CHANGE_SEARCH, CHANGE_USERS, DELETE_USER, FRIENDS_TO_ADD, SET_FRIENDS, SET_PHOTO_FRIENDS,
    SET_PHOTO_GROUP
} from "../actions/opUsers";

let initialState = {
    users: [],
    groupToDisplay: '',
    search: '',
    usersToDelete: {},
    friends: [],
    friendsToAdd: [],
    errors: '',
};

export default function reducer (state = initialState, action ){

    switch (action.type){

        case ADD_USER:
            return {...state ,users: action.arrayUsers , error:'', groupToDisplay: action.idGroup};
        case DELETE_USER:
            return {...state ,usersToDelete: action.user , error:''};
        case CHANGE_SEARCH:
            return {...state ,search: action.newSearch , error:''};
        case CHANGE_USERS:
            return {...state,users: action.users, error: ''};
        case SET_FRIENDS:
            return {...state,friends: action.friends, error: ''};
        case SET_PHOTO_FRIENDS:
            let id = action.idFriend;
            let friends = state.friends;
            friends.forEach(friend => {
                if(friend.id === id) {
                    friend.urlPhoto = action.url;
                }
            });
            return {...state, friends: friends, error: ''};
        case FRIENDS_TO_ADD:
            return {...state,friendsToAdd: action.friends, error: ''};
        case CHANGE_ID_GROUP:
            return {...state,groupToDisplay: action.idGroup, error: ''};
        case SET_PHOTO_GROUP:
            let iduser = action.idUser;
            let users = state.users;
            users.forEach(user => {
                if(user.iduser === iduser) {
                    user.urlPhoto = action.url;
                }
            });
            return {...state, users: users, error: ''};
        default:
            return state

    }

}