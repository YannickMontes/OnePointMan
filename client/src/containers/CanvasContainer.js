import React, {Component} from 'react';
import {connect} from "react-redux";
import {addGroup, changeGroupName, getGroups, getInfosGroup} from "../actions/opGroups";
import GroupsComponent from "../components/GroupsComponent";
import {addUser} from "../actions/opUsers";
import CanvasComponent from "../components/CanvasComponent";
import {changeDescription, draw, sendDrawing, setDrawings} from "../actions/opCanvas";
import {push} from "react-router-redux";

class CanvasContainer extends Component {
    constructor(props) {
        super(props);
        this._handleModeDessin = this._handleModeDessin.bind(this);
    }

    _handleModeDessin(event) {
        event.preventDefault();
        let boolean = this.props.opCanvas.draw;
        let idGroup = this.props.opUsers.groupToDisplay;
        if (!boolean && idGroup !== '') {
            boolean = true;
        }
        else {
            boolean = false;
        }
        this.props.draw(boolean);
    }

    render() {
        let {drawings, description} = this.props.opCanvas;
        let {idUser} = this.props.opLogin;
        let {groupToDisplay} = this.props.opUsers;
        let {bounds, zoom} = this.props.opMap;
        return (
            <CanvasComponent setDrawings={this.props.setDrawings}
                             drawing={drawings}
                             description={description}
                             idUser={idUser}
                             groupToDisplay={groupToDisplay}
                             bounds={bounds}
                             zoom={zoom}
                             handleModeDessin={this._handleModeDessin}
                             sendDrawing={this.props.sendDrawing}
                             changeDescription={this.props.changeDescription}
            />
        )
    }
}

function mapStateToProps (state) {

    return{

        opLogin: state.opLogin,
        opCanvas: state.opCanvas,
        opUsers: state.opUsers,
        opMap: state.opMap
    }
}

//fonctions
const  mapDispatchToProps = (dispatch) => {
    return{
        setDrawings: (drawings) => {
            dispatch(setDrawings(drawings));
        },
        changeDescription: (description) => {
            dispatch(changeDescription(description));
        },
        sendDrawing:(drawing, idUser, idGroup, description, zoom, center) => {
            dispatch(sendDrawing(drawing, idUser, idGroup, description, zoom, center));
            dispatch(draw(false));
        },
        draw: (boolean) => {
            dispatch(draw(boolean));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (CanvasContainer)
