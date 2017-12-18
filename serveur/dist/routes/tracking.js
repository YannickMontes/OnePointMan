'use strict';

var express = require('express');
var router = express.Router();
var db = require('../connection');
var squelb = require('squel');
var squel = squelb.useFlavour('postgres');

var sender = require('../sender');

router.get('/', function (req, res, next) {});

router.post('/settracking', function (req, res) {
    var toUpdate = {
        iduser: req.body.iduser,
        idgroup: req.body.idgroup,
        tracking: req.body.tracking
    };

    if (toUpdate.tracking) {
        //on supprime tous les tuples de iduser,idgroup

        var deleteRows = squel.delete().from('public."TRACK_POS"').where('iduser = ?', parseInt(toUpdate.iduser)).where('idgroup = ?', parseInt(toUpdate.idgroup)).toString();

        db.query(deleteRows).then(function () {
            console.log('Deleted rows from "TRACK_POS" successfully');
        }).catch(function (err) {
            console.log('Failed at deleting rows ' + err);
        });
    }

    var query = squel.update().table('public."USER_GROUP"').set('istracking', toUpdate.tracking).where('iduser = ?', toUpdate.iduser).where('idgroup = ?', toUpdate.idgroup).toString();
    console.log(query);
    db.none(query).then(function () {
        sender.sendResponse(sender.SUCCESS_STATUS, { status: 'success', message: 'istracking updated successfully' }, res);
    }).catch(function (e) {
        sender.sendResponse(sender.BAD_REQUEST, { status: 'fail', message: 'Error while updating tracking state' }, res);
        console.log(e);
    });
});

router.post('/deletetracking', function (req, res) {
    var toDelete = {
        iduser: req.body.iduser,
        idgroup: req.body.idgroup
    };

    var deleting = squel.delete().from('public."TRACK_POS"').where('iduser = ?', toDelete.iduser).where('idgroup = ?', toDelete.idgroup).toString();
    db.query(deleting).then(function () {
        sender.sendResponse(sender.SUCCESS_STATUS, { status: 'success', message: 'Tracking deleted successfully' }, res);
    }).catch(function (e) {
        sender.sendResponse(sender.BAD_REQUEST, { status: 'fail', message: 'Error while updating tracking state' }, res);
        console.log(e);
    });
});

module.exports = router;
//# sourceMappingURL=tracking.js.map