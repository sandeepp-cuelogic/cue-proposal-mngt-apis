var md5= require('md5') ;
var DB = require('../config.js') ;
var Boom =  require('boom');
//Signup

module.exports.signup = function(req,res) {
	var user = req.payload ;
	DB.conn.queryAsync('SELECT * FROM '+DB.users+' where email = "'+user.email+'"').then(function(rows) {
      	if(rows.length == 0) {
      		var user = req.payload ;
      		user.password = md5(req.payload.password) ;
      		user.created = new Date();
		    DB.conn.queryAsync('INSERT INTO '+DB.users+' SET ?', user).then(function(result) 
		    {
		      res({"statusCode": 200, "message" : "User created successfully"});
		    });
      	}
      	else {
                  res(Boom.conflict('Email already exist'));
      	}
    });
}

module.exports.login = function(req,res) {
	DB.conn.queryAsync('SELECT id , email FROM '+DB.users+' where email = "'+req.payload.email+'" and password = "'+md5(req.payload.password) + '" limit 1').then(function(rows) {
      	if(rows.length == 0) {
      		res(Boom.unauthorized('Invalid credentials. Please try with different credentials')) ;
      	}
      	else {
      		var user = rows[0];
      		var token = jwt.sign({id:user.id},jwt_secret) ;
      		res({"statusCode": 200,"message":"User logged in successfully",token:token});
      	}
    });
}

module.exports.countries = function(req,res) {
	DB.conn.queryAsync("SELECT * FROM "+DB.countries).then(function(countries) {		
		res({"statusCode": 200, "data" : countries });
	});   
}

module.exports.users = function(req,res) {
      DB.conn.queryAsync("SELECT U.id , CONCAT(U.first_name ,' ', U.last_name) As name  FROM "+DB.users+' As U').then(function(users) {
           res(users);
      });
}
