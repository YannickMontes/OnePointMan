const squel = require("squel");
const promise = require('bluebird');
const options = {promiseLib: promise};
const pgp = require('pg-promise')(options);

var express = require('express'); // require Express
var router = express.Router(); // setup usage of the Express router engine

/* PostgreSQL and PostGIS module and connection setup */
var pg = require("pg"); // require Postgres module

var types = pg.types;
types.setTypeParser(1114, function (stringValue) {
    return stringValue;
});

// Setup connection
/*var username = "postgres" ;// sandbox username
var password = "root" ;// read only privileges on our table
var host = "localhost";
var database = "postgres" ;// database name
var database_port = '5433';
var conString = "postgres://"+username+":"+password+"@"+host+':' + database_port +"/"+database; // Your Database Connection*/
var db = {};
var username = "ibczdvtaadgadk";// sandbox username
var password = "3cc134f31e9b48c561177588ca3ab639d9ae83ef1a06efd51fab3bdf3d790c9b";// read only privileges on our table
var host = "ec2-54-163-235-175.compute-1.amazonaws.com";
var database = "d71i59h5089d3k";// database name
var database_port = '5432';
var conString = "postgres://" + username + ":" + password + "@" + host + ':' + database_port + "/" + database + "?ssl=true"; // Your Database Connection

var client = new pg.Client(conString);
client.connect();

const DB = pgp(conString);

DB.query(squel.select()
    .field('NOW()')
    .toString())
    .then(res => {
        console.log('time is : ', res[0].now);
    })
    .catch(e => {
        console.error('query error', e.message, e.stack);
    })
    .catch(err => {
        console.error('Unable to connect to the database', err);
    });

module.exports = DB;