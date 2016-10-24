var md5= require('md5') ;
var DB = require('../config.js') ;
var random = require('../../libs/random.js') ;

module.exports.clients = function(req,res) {
      DB.conn.queryAsync("SELECT * FROM "+DB.clients).then(function(clients) {
           res(clients) ;
      });
}

module.exports.add = function(req,res) {
      var client = req.payload ;
      client.created = new Date();
      client.logo_file_name = random.generate(15);
      DB.conn.queryAsync("SELECT id FROM "+DB.clients+ ' where name = "' + client.name+'"').then(function(response) {
            if(!response.length){
                  DB.conn.queryAsync("INSERT INTO "+DB.clients+ ' SET ?' , client).then(function(result) {
                       if(result.insertId > 0) {
                              res({"statusCode":200, "message": "Client added successfully!"});
                       }
                       else
                       {
                              res({"statusCode":500,"message":"Error in adding client"});
                       }
                  });
            }
            res({"statusCode":409,"message":"Client "+client.name +" already exist" });          
      });
}