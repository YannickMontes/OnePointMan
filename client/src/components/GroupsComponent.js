import React, {Component} from 'react';
import {Button, ControlLabel, FormControl, FormGroup, Grid, Modal, PageHeader, Row} from 'react-bootstrap';
import '../style/Groups.css';

class GroupsComponent extends Component {
    constructor(props) {
        super(props);
        this._addGroup = this._addGroup.bind(this);
        this._open = this._open.bind(this);
        this._close = this._close.bind(this);
        this._close2 = this._close2.bind(this);
        this._getValidation = this._getValidation.bind(this);
        this._handleChange =  this._handleChange.bind(this);
        this._displayUsers = this._displayUsers.bind(this);
        this._sendChangeName = this._sendChangeName.bind(this);
        this.state = {
            showModal: false,
            showModal2: false
        }
    }

    _addGroup() {
        this.props.addGroup(this.props.groupName, this.props.idUser);
    }

    _open() {
        this.setState({ showModal: true });
    }

    _close() {
        this.setState({ showModal: false });
        this.props.changeGroupName('');
    }

    _open2(group) {
        this.setState({ showModal2: true });
        this.props.changeGroupId(group.idgroup);
        return false;
    }

    _sendChangeName() {
        this.props.sendChangeName(this.props.idGroup, this.props.groupName, this.props.idUser);
        this._close2();
    }

    _close2() {
        this.setState({ showModal2: false });
        this.props.changeGroupName('');
    }

    _getValidation(event) {
        event.preventDefault();
        const length = this.props.groupName.length;
        if (length > 0) {
            this._addGroup();
            this._close();
        }
        else if (length === 0) {
            return 'error';
        }
    }

    _handleChange(event) {
        this.props.changeGroupName(event.target.value);
    }

    _displayUsers(event) {
        let users = this.props.groups;
        let usersToDisplay = users.filter(group => {
            return parseInt(group.idgroup, 10) === parseInt(event.target.id, 10);
        });
        if(usersToDisplay.length === 0) {
            this.props.addUser([], event.target.id, this.props.idUser);
        }
        else {
            this.props.addUser(usersToDisplay[0].membres, event.target.id, this.props.idUser);
        }
    }

    _checkLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._processLocation);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    _processLocation (location) {
        let point = {
            lat : location.coords.latitude,
            lng : location.coords.longitude
        };
        let pointArray = [point];
        this.props.updateMarkersGeolocation(pointArray);
    }

    render() {
        return (
            <div id="menuToggle">

                <input type="checkbox" />


                <span/>
                <span/>
                <span/>

                <ul id="menu">
                    <img src={this.props.photoUser} alt="photo de profil" className="photoUser" height="50" width="50"/>
                    {
                        this.props.groups.map((group, index) => {
                            return <a key={index}><li onContextMenu={this._open2.bind(this, group)} onClick={this._displayUsers} id={group.idgroup}>{group.nomgroup}</li></a>
                        })
                    }
                    <i className="fa fa-plus fa-lg" style={{color: '#232323'}} onClick={this._open}/>
                </ul>
                <Modal show={this.state.showModal} onHide={this._close} className="moddal">
                    <Modal.Header closeButton>
                        <Modal.Title>Création d'un groupe</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this._getValidation}>
                            <FormGroup
                                controlId="formBasicText"
                            >
                                <ControlLabel>Nom du groupe</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.props.groupName}
                                    onChange={this._handleChange}
                                />
                                <FormControl.Feedback />
                                <Button type="submit">Créer un groupe</Button>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showModal2} onHide={this._close2} className="moddal">
                    <Modal.Header closeButton>
                        <Modal.Title>Voulez-vous changer le nom du groupe ?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup
                            controlId="formBasicText"
                        >
                            <ControlLabel>Nouveau nom du groupe</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.props.groupName}
                                onChange={this._handleChange}
                            />
                        </FormGroup>
                        <div className="text-center">
                            <Button bsStyle="primary" onClick={this._sendChangeName}>Oui</Button>
                            <Button bsStyle="danger" onClick={this._close2}>Annuler</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default  GroupsComponent;
