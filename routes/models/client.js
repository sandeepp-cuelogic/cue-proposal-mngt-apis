var md5= require('md5') ;
var DB = require('../config.js') ;
var Promise = require('bluebird');

module.exports.clients = function(req,res) {
      res("This is client listing") ;
}