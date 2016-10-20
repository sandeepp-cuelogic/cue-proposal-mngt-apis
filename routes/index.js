const Joi = require('joi') ;
var User = require('./models/user.js') ;
var Client = require('./models/client.js') ;
var valid = {
    id : Joi.number(),
    first_name:Joi.string().min(3).max(30),
    last_name:Joi.string().min(3).max(30),
    email : Joi.string().email(),
    password : Joi.string().alphanum().min(3).max(20),
    contact : Joi.number(),
    role: Joi.number(),
    username: Joi.string().alphanum().min(3).max(20)
};

module.exports = [{
        method: 'POST',
        path: '/login',
        handler: User.login,
        config: {
            auth: false,
            validate: {
                payload: {
                    email: valid.email.required() ,
                    password : valid.password.required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/signup',
        handler: User.signup ,
        config: {
            auth: false,
            validate: {
                payload: {
                    first_name:valid.first_name ,
                    last_name:valid.last_name ,       
                    email:valid.email ,
                    password:valid.password
                }
            }
        }
    },          
    {
        method: 'GET',
        path: '/users',
        handler: User.users,
        config:{
            auth:'token'
        }        
    },       
    {
        method: 'GET',
        path: '/logout',
        handler: User.logout
    }, 
    {
        method: 'GET',
        path: '/countries',
        handler: User.countries
    }, 
    {
        method: 'GET',
        path: '/clients',
        handler: Client.clients
    }];

//mysqldb.end();