const express = require('express');
const router = express.Router();
const db = require('../connection');
const squelb = require('squel');
const squel = squelb.useFlavour('postgres');

const sender = require('../sender');


router.get('/', function(req, res, next) {

});

router.post('/settracking', function(req,res){
    let toUpdate = {
        iduser: req.body.iduser,
        idgroup: req.body.idgroup,
        tracking: req.body.tracking
    };

    if(toUpdate.tracking){
        //on supprime tous les tuples de iduser,idgroup

        let deleteRows = squel.delete()
            .from('public."TRACK_POS"')
            .where('iduser = ?', parseInt(toUpdate.iduser))
            .where('idgroup = ?', parseInt(toUpdate.idgroup))
            .toString();

        db.query(deleteRows)
            .then(()=>{
                console.log('Deleted rows from "TRACK_POS" successfully');
            })
            .catch(err => {
                console.log('Failed at deleting rows ' + err);
            })
    }

    let query = squel.update()
        .table('public."USER_GROUP"')
        .set('istracking', toUpdate.tracking)
        .where('iduser = ?', toUpdate.iduser)
        .where('idgroup = ?', toUpdate.idgroup)
        .toString();
    console.log(query);
    db.none(query)
        .then(()=>{
            sender.sendResponse(sender.SUCCESS_STATUS, {status:'success',message:'istracking updated successfully'}, res)
        })
        .catch(e => {
            sender.sendResponse(sender.BAD_REQUEST, {status:'fail', message:'Error while updating tracking state'}, res);
            console.log(e);
        })

});

router.post('/deletetracking', function(req,res){
   let toDelete = {
       iduser: req.body.iduser,
       idgroup: req.body.idgroup
   }

   let deleting=squel.delete()
       .from('public."TRACK_POS"')
       .where('iduser = ?', toDelete.iduser)
       .where('idgroup = ?', toDelete.idgroup)
       .toString();
   db.query(deleting)
       .then(()=>{
           sender.sendResponse(sender.SUCCESS_STATUS, {status:'success',message:'Tracking deleted successfully'}, res)

       })
       .catch(e => {
           sender.sendResponse(sender.BAD_REQUEST, {status:'fail', message:'Error while updating tracking state'}, res);
           console.log(e);
       })

});


module.exports = router;
