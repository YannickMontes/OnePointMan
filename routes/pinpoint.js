const express = require('express');
const router = express.Router();
const db = require('../connection');
const squelb = require('squel');
const squel = squelb.useFlavour('postgres');

const sender = require('../sender');

router.post('/createpinpoint/', function (req, res) {

    let toCreate = {
        iduser: req.body.iduser,
        idgroup: req.body.idgroup,
        pinlg: req.body.pinlg,
        pinlt: req.body.pinlt,
        description: req.body.description,
        daterdv: req.body.daterdv,
    };

    let daterdv = new Date(toCreate.daterdv);
    daterdv.setDate(daterdv.getDate());
    let dateexpiration = new Date(toCreate.daterdv);
    dateexpiration.setDate(dateexpiration.getDate() + 1);

    let query = squel.insert()
        .into('public."PINPOINT"')
        .set('idcreator', parseInt(toCreate.iduser, 10))
        .set('idgroup', parseInt(toCreate.idgroup, 10))
        .set('pinlt', toCreate.pinlt, 10)
        .set('pinlg', toCreate.pinlg, 10)
        .set('description', toCreate.description)
        .set('daterdv', daterdv.toISOString())
        .set('dateexpiration', dateexpiration.toISOString())
        .returning('idpinpoint')
        .toString();

    db.one(query)
        .then((row) => {
            let response = {
                idpinpoint: row.idpinpoint
            };
            sender.sendResponse(sender.SUCCESS_STATUS, response, res)
        })
        .catch(e => {
            console.log(e);
            sender.sendResponse(sender.BAD_REQUEST, {status: 'fail', message: 'Error while creating pinpoint'}, res);
        })
});

router.post('/deletepinpoint/', function (req, res) {

    let toDelete = {
        iduser: req.body.iduser,
        idgroup: req.body.idgroup,
        idpinpoint: req.body.idpinpoint,
    };

    let query = squel.delete()
        .from('public."PINPOINT"')
        //.where('idcreator = ?', parseInt(toDelete.iduser)) C mieux que nimporte qui puisse supprimer
        .where('idgroup = ?', parseInt(toDelete.idgroup))
        .where('idpinpoint = ?', parseInt(toDelete.idpinpoint))
        .toString();

    db.query(query)
        .then(() => {
            sender.sendResponse(sender.SUCCESS_STATUS, {status: 'success', message: 'Pinpoint deleted'}, res)
        })
        .catch(e => {
            console.log(e);
            sender.sendResponse(sender.BAD_REQUEST, {status: 'fail', message: 'Error while deleting pinpoint'}, res);
        })

});

module.exports = router;
