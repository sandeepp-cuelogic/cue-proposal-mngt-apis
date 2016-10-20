const Bluebird = require('bluebird') ;
const mysql = require('mysql');

/*
var socks = require("socks5-client");
const socksConn = socks.createConnection({ socksHost:'172.21.32.16', socksPort: '3306' });
*/

const connection = mysql.createConnection({
	host: 'localhost',
	user     : 'root',
	password : 'root',
	database : 'proposals_mngmt'
});

var conn = Bluebird.promisifyAll(connection) ;

module.exports={conn:conn,users:'users',clients:'clients',proposals :'proposals',countries:'countries',specifications:'specifications'} ;