const Joi = require('joi') ;
var User = require('./models/user.js') ;
var Client = require('./models/client.js') ;
var Proposal = require('./models/proposal.js') ;
var Specification = require('./models/specification.js') ;
var valid = {
    id : Joi.number(),
    client_name : Joi.string().max(40),
    title : Joi.string().max(255),
    text : Joi.string(),
    first_name:Joi.string().min(3).max(30),
    last_name:Joi.string().min(3).max(30),
    email : Joi.string().email(),
    password : Joi.string().alphanum().min(3).max(20),
    contact : Joi.number(),
    role: Joi.number(),
    username: Joi.string().alphanum().min(3).max(20),
    file: Joi.string().max(80)
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
        path: '/registration',
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
    }, 
    {
        method: 'POST',
        path: '/client',
        handler: Client.add,
        config: {
            validate: {
                payload: {
                    name:valid.client_name ,
                    country_id:valid.id ,
                    logo_file_name:valid.file
                }
            }
        }

    }, 
    {
        method: 'POST',
        path: '/proposal',
        handler: Proposal.add,
        config: {
            validate: {
                payload: {
                    title:valid.title ,
                    client_id:valid.id ,
                    assigned_to:valid.id ,
                    created_by:valid.id,
                    more_info : valid.text
                }
            }
        }
    }, 
    {
        method: 'GET',
        path: '/proposals/{status}',
        handler: Proposal.proposals
    }, 
    {
        method: 'PUT',
        path: '/proposal',
        handler: Proposal.update
    }, 
    {
        method: 'GET',
        path: '/proposal/{Id}',
        handler: Proposal.view
    },
    {
        method: 'GET',
        path: '/specifications/{proposalId}',
        handler: Specification.listings
    },
    {
        method: 'PUT',
        path: '/specification',
        handler: Specification.update
    }
    ,
    {
        //Delete specification based on ID
        method: 'GET',
        path: '/specification/{Id}',
        handler: Specification.delete
    }];

//mysqldb.end();