var md5= require('md5') ;
var DB = require('../config.js') ;
var Promise = require('bluebird');

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
      			res({"statusCode": 202, "message" : "Email already exist"});
      	}
    });
}

module.exports.login = function(req,res) {
	DB.conn.queryAsync('SELECT id , email FROM '+DB.users+' where email = "'+req.payload.email+'" and password = "'+md5(req.payload.password) + '" limit 1').then(function(rows) {
      	if(rows.length == 0) {
      		res({error:"Invalid credentials. Please try with different credentials"}) ;
      	}
      	else {
      		var user = rows[0];
      		var token = jwt.sign({id:user.id},jwt_secret) ;
      		res({"statusCode": 200, "message" : "User logged in successfully",token:token});
      	}
    });
}

module.exports.countries = function(req,res) {
	DB.conn.queryAsync("SELECT * FROM "+DB.countries).then(function(countries) {		
		res({"statusCode": 200, "data" : countries });
	});   
}

module.exports.users = function(req,res) {
	DB.conn.queryAsync("SELECT * FROM "+DB.users).then(function(users) {
	     res(users);
	});   
}

module.exports.view = function(req,res) {
	DB.conn.queryAsync('SELECT * FROM '+DB.users+' where id = ?', req.params.id).then(function(user){res(user);});	
}

module.exports.delete = function(req,res) {
	DB.conn.queryAsync('SELECT * FROM '+DB.users+' where id = ?', req.params.id).then(function(rows) {		
		if(rows.length == 0) {
      		res({message:"No user found with this id . Please enter the correct user ID"});
      	}
      	else {
		    DB.conn.queryAsync('DELETE FROM '+DB.users+' where id = ?',req.params.id).then(function(result) {
		      res({success:"User deleted successfully"});
		    });
      	}
	});
}

module.exports.update = function(req, res) {
	DB.conn.queryAsync('SELECT * FROM '+DB.users+' where id = '+req.payload.id+'').then(function(rows) {
      	if(rows.length == 0) {
      		res({message:"No user found with this id . Please enter the correct user ID"});
      	}
      	else {
      		var updateQryStr = '';
      		var update = [];
      		if(req.payload.name)
      		{
      			updateQryStr += 'name = ?';
      			update.push(req.payload.name);
      		}
      		if(req.payload.email)
      		{
      			updateQryStr += 'email = ?';
      			update.push(req.payload.email);
      		}
      		if(req.payload.contact)
      		{
      			updateQryStr += 'contact = ?';
      			update.push(req.payload.contact);
      		}
      		update.push(req.payload.id);
      		DB.conn.queryAsync('UPDATE '+DB.users+' SET '+updateQryStr+' where id = ?',update).then(function(result) {
		      res({message: "User updated successfully"});
		    });
      	}      	
    });
}

module.exports.logout = function(req,res) {
	DB.conn.queryAsync('UPDATE '+DB.users+' SET token = "" where id = ?', req.user.id).then(function(result) {
      res({success : "You have successfully logged out"});
    });
}

module.exports.roles =  function(req, res) {
	DB.conn.queryAsync('SELECT * FROM '+DB.user_roles, req.params.id).then(function(roles){res(roles);
	});
}
