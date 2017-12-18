'use strict';

var express = require('express');
var router = express.Router();
var axios = require('axios');

var db = require('../connection');
var squelb = require('squel');
var squel = squelb.useFlavour('postgres');

var sender = require('../sender');
var facebookdata = require("../facebookdata");

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource user id :' + facebookdata.userAccessToken);
});

router.post('/updateposition', function (req, res) {

    var toUpdate = {
        iduser: req.body.iduser,
        userlg: req.body.userlg,
        userlt: req.body.userlt
    };

    var getGroups = squel.select().from('public."USER_GROUP"', 'ugr').field('ugr.idgroup').field('ugr.sharesposition').field('ugr.istracking').where('ugr.iduser = ?', parseInt(toUpdate.iduser, 10)).toString();
    db.any(getGroups).then(function (groups) {
        var currentTime = new Date();
        var updateUserTable = squel.update().table('public."USER"').set('lg', toUpdate.userlg).set('lt', toUpdate.userlt).set('dateposition', currentTime.toISOString()).where('iduser = ?', toUpdate.iduser).toString();
        db.none(updateUserTable).then(function () {
            console.log('Updated position of user in USER ');
            console.log(groups);
            groups.forEach(function (element) {
                //pour chaque groupe, s'il décide de partager sa position avec, on update sa position
                if (element.sharesposition === true) {
                    var query = squel.update().table('public."USER_GROUP"').set('userglt', toUpdate.userlt).set('userglg', toUpdate.userlg).set('dateposition', currentTime.toISOString()).where('iduser = ?', toUpdate.iduser).toString();
                    db.none(query).then(function () {
                        console.log('Updated position of user in group ' + element.idgroup);
                    }).catch(function (e) {

                        console.log('failed at updating position in group');
                    });
                }
                if (element.istracking === true) {
                    var inTrack = squel.insert().into('public."TRACK_POS"').set('lt', toUpdate.userlt).set('lg', toUpdate.userlg).set('timepos', currentTime.toISOString()).set('iduser', toUpdate.iduser).set('idgroup', element.idgroup).toString();

                    db.none(inTrack).then(function () {
                        console.log('added position in tracking for group ' + element.idgroup);
                    }).catch(function (e) {
                        console.log('failed at addinf position for tracking' + e);
                    });
                }
            });
        });

        res.send({
            status: 'success',
            message: 'Position updated successfully'
        });
    }).catch(function (e) {
        res.status(400);
        res.send({
            status: 'fail',
            message: e.toString()
        });
    });
});

router.post('/updatepositionsharing/', function (req, res) {

    var toUpdate = {
        iduser: req.body.iduser,
        idgroup: req.body.idgroup,
        positionSharing: req.body.positionSharing
    };

    var query = squel.update().table('public."USER_GROUP"').set('sharesposition', toUpdate.positionSharing).where('iduser = ?', toUpdate.iduser).where('idgroup = ?', toUpdate.idgroup).toString();

    db.query(query).then(function () {
        sender.sendResponse(sender.SUCCESS_STATUS, { status: 'success', message: 'Position sharing updated successfully' }, res);
    }).catch(function (e) {
        sender.sendResponse(sender.BAD_REQUEST, { status: 'fail', message: 'Error while updating position sharing' }, res);
        console.log(e);
    });
});

router.post('/updatemsg', function (req, res) {
    var toUpdate = {
        iduser: req.body.iduser,
        msg: req.body.msg
    };
    console.log(toUpdate);
    var query = squel.update({ replaceSingleQuotes: true, singleQuoteReplacement: '\'\'' }).table('public."USER"').set('msg', toUpdate.msg).where('iduser = ?', toUpdate.iduser).toString();
    console.log(query);
    db.none(query).then(function () {
        sender.sendResponse(sender.SUCCESS_STATUS, { status: 'success', message: 'message updated successfully successfully' }, res);
    }).catch(function (e) {
        sender.sendResponse(sender.BAD_REQUEST, { status: 'fail', message: 'Error while updating message' }, res);
        console.log(e);
    });
    //UPDATE MESSAGE
});

router.get('/getmsg/:iduser', function (req, res) {
    var iduser = req.params.iduser;
    var query = squel.select().from('public."USER"').field('msg').where('iduser = ?', iduser).toString();

    db.one(query).then(function (msg) {
        sender.sendResponse(sender.SUCCESS_STATUS, { status: 'success', message: msg }, res);
    }).catch(function (e) {
        sender.sendResponse(sender.BAD_REQUEST, { status: 'fail', message: 'Error while getting message' }, res);
        console.log(e);
    });
});

router.post('/createuser/', function (req, res) {

    var toCreate = {
        iduser: req.body.iduser,
        idgroup: req.body.idgroup
    };
    var query = squel.insert().into('public."USER_GROUP"').set('iduser', parseInt(toCreate.iduser)).set('idgroup', parseInt(toCreate.idgroup)).toString();

    db.none(query).then(function () {
        sender.sendResponse(sender.SUCCESS_STATUS, { status: 'success', message: 'User ' + toCreate.iduser + ' added to group ' + toCreate.idgroup + ' successfully' }, res);
    }).catch(function (e) {
        sender.sendResponse(sender.BAD_REQUEST, { status: 'fail', message: 'Error while adding user ' + toCreate.iduser + ' to group' }, res);
        console.log(e);
    });
});

router.post('/deleteuser/', function (req, res) {
    console.log(req.body);
    var toUpdate = {
        iduser: req.body.iduser,
        idgroup: req.body.idgroup
    };
    // check si ya 1 personne dans le groupe
    var query = squel.delete().from('public."USER_GROUP"').where('iduser = ?', parseInt(toUpdate.iduser)).where('idgroup = ?', parseInt(toUpdate.idgroup)).toString();
    db.query(query).then(function () {
        var query2 = squel.select().from('public."USER_GROUP"').where('idgroup = ? ', parseInt(toUpdate.idgroup)).toString();
        db.any(query2).then(function (result) {
            if (result.length === 1) {
                //supprimer la derniere personne du groupe
                var deleteLastUser = squel.delete().from('public."USER_GROUP"').where('idgroup = ?', parseInt(toUpdate.idgroup)).toString();
                db.query(deleteLastUser).then(function () {
                    console.log('deleted last user from group successfully');
                    var deleteGroup = squel.delete().from('public."GROUP"').where('idgroup = ?', toUpdate.idgroup).toString();
                    db.query(deleteGroup).then(function () {
                        console.log("group deleted bc no more users");
                    }).catch(function (err) {
                        console.log("failed at deleting empty group" + err);
                    });
                }).catch(function (error) {
                    console.log('failed at deleting last user' + error);
                });
            }
        }).catch(function (e) {
            console.log('Failed at deleting group' + e);
        });
        sender.sendResponse(sender.SUCCESS_STATUS, { status: 'success', message: 'User deleted from group successfully' }, res);
    }).catch(function (e) {
        sender.sendResponse(sender.BAD_REQUEST, { status: 'success', message: 'Error while deleting user from group' }, res);
        console.log(e);
    });
});

router.get('/userFriends/:user_id/', function (req, res) {
    console.log("GET /userFriends/:user_id/");

    var user_id = req.params.user_id;
    var userFriendList = {
        friendlist: []
    };

    _getUserFriendList(user_id).then(function (response) {
        userFriendList.friendlist = response.data.data;

        console.log('userAccessToken : ' + facebookdata.userAccessToken);

        console.log('userFriendList : ' + userFriendList);

        sender.sendResponse(sender.SUCCESS_STATUS, userFriendList, res);
    }).catch(function (error) {
        console.log(error);
    });
});

var _getUserFriendList = function _getUserFriendList(user_id) {
    var userFriendListRequest = {
        redirectURI: 'https://graph.facebook.com/v2.11/',
        userAccessToken: facebookdata.userAccessToken,
        userID: user_id
    };

    return axios.get(userFriendListRequest.redirectURI + userFriendListRequest.userID + '/friends?access_token=' + userFriendListRequest.userAccessToken);
};

module.exports = router;
//# sourceMappingURL=users.js.map