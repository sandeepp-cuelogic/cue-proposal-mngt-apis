'use strict';
var hapi = require('hapi'), server = new hapi.Server();
global.jwt = require('jsonwebtoken') ; 
global.jwt_secret = 'vbbbcvv765656hvhdgAdsFBEDstdsds6725764'; 
//Changing this secret will reset all token to false
server.connection({ port: 8000 ,routes: {cors: true }});

var validate = function (request, decoded, callback) {
    var error;
    if (!decoded.id) {
        return callback(error, false, {});
    }
    request.user = decoded ;
    return callback(error, true, decoded);
} ;

server.register(require('hapi-auth-jwt'), function(err) {

    if (err) { throw err; }

    server.auth.strategy('token', 'jwt', {
        key: jwt_secret,
        validateFunc: validate,
        verifyOptions: { algorithms: [ 'HS256' ] }  // only allow HS256 algorithm
    });

    server.auth.default('token') ;
        
    //server.ext('onRequest', onRequest) ;

    server.route(require('./routes')) ;
    server.start(function(err) {
        if (err) {
            throw err;
        }
        console.log('Web server is listening to http://localhost:8000');
    });

});
