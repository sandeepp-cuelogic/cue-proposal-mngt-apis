var md5= require('md5') ;
var DB = require('../config.js') ;
var random = require('../../libs/random.js') ;


module.exports.add = function(req,res) {
      var specification =  req.payload;
      specification.created = new Date();
      DB.conn.queryAsync("INSERT INTO "+DB.specifications +" SET ?" , specification ).then(function(result)
    {
        res(result);
    });
}


module.exports.listings = function(req,res) {
    var proposalId = req.params.proposalId ;
    var qry =  'select * from '+DB.specifications+' As S where S.proposal_id = ' + proposalId;
    DB.conn.queryAsync(qry).then(function(specifications) {
        if(specifications.length) {
          res({"statusCode":200,"message":"Specifications listing done","data":specifications});  
        }
        else
        {
          res({"statusCode":400,"message":"Error in specification listing"});  
        }        
    });
}

module.exports.update = function(req, res) {
    DB.conn.queryAsync('SELECT * FROM '+DB.specifications+' where id = '+req.payload.id).then(function(rows) {
        if(rows.length == 0) {
            res({"statusCode":400,"message":"No specification found with this id . Please enter the correct specification ID"});
        }
        else {
            var updateQry = '' ;
            var updateArr = [] ;
            if(req.payload.title) {
              updateQry += ' title = ?';
              updateArr.push(req.payload.title) ;
            }
            if(req.payload.info) {
              updateQry += ' ,info = ?';
              updateArr.push(req.payload.info) ;
            }
            if(req.payload.cost) {
              updateQry += ' ,cost = ?';
              updateArr.push(req.payload.cost) ;
            }
            updateArr.push(parseInt(req.payload.id)) ;
            DB.conn.queryAsync('UPDATE '+DB.proposals+' SET '+updateQry+' where id = ?',updateArr).then(function(result) {
                res({"statusCode":200,"message":"Proposal updated successfully!"});
            });
        }
    });
}


module.exports.delete = function(req, res) {
    DB.conn.queryAsync('SELECT * FROM '+DB.specifications+' where id = '+req.params.id).then(function(rows) {
        if(rows.length == 0) {
            res({"statusCode":400,"message":"No specification found with this id . Please enter the correct specification ID"});
        }
        else {
            DB.conn.queryAsync('delete from '+DB.proposals+' where id = '+req.params.Id).then(function(result) {
                res({"statusCode":200,"message":"Specification deleted successfully!"});
            });
        }
    });
}