'use strict';

var express = require('express');
var router = express.Router();

var _sendResponse = function _sendResponse(status, message, res) {
    res.status(status);
    res.send(message);
};

var sender = {
    SUCCESS_STATUS: 200,
    REDIRECT_STATUS: 304,
    NOT_FOUND_STATUS: 404,
    BAD_REQUEST: 400,
    sendResponse: _sendResponse
};

module.exports = sender;
//# sourceMappingURL=sender.js.map