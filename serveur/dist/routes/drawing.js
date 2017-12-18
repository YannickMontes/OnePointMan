'use strict';

var express = require('express');
var router = express.Router();
var db = require('../connection');
var squelb = require('squel');
var squel = squelb.useFlavour('postgres');
var sender = require('../sender');

router.get('/', function (req, res, next) {});

router.post('/createdrawing', function (req, res) {
    console.log("YOOOOOOOOOOOO");
    var toCreate = {
        idcreator: req.body.iduser,
        idgroup: req.body.idgroup,
        description: req.body.description,
        zoom: req.body.zoom,
        nelt: req.body.nelt,
        nelg: req.body.nelg,
        swlt: req.body.swlt,
        swlg: req.body.swlg,
        img: req.body.img
    };

    console.log(toCreate.img.toString());
    /*let query = squel.insert()
        .into('public."DRAWING"')
        .set('idcreator', toCreate.idcreator)
        .set('idgroup', toCreate.idgroup)
        .set('zoom', toCreate.zoom)
        .set('description', toCreate.description)
        .set('drawinglt', toCreate.lt)
        .set('drawinglg', toCreate.lg)
        .set('img', toCreate.img)
        .returning('iddrawing')
        .toString();*/

    var query = 'INSERT INTO public."DRAWING" (idcreator, idgroup, zoom, description, nelt, nelg, swlt, swlg, img)' + ' VALUES(' + toCreate.idcreator + ',' + toCreate.idgroup + ',' + toCreate.zoom + ',\'' + toCreate.description + '\',' + toCreate.nelt + ',' + toCreate.nelg + ',' + toCreate.swlt + ',' + toCreate.swlg + ', decode(\'' + toCreate.img + '\', \'base64\')) RETURNING iddrawing';

    console.log("query " + query);
    db.one(query).then(function (row) {
        var response = {
            status: 'success',
            iddrawing: row.iddrawing
        };
        sender.sendResponse(sender.SUCCESS_STATUS, response, res);
    }).catch(function (e) {
        console.log(e);
        sender.sendResponse(sender.BAD_REQUEST, { status: 'fail', message: 'Error while creating drawing' }, res);
    });
});

//Ce serait peut etre mieux de le supprimer carrément? plutôt que de le set inactif
router.post('/deletedrawing', function (req, res) {
    var toDelete = {
        iddrawing: req.body.iddrawing
    };

    var query = squel.update().table('public."DRAWING"').set('actif', false).where('iddrawing = ?', toDelete.iddrawing).toString();
    db.none(query).then(function () {
        var response = {
            status: 'success',
            message: 'Drawing deleted successfully'
        };
        sender.sendResponse(sender.SUCCESS_STATUS, response, res);
    }).catch(function (e) {
        sender.sendResponse(sender.BAD_REQUEST, { status: 'fail', message: 'Error while deleting drawing' }, res);
        console.log(e);
    });
});

module.exports = router;
//# sourceMappingURL=drawing.js.map