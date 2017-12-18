const axios = require('axios');
const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const facebookdata = require("../facebookdata");

const db = require('../connection');
const squelb = require('squel');
const sender = require("../sender");
const squel = squelb.useFlavour('postgres');

const _sendResponse = (status, message, res) => {
    res.status(status);
    res.send(message);
};

const _getUserAccessToken = (str) => {
    let requestToken = {
        redirectURI: 'https://graph.facebook.com/v2.11/oauth/access_token?',
        client_id: '137357800216709',
        redirect_uri: 'http://localhost:3000/handleauth',
        client_secret: '8120bf1c2ce2729a20d024a8c491c9b5',
        code: str.code
    };

    return axios.get(requestToken.redirectURI + 'client_id=' + requestToken.client_id + '&redirect_uri=' + requestToken.redirect_uri
        + '&client_secret=' + requestToken.client_secret + '&code=' + requestToken.code)
};

const _getAppAccessToken = () => {

    const apiAppRequest = {
        requestAPI: 'https://graph.facebook.com/oauth/access_token?',
        client_id: '137357800216709',
        client_secret: '8120bf1c2ce2729a20d024a8c491c9b5',
        grant_type: 'client_credentials'
    };

    return axios.get(apiAppRequest.requestAPI + 'client_id=' + apiAppRequest.client_id + '&client_secret='
        + apiAppRequest.client_secret + '&grant_type=' + apiAppRequest.grant_type)
};

const _inspectUserToken = () => {
    let inspectTokenRequest = {
        redirectURI: 'https://graph.facebook.com/debug_token?',
        input_token: facebookdata.userAccessToken,
        access_token: facebookdata.appAccessToken
    };

    return axios.get(inspectTokenRequest.redirectURI + 'input_token=' + inspectTokenRequest.input_token + '&access_token=' + inspectTokenRequest.access_token)
};

const _checkIfUserExists = (user_id) => {
    return db.query(squel
        .select()
        .from('"USER"')
        .where('iduser = ?', user_id)
        .toString())
};

const _insertNewUser = (user_id, userlastname, userfirstname) => {
    return db.query(squel
        .insert()
        .into('"USER"')
        .set('iduser', user_id)
        .set('nom', userlastname)
        .set('prenom', userfirstname)
        .toString())
};

const _getUserDataFromFb = (user_id) => {
    let userData = {
        uri: 'https://graph.facebook.com/v2.11/',
        user_id: user_id,
        access_token: facebookdata.userAccessToken
    };

    return axios.get(userData.uri + userData.user_id + '?access_token=' + userData.access_token + '&fields=id,last_name,first_name,gender,picture');
};

const _bindLoggedUserData = (responseFromfb) => {
    loggedUser.prenom = responseFromfb.first_name;
    loggedUser.nom = responseFromfb.last_name;
    loggedUser.photo = responseFromfb.picture;
    loggedUser.iduser = facebookdata.userFbId
};

const _updateDataAfterAuth = (user_id) => {
    //TODO: set is logged = true
    return db.query(squel
        .update()
        .table('"USER"')
        .set('lastconnexion', 'now()')
        .where('iduser = ?', user_id)
        .toString())
};

let loggedUser = {
    nom: '',
    prenom: '',
    iduser: '',
    photo: ''
};

router.get('/', function (req, res, next) {
    console.log("GET /fblogin");

    let facebookURI = {
        redirectURI: 'https://www.facebook.com/v2.11/dialog/oauth?',
        client_id: '137357800216709',
        redirect_uri: 'http://localhost:3000/handleauth',
        scope: 'email,user_friends'
    };

    _sendResponse(sender.SUCCESS_STATUS, facebookURI, res)

    console.log("end GET /fblogin");
});

router.get('/handleauth', function (req, res, next) {
    console.log("GET /fblogin/handleauth");

    let str = querystring.parse(req.originalUrl.substring(req.originalUrl.indexOf("?") + 1, req.originalUrl.length));

    console.log('STR VALUE :' + str.code);

    _getUserAccessToken(str)
        .then(response => {

            facebookdata.userAccessToken = response.data.access_token;

            _getAppAccessToken()
                .then(response => {

                    facebookdata.appAccessToken = response.data.access_token;

                    _inspectUserToken()
                        .then(response => {
                            facebookdata.userFbId = response.data.data.user_id;

                            _getUserDataFromFb(facebookdata.userFbId)
                                .then(response => {
                                    _bindLoggedUserData(response.data);
                                })
                                .catch(error => {
                                    console.log(error);
                                });

                            _checkIfUserExists(facebookdata.userFbId)
                                .then(existingUser => {

                                    if (existingUser.length === 0) {
                                        console.log('User does not exist. Creating user with facebook ID : ' + facebookdata.userFbId);

                                        _insertNewUser(facebookdata.userFbId, loggedUser.nom, loggedUser.prenom);
                                    } else {
                                        console.log('User with ID : ' + facebookdata.userFbId + 'already exists in database');
                                    }

                                    _updateDataAfterAuth(facebookdata.userFbId)
                                        .then(() => {})
                                        .catch(error => {
                                            console.log(error);
                                        });
                                    ;

                                    _sendResponse(sender.SUCCESS_STATUS, loggedUser, res);
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log(error)
                });
        })
        .catch(error => {
            console.log(error)
        });

    console.log("end GET /fblogin/handleauth");
});

router.post('/authAndroid', function (req, res) {

    facebookdata.userAccessToken = req.body.token;
    facebookdata.userFbId = req.body.userId;

    _getAppAccessToken()
        .then(response => {

            facebookdata.appAccessToken = response.data.access_token;

            _getUserDataFromFb(facebookdata.userFbId)
                .then(response => {
                    _bindLoggedUserData(response.data);

                    _checkIfUserExists(facebookdata.userFbId)
                        .then(existingUser => {

                            if (existingUser.length === 0) {
                                console.log('User does not exist. Creating user with facebook ID : ' + facebookdata.userFbId);

                                _insertNewUser(facebookdata.userFbId, loggedUser.nom, loggedUser.prenom);

                                _sendResponse(sender.SUCCESS_STATUS, loggedUser, res);
                            } else {
                                console.log('User with ID : ' + facebookdata.userFbId + 'already exists in database');

                                _sendResponse(sender.SUCCESS_STATUS, loggedUser, res);
                            }
                        })
                        .catch(error => {
                            console.log(error);

                            _sendResponse(sender.BAD_REQUEST, 'error while getting existing user', res);
                        });
                })
                .catch(error => {
                    console.log(error);

                    _sendResponse(sender.BAD_REQUEST, 'error while binding user data', res);
                });
        })
        .catch(e => {
            console.log('Android auth error ' + e);

            _sendResponse(sender.BAD_REQUEST, 'error while getting app token', res);
        })
});

module.exports = router;