import React, {Component} from 'react';
import {Button, Col, ControlLabel, FormControl, FormGroup, Grid, Modal, PageHeader, Row} from 'react-bootstrap';
import '../style/Users.css';

class UsersComponent extends Component {
    constructor(props) {
        super(props);
        this._addUser = this._addUser.bind(this);
        this._open = this._open.bind(this);
        this._close = this._close.bind(this);
        this._close2 = this._close2.bind(this);
        this._sendAdd = this._sendAdd.bind(this);
        this._sendDelete = this._sendDelete.bind(this);
        this._handleChange =  this._handleChange.bind(this);
        this._filtre = this._filtre.bind(this);
        this.state = {
            showModal: false,
            showModal2: false
        }
    }

    _addUser() {
        let array = this.props.groupes;
        array.push({nom: this.props.nomGroupe});
        this.props.addUser(array);
    }

    _friendsToAdd(friend, event) {
        let duplicate = false;
        let friends = this.props.friendsArray;
        friends.forEach(friendToAdd => {
            if(friendToAdd.id === friend.id) {
                duplicate = true;
            }
        });
        if(!duplicate) {
            friends.push(friend);
            this.props.friendsToAdd(friends);
        }
    }

    _cancelFriends(friend, event) {
        let friends = this.props.friendsArray;
        let friendsToAdd = friends.filter(friendToCancel => {
            return friendToCancel.id !== friend.id;
        });
        this.props.friendsToAdd(friendsToAdd);
    }

    _open() {
        this.setState({ showModal: true });
    }

    _close() {
        this.props.friendsToAdd([]);
        this.setState({ showModal: false });
    }

    _open2(user) {
        this.props.changeDeleteUser(user);
        this.setState({ showModal2: true });
    }

    _close2() {
        this.setState({ showModal2: false });
    }

    _handleChange(event) {
        this._filtre(event.target.value);
        this.props.changeSearch(event.target.value);
    }

    _sendAdd(event) {
        event.preventDefault();
        this.props.addUserGroup(this.props.friendsArray, this.props.idUser, this.props.groupToDisplay);
        this._close();
    }

    _sendDelete(event) {
        event.preventDefault();
        this.props.sendDeleteUser(this.props.usersToDelete, this.props.groupToDisplay, this.props.idUser);
        this._close2();
    }

    _filtre(filtre) {
        this.props.friends.map(friend => {
            if(friend.name.toUpperCase().indexOf(filtre.toUpperCase()) !== -1) {
                document.getElementById("listFriend"+friend.id).style.display = "";
            }
            else {
                document.getElementById("listFriend"+friend.id).style.display = "none";
            }
        })
    }

    render() {
        return (
            <Row className="text-centerUser show-grid">
                <Col md={10}>
                    <ul className="navlist">
                        {
                            this.props.users.map((user, index) => {
                                if(user.urlPhoto) {
                                    return <li key={index} onClick={this._open2.bind(this, user)}><img src={user.urlPhoto} alt="photo de profil" height="70" width="70"/></li>
                                }
                            })
                        }
                    </ul>
                </Col>
                    {
                        this.props.groupToDisplay && <Col md={2}><i className="fa fa-plus fa-2x addButton" style={{color: 'white'}} onClick={this._open}/></Col>
                    }
                <Modal show={this.state.showModal} onHide={this._close} className="moddal">
                    <Modal.Header closeButton>
                        <Modal.Title>Ajout d'un membre</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul className="navlist">
                            {
                                this.props.friends.map((friend, index) => {
                                    let duplicate = false;
                                    this.props.users.forEach((user) => {
                                        if(user.iduser === friend.id) {
                                            duplicate = true;
                                        }
                                    });
                                    if(!duplicate) {
                                        return <li key={index} id={"listFriend"+friend.id} onClick={this._friendsToAdd.bind(this, friend)}><img src={friend.urlPhoto} alt="photo de profil" height="70" width="70"/>{friend.name}</li>
                                    }
                                })
                            }
                        </ul>
                        <form>
                            <FormGroup
                                controlId="formBasicText"
                            >
                                <ControlLabel>Chercher un ami</ControlLabel>
                                <FormControl
                                    type="text"
                                    onChange={this._handleChange}
                                />
                                <FormControl.Feedback />
                                {
                                    this.props.friendsArray.length !== 0 && <h3>Amis à ajouter</h3>
                                }
                                <ul className="navlist">
                                {
                                    this.props.friendsArray.map((friend, index) => {
                                        if(friend.urlPhoto) {
                                            return <li key={index} onClick={this._cancelFriends.bind(this, friend)}><img src={friend.urlPhoto} alt="photo de profil" height="70" width="70"/>{friend.name}</li>
                                        }
                                    })
                                }
                                </ul>
                                <Button type="submit" onClick={this._sendAdd}>Ajouter dans le groupe</Button>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.showModal2} onHide={this._close2} className="moddal">
                    <Modal.Header closeButton>
                        <Modal.Title>Voulez-vous supprimer ce membre du groupe ?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Button bsStyle="primary" onClick={this._sendDelete}>Oui</Button>
                            <Button bsStyle="danger" onClick={this._close2}>Annuler</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </Row>
        )
    }
}

export default  UsersComponent;
