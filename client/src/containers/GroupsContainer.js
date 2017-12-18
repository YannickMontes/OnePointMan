import React, {Component} from 'react';
import {connect} from "react-redux";
import {
    addGroup, changeGroupId, changeGroupName, getGroups, getInfosGroup, getMessage,
    sendChangeName
} from "../actions/opGroups";
import GroupsComponent from "../components/GroupsComponent";
import {addUser} from "../actions/opUsers";
import {getDrawingsGroup, setDrawingToShow} from "../actions/opCanvas";


class GroupsContainer extends Component {
    constructor(props) {
        super(props);
        this.props.getGroups(this.props.opLogin.idUser);
    }

    render() {
        let {groups, groupName, idGroup} = this.props.opGroups;
        let {groupsUsers} = this.props.opUsers;
        let {urlPhoto, idUser} = this.props.opLogin;
        return (
            <div>
                {
                    !this.props.draw && <GroupsComponent groups={groups}
                                                        groupName={groupName}
                                                        groupsUsers={groupsUsers}
                                                        getInfosGroup={this.props.getInfosGroup}
                                                        changeGroupName={this.props.changeGroupName}
                                                        addGroup={this.props.addGroup}
                                                        addUser={this.props.addUser}
                                                        idUser={idUser}
                                                        idGroup={idGroup}
                                                        photoUser={urlPhoto}
                                                        sendChangeName={this.props.sendChangeName}
                                                        changeGroupId={this.props.changeGroupId}
                    />
                }
            </div>

        )
    }
}

function mapStateToProps (state) {

    return{
        opGroups: state.opGroups,
        opUsers: state.opUsers,
        opLogin: state.opLogin
    }
}

//fonctions
const  mapDispatchToProps = (dispatch) => {
    return{
        changeGroupName: (groupName) => {
            dispatch(changeGroupName(groupName));
        },
        addGroup: (groupName, idUser) => {
            dispatch(addGroup(groupName, idUser));
        },
        addUser: (arrayUsers, idGroup, idUser) => {
            dispatch(setDrawingToShow([]));
            dispatch(addUser(arrayUsers, idGroup));
            dispatch(getInfosGroup(idUser, idGroup));
            dispatch(getDrawingsGroup(idUser, idGroup));
            //dispatch(push("/drawings"));
        },
        getGroups: (idUser) => {
            dispatch(getGroups(idUser));
            dispatch(getMessage(idUser));
        },
        sendChangeName: (idGroup, groupName, idUser) => {
            dispatch(sendChangeName(idGroup, groupName, idUser));
        },
        changeGroupId: (id) => {
            dispatch(changeGroupId(id));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (GroupsContainer)
