'use strict';

var express = require('express');
var router = express.Router();
var db = require('../connection');
var squelb = require('squel');
var squel = squelb.useFlavour('postgres');

var sender = require('../sender');

//donne les groupes auxquels appartient un utilisateur + les membres du groupe
router.get('/:iduser/', function (req, res) {
    var iduser = req.params.iduser;
    var groups = getUsersInGroups(iduser);
    db.any(groups).then(function (tableau) {
        var toReturn = buildGroupsObject(tableau);
        res.send({
            status: 'success',
            message: toReturn
        });
        //sender.sendResponse(sender.SUCCESS_STATUS, toReturn, res);
    }).catch(function (e) {
        res.status(400);
        res.send({
            status: 'fail',
            message: e.toString()
        });
        //sender.sendResponse(sender.BAD_REQUEST, toReturn, res);
    });
});

router.get('/getGroupInfo/:idgroupe', function (req, res) {
    console.log('GET getGroupInfo/idgroupe');

    var idgroupe = req.params.idgroupe;
    var groupData = {
        listeMembres: []
    };

    getUserDataFromGroup(idgroupe).then(function (result) {

        result.forEach(function (member) {
            var groupMember = {
                nom: '',
                prenom: '',
                iduser: ''
            };

            groupMember.nom = member.nom;
            groupMember.prenom = member.prenom;
            groupMember.iduser = member.iduser;

            groupData.listeMembres.push(groupMember);
        });

        sender.sendResponse(sender.SUCCESS_STATUS, groupData, res);
    }).catch(function (e) {
        console.log(e);
        sender.sendResponse(sender.BAD_REQUEST, e.toString(), res);
    });

    console.log('END GET getGroupInfo/idgroupe');
});

var getUserDataFromGroup = function getUserDataFromGroup(idGroup) {
    return db.query(squel.select().from('"USER_GROUP"', 'ug').field('nom').field('prenom').field('u.iduser').where('idgroup = ? ', idGroup).left_join('"USER"', 'u', 'u.iduser = ug.iduser').toString());
};

var getGroups = function getGroups(iduser) {
    return squel.select().from('public."USER_GROUP"', 'ugr').field('ugr.idgroup').field('gr.nom').field('ugr.sharesposition').field('ugr.istracking').where('ugr.iduser = ?', iduser).left_join('public."GROUP"', 'gr', 'ugr.idgroup = gr.idgroup');
};

var getUsersInGroups = function getUsersInGroups(iduser) {
    return squel.select().from(getGroups(iduser), 'listgroups').left_join('public."USER_GROUP"', 'ugr', 'ugr.idgroup = listgroups.idgroup').left_join('public."USER"', 'usr', 'usr.iduser = ugr.iduser').field('listgroups.sharesposition').field('listgroups.istracking').field('usr.prenom').field('usr.nom', 'nomuser').field('usr.iduser').field('listgroups.nom', 'nomgroup').field('ugr.idgroup').toString();
};

function buildGroupsObject(queryResult) {
    var groups = [];
    queryResult.forEach(function (element, index) {
        // le resultat de la requete donne un tableau de {prenom, nomuser, iduser, nomgroup, idgroup}
        var contains = false;
        var idPosition = void 0;
        // si l'id du groupe n'existe pas encore dans le tableau, on le push et on crée un ligne pour le groupe
        groups.forEach(function (grelement) {
            if (element.idgroup === grelement.idgroup) {
                contains = true;
                idPosition = index;
            }
        });
        if (!contains) {
            groups.push({
                idgroup: element.idgroup,
                issharing: element.sharesposition,
                istracking: element.istracking,
                nomgroup: element.nomgroup,
                membres: []
            });
        }
    });
    //une fois le tableau des groupes créé, on push les membres dans groups[idGroupConcerné].membres
    queryResult.forEach(function (element) {
        var idGroupeConcerne = void 0;
        //on get la position dans groups du groupe concerné pour l'user (element)
        groups.forEach(function (grelement, grindex) {
            if (grelement.idgroup === element.idgroup) {
                idGroupeConcerne = grindex;
                groups[idGroupeConcerne].membres.push({
                    iduser: element.iduser,
                    prenom: element.prenom,
                    nomuser: element.nomuser
                });
            }
        });
    });
    return groups;
}

// https://stackoverflow.com/questions/16767301/calculate-difference-between-2-timestamps-using-javascript
// Pour check les daaaates hehehe


//SSSSIIII l'utilisateur partage sa position avec le groupe , ne pas l'envoyer
// +++ ne pas envoyer les user si leur position est nulle


// les infos d'un groupe en particulier (les pinpoints et les positions des utilisateurs du groupe
router.get('/positions/:iduser/:idgroup', function (req, res) {
    //vérifier si l'utilisateur est bien dans le groupe avant de faire le traitement
    var iduser = parseInt(req.params.iduser, 10);
    var idgroup = req.params.idgroup;
    //pour le groupe : renvoyer son nom, les pinpoints qui lui sont associés, les dessins,
    // les positions des gens SSI ils décident de la partager avec ce groupe
    var requete = getGroupPinpoints(idgroup);
    db.any(requete).then(function (result) {
        var JSONToReturn = { idgroup: idgroup, issharing: false, pinpoints: [], userpositions: [], trackings: [] };
        result.forEach(function (element) {

            // CHECK SI LA DATE est supérieure de 1 jour de plus de la date de RDV. sinon ne
            var currentTime = new Date();
            var diff = currentTime - element.daterdv; // donne la diff en millisecondes
            var dontPush = false;
            if (diff > 8.64e+7) {
                // le nombre de millisecs en 1 jour hehe
                dontPush = true;
            }
            console.log(diff);
            //pas renvoyer
            var pinpoint = {
                idpinpoint: element.idpinpoint,
                idcreator: element.idcreator,
                nomcreator: element.nom,
                prenomcreator: element.prenom,
                pinlt: element.pinlt,
                pinlg: element.pinlg,
                description: element.description,
                daterdv: element.daterdv
            };
            //si la date est ok on le push dans l'array
            if (!dontPush) {
                JSONToReturn.pinpoints.push(pinpoint);
            }
        });
        db.any(getUsersPositions(idgroup)).then(function (userpositions) {

            var currentDate = new Date();
            var userCorrectRequest = false;
            userpositions.forEach(function (element) {

                if (parseInt(element.iduser, 10) === iduser) {
                    userCorrectRequest = true; // on vérifie ici si le gars qui demande est bien dans le groupe
                    JSONToReturn.issharing = element.sharesposition;
                }
                var isCurrent = false;
                if (element.dateposition !== null) {
                    isCurrent = compareTimes(currentDate, element.dateposition);
                }

                var userposition = {
                    iduser: element.iduser,
                    prenom: element.prenom,
                    nom: element.nom,
                    userlt: element.userglt,
                    userlg: element.userglg,
                    msg: element.msg,
                    current: isCurrent,
                    dateposition: element.dateposition
                };
                if (element.dateposition !== null) {
                    if (!(parseInt(element.iduser, 10) === iduser && element.sharesposition)) {
                        JSONToReturn.userpositions.push(userposition);
                    }
                }
            });
            //ici on build le tableau des tracking
            getTrackings(idgroup).then(function (result) {
                var tracking = buildTrackingArray(result);
                JSONToReturn.trackings = tracking;
                if (userCorrectRequest) {
                    res.send({
                        status: 'success',
                        message: JSONToReturn
                    });
                } else {
                    res.status(400);
                    res.send({
                        status: 'fail',
                        message: 'You requested the informations of a group in which you DON\'T belong'
                    });
                }
            }).catch(function (error) {
                res.status(400);
                res.send({
                    status: 'fail',
                    message: 'failed at getting trackings from group' + err.toString()
                });
                console.log('Failed at getting trackings from group ' + idgroup + error);
            });
        }).catch(function (err) {
            res.status(400);
            res.send({
                status: 'fail',
                message: err.toString()
            });
        });
    }).catch(function (e) {
        res.status(400);
        res.send({
            status: 'fail',
            message: e.toString()
        });
    });
});
var getTrackings = function getTrackings(idgroup) {
    return db.query(squel.select().field('lt', 'lat').field('lg', 'lng').field('timepos').field('iduser').from('public."TRACK_POS"').where('idgroup = ?', idgroup).order('iduser').order('timepos').toString());
};

function buildTrackingArray(array) {
    var toReturn = [];
    array.forEach(function (element) {
        var containsIdUser = false;
        var indexInReturn = void 0;
        //  let objToPush = {iduser: , tracking:[]};
        //Pour chaque element, si l'iduser existe deja ds le tableau on le push pas mais on push sa position dans son tableau
        toReturn.forEach(function (newEl, index) {
            if (parseInt(newEl.iduser) === parseInt(element.iduser)) {
                containsIdUser = true;
                indexInReturn = index;
            }
        });
        if (containsIdUser) {
            toReturn[indexInReturn].tracking.push({ lt: element.lt, lg: element.lg });
        } else {
            toReturn.push({ iduser: parseInt(element.iduser), tracking: [{ lt: element.lt, lg: element.lg }] });
        }
    });
    return toReturn;
}

var getGroupPinpoints = function getGroupPinpoints(idgroup) {
    return squel.select().from('public."GROUP"', 'gr').field('gr.nom', 'nomgroup').field('gr.idgroup').field('pin.idcreator').field('pin.idpinpoint').field('pin.pinlt').field('pin.pinlg').field('pin.description').field('pin.daterdv').field('usr.prenom').field('usr.nom').left_join('public."PINPOINT"', 'pin', 'pin.idgroup = gr.idgroup').left_join('public."USER"', 'usr', 'usr.iduser = pin.idcreator').where('gr.idgroup = ?', idgroup).toString();
};

var getUsersPositions = function getUsersPositions(idgroup) {
    return squel.select().from('public."GROUP"', 'gr').field('ugr.iduser').field('ugr.sharesposition').field('ugr.userglt').field('ugr.userglg').field('usr.msg').field("ugr.dateposition").field('usr.nom').field('usr.prenom').left_join('public."USER_GROUP"', 'ugr', 'ugr.idgroup = gr.idgroup').left_join('public."USER"', 'usr', 'usr.iduser = ugr.iduser').where('gr.idgroup = ?', idgroup).toString();
};

//Si la dernière position stockée est > 15min, l'utilisateur est considéré comme inactif
function compareTimes(currentTime, lastLocationTime) {
    var difference = currentTime - lastLocationTime;
    var toReturn = false;
    console.log(difference);
    if (difference < 900000) {
        toReturn = true;
    }
    return toReturn;
}

router.get('/drawings/:iduser/:idgroup', function (req, res) {
    var iduser = req.params.iduser;
    var idgroup = req.params.idgroup;
    var query = getDrawings(idgroup);
    var JSONToReturn = {
        idgroup: idgroup,
        drawings: []
    };

    db.any(query).then(function (result) {
        result.forEach(function (element) {
            var objectToPush = {
                iddrawing: element.iddrawing,
                idcreator: element.idcreator,
                nomcreator: element.nom,
                prenomcreator: element.prenom,
                description: element.description,
                lt: element.lt,
                lg: element.lg,
                zoom: element.zoom,
                nelt: element.nelt,
                nelg: element.nelg,
                swlt: element.swlt,
                swlg: element.swlg,
                img: element.img
            };
            if (element.actif) {
                JSONToReturn.drawings.push(objectToPush);
            }
        });
        res.send({
            status: 'success',
            message: JSONToReturn
        });
    }).catch(function (e) {
        console.log(e);
        res.status(400);
        res.send({
            status: 'fail',
            message: e.toString()
        });
    });
});

var getDrawings = function getDrawings(idgroup) {
    return squel.select().from('public."DRAWING"', 'draw').field('draw.iddrawing').field('draw.idcreator').field('draw.actif').field("encode(draw.img, 'base64')", 'img').field('draw.nelg').field('draw.nelt').field('draw.swlt').field('draw.swlg').field('draw.zoom').field('description').field('usr.nom').field('usr.prenom').left_join('public."USER"', 'usr', 'usr.iduser = draw.idcreator').where('draw.idgroup = ?', idgroup).toString();
};

//ca passe en post
router.post('/creategroup', function (req, res) {

    var toCreate = {
        iduser: req.body.iduser,
        groupname: req.body.groupname
    };

    var currentTime = new Date();
    var query = squel.insert({ replaceSingleQuotes: true, singleQuoteReplacement: '\'\'' }).into('public."GROUP"').set('nom', toCreate.groupname).set('creationdate', currentTime.toISOString()).returning('idgroup').toString();

    db.one(query).then(function (row) {
        var inUserGroup = squel.insert().into('public."USER_GROUP"', 'ugr').set('idgroup', row.idgroup).set('iduser', toCreate.iduser).set('iscreator', true).toString();
        db.none(inUserGroup).then(function () {
            var response = {
                idgroup: row.idgroup
            };
            sender.sendResponse(sender.SUCCESS_STATUS, response, res);
        }).catch(function (err) {
            sender.sendResponse(sender.BAD_REQUEST, 'Failed to insert user in USER_GROUP', res);
            console.log(err);
        });
    }).catch(function (e) {
        sender.sendResponse(sender.BAD_REQUEST, 'Failed to create group', res);
        console.log(e);
    });
});

router.post('/changegroupname', function (req, res) {
    var toChange = {
        idgroup: req.body.idgroup,
        groupname: req.body.newgroupname
    };

    var query = squel.update({ replaceSingleQuotes: true, singleQuoteReplacement: '\'\'' }).table('public."GROUP"').set('nom', toChange.groupname).where('idgroup = ?', toChange.idgroup).toString();
    db.none(query).then(function () {
        var response = { status: 'success', message: 'groupname updated successfully' };
        sender.sendResponse(sender.SUCCESS_STATUS, response, res);
    }).catch(function (e) {
        sender.sendResponse(sender.BAD_REQUEST, { status: 'fail', message: 'Failed to update groupname' }, res);
        console.log(e);
    });
});

module.exports = router;
//# sourceMappingURL=groups.js.map