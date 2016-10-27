const Bluebird = require('bluebird') ;
const mysql = require('mysql');
var dotenv = require('dotenv');
dotenv.load();
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user     : process.env.DB_USER,
	password : process.env.DB_PASSWORD,
	database : process.env.DB_NAME
});

var conn = Bluebird.promisifyAll(connection) ;
module.exports={conn:conn,users:'users',clients:'clients',proposals :'proposals',countries:'countries',specifications:'specifications'} ;