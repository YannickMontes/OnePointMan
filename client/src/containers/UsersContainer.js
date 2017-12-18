import React, {Component} from 'react';
import {connect} from "react-redux";
import {
    addUser, addUserGroup, changeDeleteUser, changeSearch, friendsToAdd, getFriends,
    sendDeleteUser
} from "../actions/opUsers";
import UsersComponent from "../components/UsersComponent";
import {getInfosGroup} from "../actions/opGroups";
import {idUser} from "../actions/opLogin";


class UsersContainer extends Component {
    constructor(props) {
        super(props);
        this.props.getFriends(this.props.opLogin.idUser);
    }

    render() {
        let {users, search, groupToDisplay,
            friends, friendsToAdd, usersToDelete} = this.props.opUsers;
        return (
            <div>
            {
                groupToDisplay && <UsersComponent users={users}
                                                  search={search}
                                                  friends={friends}
                                                  groupToDisplay={groupToDisplay}
                                                  friendsArray={friendsToAdd}
                                                  idUser={this.props.opLogin.idUser}
                                                  changeSearch={this.props.changeSearch}
                                                  friendsToAdd={this.props.friendsToAdd}
                                                  addUser={this.props.addUser}
                                                  addUserGroup={this.props.addUserGroup}
                                                  changeDeleteUser={this.props.changeDeleteUser}
                                                  sendDeleteUser={this.props.sendDeleteUser}
                                                  usersToDelete={usersToDelete}
                />
            }
            </div>
        )
    }
}

function mapStateToProps (state) {

    return{
        opUsers: state.opUsers,
        opLogin: state.opLogin
    }
}

//fonctions
const  mapDispatchToProps = (dispatch) => {
    return{
        addUser: (arrayUsers, idGroup) => {
            dispatch(addUser(arrayUsers, idGroup));
        },
        changeSearch: (newSearch) => {
            dispatch(changeSearch(newSearch));
        },
        getFriends: (idUser) => {
            dispatch(getFriends(idUser));
        },
        friendsToAdd: (friends) => {
            dispatch(friendsToAdd(friends));
        },
        addUserGroup: (array, idUser, idGroup) => {
            array.forEach(friend => {
                dispatch(addUserGroup(idUser, idGroup, friend.id));
            })
        },
        changeDeleteUser: (user) => {
            dispatch(changeDeleteUser(user));
        },
        sendDeleteUser: (user, idGroup, idUser) => {
            dispatch(sendDeleteUser(user, idGroup, idUser));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (UsersContainer)
