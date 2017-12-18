import React, {Component} from 'react';
import {Button, Grid, PageHeader, Row} from 'react-bootstrap';
import '../style/Login.css';
import '../style/Shake.css';

class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this._handleLogin = this._handleLogin.bind(this);
    }

    _handleLogin() {
        this.props.login();
    }

    render() {
        return (
            <Grid className="loginPage">
                <Row className="show-grid">
                    <PageHeader className="text-center">OnePointMan <i className="material-icons marker" style={{fontSize:"48px;color:red"}}>place</i></PageHeader>
                </Row>
                <Row className="show-grid text-center">
                        <Button bsSize="large" onClick={this._handleLogin} className="shake shake-slow">Login</Button>
                </Row>
            </Grid>
        )
    }
}

export default  LoginComponent;
