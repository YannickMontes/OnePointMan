import {SketchField, Tools, ContentUndo} from 'react-sketch';
import React, {Component} from 'react';
import {Button, Col, ControlLabel, FormControl, FormGroup, Grid, Modal, PageHeader, Row} from 'react-bootstrap';

class CanvasComponent extends React.Component {
    constructor(props) {
        super(props);
        this._undo = this._undo.bind(this);
        this._redo = this._redo.bind(this);
        this._save = this._save.bind(this);
        this._open = this._open.bind(this);
        this._close = this._close.bind(this);
        this._sendDrawing = this._sendDrawing.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this.state = {
            canUndo: false,
            canRedo: false,
            showModal: false,
        };
    }

    _handleChange(event) {
        this.props.changeDescription(event.target.value);
    }

    _open() {
        this.setState({ showModal: true });
    }

    _close() {
        this.setState({ showModal: false });
    }

    _save = () => {
        this.props.setDrawings(this._sketch.toDataURL());
        this._open();
    };

    _undo = () => {
        this._sketch.undo();
        this.setState({
            canUndo: this._sketch.canUndo(),
            canRedo: this._sketch.canRedo()
        })
    };
    _redo = () => {
        this._sketch.redo();
        this.setState({
            canUndo: this._sketch.canUndo(),
            canRedo: this._sketch.canRedo()
        })
    };

    _sendDrawing() {
        /*let data = [];
        for (let i = 0; i < this.props.drawing.length; i++) {
            data.push(this.props.drawing.charCodeAt(i));
        }
        console.log(data);*/
        let draw = this.props.drawing;

        this.props.sendDrawing(draw.substring(draw.indexOf(',')+1, draw.length), this.props.idUser, this.props.groupToDisplay, this.props.description, this.props.zoom, this.props.bounds);
        this._close();
    }

    render() {
        return (
            <div>
                <SketchField width='1440px'
                             height='768px'
                             tool={Tools.Pencil}
                             color='black'
                             ref={(c) => this._sketch = c}
                             lineWidth={3}/>
                <div className="toolbar">
                    <ul className="navlist">
                        <li><i className="fa fa-ban fa-4x" style={{color: 'black'}} onClick={this.props.handleModeDessin}/></li>
                        <li><i className="fa fa-undo fa-4x" style={{color: 'black'}} onClick={this._undo}/></li>
                        <li><i className="fa fa-repeat fa-4x" style={{color: 'black'}} onClick={this._redo}/></li>
                        <li><i className="fa fa-check fa-4x" style={{color: 'black'}} onClick={this._save}/></li>
                    </ul>
                </div>
                <Modal show={this.state.showModal} onHide={this._close} className="moddal">
                    <Modal.Header closeButton>
                        <Modal.Title>Envoie du dessin</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup
                            controlId="formBasicText"
                        >
                            <ControlLabel>Description du dessin</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.props.description}
                                onChange={this._handleChange}
                            />
                        </FormGroup>
                        <div className="text-center">
                            <Button bsStyle="primary" onClick={this._sendDrawing}>Envoyer</Button>
                            <Button bsStyle="danger" onClick={this._close}>Annuler</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default CanvasComponent;