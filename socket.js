const express = require('express');
const socket = require('http').Server(express);
const io = require('socket.io')(socket);

const mapSocketUser = new Map();
const ADD_GROUP_NOTIFICATION_TYPE = 'ADDED_TO_GROUP';
const REMOVE_GROUP_NOTIFICATION_TYPE = 'REMOVED_FROM_GROUP';

socket.listen(3002);

io.on('connection', function (clientSocket) {

    console.log('Client connecté avec id ' + clientSocket.id);

    clientSocket.emit('Notification', 'Bienvenue sur OnepointMan !');

    clientSocket.on('mapUserID', function (data) {
        console.log('Socket id : ' + socket.id);
        console.log('Received user id : ' + data["userId"]);

        mapSocketUser.set(data["userId"], clientSocket);

        mapSocketUser.forEach(function (userid, socketid) {
            console.log(userid + " = " + socketid);
        });
    });

    clientSocket.on('disconnect', function (clientSocket) {
        console.log('Got disconnect!');

        mapSocketUser.delete(mapSocketUser.get(clientSocket.id));
    });
});

io.on('disconnect', function (clientSocket) {
    console.log('Got disconnect!');

    mapSocketUser.delete(mapSocketUser.get(clientSocket.id));
});

const sendNotification = (notificationType, userIdToNotif, ...data) => {

    let clientSocket = mapSocketUser.get(userIdToNotif);

    //For group notifType => data[0] = groupName
    switch (notificationType) {
        case ADD_GROUP_NOTIFICATION_TYPE :
            clientSocket.emit('userAdded Notification', {message: 'Ajouté au groupe ' + data[0] + ' !'});
            break;
        case REMOVE_GROUP_NOTIFICATION_TYPE :
            clientSocket.emit('userDeleted Notification', {message: 'Retiré du groupe ' + data[0] + ' !'});
            break;
        default :
            console.log('Unknow notificationType ' + notificationType + '. No notification sent');
            break;
    }
};


socket.mapSocketUser = mapSocketUser;
socket.sendNotification = sendNotification;
socket.ADD_GROUP_NOTIFICATION_TYPE = ADD_GROUP_NOTIFICATION_TYPE;
socket.REMOVE_GROUP_NOTIFICATION_TYPE = REMOVE_GROUP_NOTIFICATION_TYPE;

module.exports = socket;