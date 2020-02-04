const moment = require('moment');
/*const glob = require('glob');
var Project = require('../models/project');*/
var Commenti = require('../models/comment');
var services = require('./services.js');
const fs = require('fs');

exports.getAProjectComments = function(req, res, next) {
  //Commenti.find({"projectId": req.params.id}).sort({ messageTime: -1}, function(err, allcomments) {
  Commenti.find({"projectId": req.params.id}, function(err, allcomments) {
      if (err){ res.send(err);  }
      if(!allcomments) { res.status(204).json('empty result set')}
      res.status(200).json(allcomments);
  });
  //console.log(req.params.id);
}

exports.createComment = function(req, res, next) {
  try{
    var userId = req.body.userId;
    var username = req.body.username;
    var userpix = req.body.userpix;
    var message = req.body.message;
    var projectId = req.body.projectId;
    var projectTitle = req.body.projectTitle;
  } catch(e){
      return res.status(400).json({error: 'Some vital inputs not specified!'});
  }
    var messageTime = Date.now();

    var credentials = {
      'userId': userId,
      'username': username,
      'userpix': userpix,
      'message': message,
      'projectId': projectId,
      'projectTitle': projectTitle,
      'messageTime': messageTime
    }

  Commenti.create(credentials, function(err, onecomment) {
    if (err){ return next(err); }
    console.log(onecomment)
    Commenti.findOne({"projectId": projectId}, function(err, allcomments) {
        if (err){ res.send(err);  }
        res.status(200).json(allcomments);
    });
  });
}
