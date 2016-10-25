var md5= require('md5') ;
var DB = require('../config.js') ;
var random = require('../../libs/random.js') ;
var Boom =  require('boom');

module.exports.add = function(req,res) {
    var proposal = req.payload ;
    proposal.created =  new Date();
    proposal.is_active = 1;
    DB.conn.queryAsync("INSERT INTO "+DB.proposals +" SET ?" , proposal ).then(function(result)
    {
        res(result);
    });
}

module.exports.proposals = function(req,res) {

    if(!req.query.page)
    {
        res(Boom.badRequest('Please provide the page number'));
    }

    if(req.query.page <= 0)
    {
        res(Boom.badRequest('Invalid page number.'));
    }

    var prStatus = req.params.status ;
    var perpage =  20;
    var page = req.query.page ;
    var search = false   ;
    if(req.query.s) {
      search = req.query.s ;
    }

    //if(req.query.perpage){ perpage = req.query.perpage; }
    if(req.query.page){page = req.query.page ; }
    var skip = perpage*(page-1) ;
    var qry = "SELECT Proposals.* , User.id , User.first_name , Client.id,  Client.name FROM "+DB.proposals +" As Proposals INNER JOIN "+DB.users +" As User ON Proposals.assigned_to = User.id" + " INNER JOIN "+DB.clients + " As Client ON Proposals.client_id = Client.id where Proposals.is_active = "+prStatus ;    

    if(search) {
        qry += " AND (Proposals.title like '%"+search+"%'";
        qry += " OR User.first_name like '%"+search+"%'";
        qry += " OR User.last_name like '%"+search+"%'";
        qry += " OR Client.name like '%"+search+"%') ";
    }

    qry += ' limit '+perpage+' offset '+skip ;
    if(req.query.assigned_to) { assigned_to = req.query.assigned_to ; }
    var options = {sql: qry , nestTables: true } ;
    DB.conn.queryAsync(options).then(function(proposals) {
        res({"statusCode":200, "message":"Proposals listing done","data":proposals});
    });
}

module.exports.update = function(req, res) {
    DB.conn.queryAsync('SELECT * FROM '+DB.proposals+' where id = '+req.payload.id+'').then(function(rows) {
        if(rows.length == 0) {
          res(Boom.notFound('No proposal found with this id . Please enter the correct proposal ID'));
        }
        else {
          var dt =  req.payload ;
          DB.conn.queryAsync('UPDATE '+DB.proposals+' SET title = ? , more_info = ?, client_id = ?,assigned_to = ? where id = ?',[dt.title, dt.more_info, dt.client_id, dt.assigned_to,dt.id]).then(function(result) {
              res({"statusCode":200,"message":"Proposal updated successfully!"});
          });
        }
    });
}

module.exports.view = function(req,res) {    
    var qry = 'SELECT P.id, P.title, P.more_info , P.created ,  U.id, U.first_name , C.id , C.name FROM '+DB.proposals+' P INNER JOIN '+DB.users+' U on P.created_by = U.id INNER JOIN '+DB.clients+' C on P.client_id = C.id where P.id = '+req.params.Id ; 
    var options = {sql: qry , nestTables: true } ;
    DB.conn.queryAsync(options).then(function(proposal) {
        if(proposal.length) {
            var pr_qry = 'SELECT S.* FROM '+DB.specifications +' S where S.proposal_id = '+req.params.Id ;
            DB.conn.queryAsync(pr_qry).then(function(specifications) {
              res({"statusCode":200, "message":"Proposal details", "data":{"proposal":proposal[0],"specifications": specifications}});
            });            
        }
        else
        {          
            res(Boom.notFound('No proposal found with this id . Please enter the correct proposal ID'));
        }
    });

}
