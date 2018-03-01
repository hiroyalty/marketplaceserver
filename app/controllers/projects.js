const moment = require('moment');
const glob = require('glob');
var Project = require('../models/project');
var User = require('../models/user');
var services = require('./services.js');
const fs = require('fs');

function setProjectInfo(request){
    return {
      _id: request._id,
      title: request.title,
      introDescription: request.introDescription,
      description: request.description,
      projecttype: request.projecttype,
      diffilcultyLevel: request.diffilcultyLevel,
      bigdataNoSQL: request.bigdataNoSQL,
      RelationalDB: request.RelationalDB,
      programming: request.programming,
      webdevelopment: request.webdevelopment,
      networking: request.networking,
      cloudcomputing: request.cloudcomputing,
      operatingsystem: request.operatingsystem,
      rhapsberrypi: request.rhapsberrypi,
      devices: request.devices,
      games: request.games,
      android: request.android,
      ios: request.ios,
      windowsphone: request.windowsphone,
      postedBy: request.postedBy,
      category: request.category,
      awardedTo: request.awardedTo,
      awardedToTeam: request.awardedToTeam,
      applicantsList: request.applicantsList,
      numofapplicants: request.numofapplicants,
      location: request.location,
      offeredTo: request.offeredTo,
      status: request.status,
      projectlifespan: request.projectlifespan,
      url: request.url,
      imageUrl: request.imageUrl,
      projectdocs: request.projectdocs,
      additionalinfo: request.additionalinfo,
      datepublished: request.datepublished,
      applicationdeadline: request.applicationdeadline,
      dateupdated: request.dateupdated,
      employerfeedback: request.employerfeedback,
      awardeefeedback: request.awardeefeedback
    };
}
//get all projects
exports.getallProjects = function(req, res, next){
    Project.find({status: {$ne: 'draft'}}, function(err, projects) {
        if (err){
            res.send({ error : err.toString() });
        }
        if (!projects) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
    });
}

exports.getallProjectsFrontView = function(req, res, next){
    Project.find({status: {$nin: ['draft', 'awarded', 'finished']}}, function(err, projects) {
        if (err){
            res.send({ error : err.toString() });
        }
        if (!projects) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
    });
}

//get all new projects, i.e with status "created"
exports.getAllNewProjects = function(req, res, next){
    Project.find({status: 'created', applicationdeadline: { $gt: new Date() }}, function(err, projects) {
        if (err){ res.send({ error : err.toString() }); }
        if (!projects) return res.status(404).send("No New Project found.");
        res.status(200).json(projects);
    });
}

//get project by Id
exports.getProjectById = function(req, res, next){
    Project.findOne({"_id": req.params.id})
      .populate('postedBy')
      .populate('awardedTo')
      .populate('applicantsList')
      .exec(function(err, project) {
    //Project.findOne({"_id": req.params.id}).populate('postedBy').exec(function(err, project) {
        if (err){ res.send({ error : err.toString() }); }
        if (!project) return res.status(404).send("No Project found.");

        var newproject = setProjectInfo(project);
        console.log(newproject);
        res.status(200).json(project);
    });
}
// get project by Id without authentication
exports.getProjectByIdPreview = function(req, res, next){
    Project.findOne({"_id": req.params.id})
      .populate('postedBy')
      //.populate('applicantsList')
      .exec(function(err, project) {
    //Project.findOne({"_id": req.params.id}).populate('postedBy').exec(function(err, project) {
        if (err){ res.send({ error : err.toString() }); }
        if (!project) return res.status(404).send("No Project found.");

        var newproject = setProjectInfo(project);
        console.log(newproject);
        res.status(200).json(newproject);
    });
}
//to get a refresh list of all applicant to a project. note not populating offered.
exports.getApplicantsList = function(req, res, next){
    Project.findOne({"_id": req.params.id}, { applicantsList: 1, awardedTo: 1, offeredTo: 1,  })
      .populate('applicantsList')
      .populate('awardedTo')
      .exec(function(err, project) {
    //Project.findOne({"_id": req.params.id}).populate('postedBy').exec(function(err, project) {
        if (err){ res.send({ error : err.toString() }); }
        if (!project) return res.status(404).send("No Project found.");
        console.log(project);
        res.status(200).json(project);
    });
}
//get completed project by a member getOngoingProjectByMember
exports.getCompletedProjectByMember = function(req, res, next) {
  Project.find({awardedTo: { $in : [ req.params.id ]} , status: 'finished'})
    .populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
        if (err){ return res.status(500).send({error: err.toString()}); }
        if(!projects) { return res.status(204).send({message: 'You have no Finished project'});  }
        res.status(200).json(projects);
  });
}
//get ongoing project by a member
exports.getOngoingProjectByMember = function(req, res, next) {
  Project.find({awardedTo: { $in : [ req.params.id ]} , status: 'awarded'})
    .populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
        if (err){ return res.status(500).send({error: err.toString()}); }
        if(!projects) { return res.status(204).send({message: 'You have no ongoing project'});  }
        res.status(200).json(projects);
  });
}

//get new database category projects. query.sort('-created').limit(12)
exports.getNewDatabaseProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.bigdataNoSQL': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.sqlRDBMS': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.microsoftsqlserverACCESS': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'created', applicationdeadline: { $gt: new Date() } }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get all database projects
exports.getAllDatabaseProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.bigdataNoSQL': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.sqlRDBMS': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.microsoftsqlserverACCESS': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: {$ne: 'draft'} }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get all finished database projects
exports.getFinishedDatabaseProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.bigdataNoSQL': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.sqlRDBMS': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.microsoftsqlserverACCESS': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'finished' }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}

//get all ongoing database projects
exports.getOngoingDatabaseProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.bigdataNoSQL': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.sqlRDBMS': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.microsoftsqlserverACCESS': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'ongoing' }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get new programming based projects
exports.getNewProgrammingProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.java': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.python': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.csharp': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.php': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.javascript': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.swift': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.cplusplus': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'created', applicationdeadline: { $gt: new Date() } }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get all programming projects
exports.getAllProgrammingProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.java': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.python': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.csharp': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.php': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.javascript': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.swift': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.cplusplus': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: {$ne: 'draft'} }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get finished programming based projects
exports.getFinishedProgrammingProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.java': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.python': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.csharp': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.php': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.javascript': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.swift': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.cplusplus': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'finished' }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get ongoing programming based projects
exports.getOngoingProgrammingProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.java': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.python': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.csharp': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.php': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.javascript': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.swift': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.cplusplus': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'ongoing', applicationdeadline: { $gt: new Date() } }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get networking based projects
exports.getNewNetworkingProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.networking': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'created', applicationdeadline: { $gt: new Date() } }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get all networking projects
exports.getAllNetworkingProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.networking': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: {$ne: 'draft'} }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get finished networking based projects
exports.getFinishedNetworkingProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.networking': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'finished' }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get ongoing networking based projects
exports.getOngoingNetworkingProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.networking': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'ongoing', applicationdeadline: { $gt: new Date() } }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get all operating system projects
exports.getNewOperatingSystemProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.linux': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.windows': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'created', applicationdeadline: { $gt: new Date() } }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get all operating system projects
exports.getAllOperatingSystemProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.linux': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.windows': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: {$ne: 'draft'} }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get finished operating system based projects
exports.getFinishedOperatingSystemProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.linux': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.windows': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'finished' }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get ongoing operating system based projects
exports.getOngoingOperatingSystemProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.linux': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.windows': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'ongoing', applicationdeadline: { $gt: new Date() } }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}

//get all cloud computing projects
exports.getNewCloudComputingProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.cloudcomputing': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'created' }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get finished networking based projects
exports.getAllCloudComputingProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.cloudcomputing': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: {$ne: 'draft'} }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get ongoing networking based projects
exports.getFinishedCloudComputingProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.cloudcomputing': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'finished', applicationdeadline: { $gt: new Date() } }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get all operating system projects
exports.getOngoingCloudComputingProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.cloudcomputing': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'ongoing', applicationdeadline: { $gt: new Date() } }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
// get new embedded systems projects
exports.getNewEmbeddedSystemsProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.rhapsberrypi': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.devices': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.games': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'created', applicationdeadline: { $gt: new Date() } }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get all embedded systems projects
exports.getAllEmbeddedSystemsProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.rhapsberrypi': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.devices': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.games': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: {$ne: 'draft'} }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get finished embedded systems projects
exports.getFinishedEmbeddedSystemsProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.rhapsberrypi': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.devices': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.games': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'finished' }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get ongoing embedded systems projects
exports.getOngoingEmbeddedSystemsProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.rhapsberrypi': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.devices': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.games': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'ongoing', applicationdeadline: { $gt: new Date() } }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}

//get mobile applications
exports.getNewMobileDevelopmentProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.android': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.ios': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.windowsphone': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'created', applicationdeadline: { $gt: new Date() } }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get all embedded systems projects
exports.getAllMobileDevelopmentProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.android': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.ios': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.windowsphone': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: {$ne: 'draft'} }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get finished embedded systems projects
exports.getFinishedMobileDevelopmentProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.android': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.ios': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.windowsphone': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'finished' }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//get ongoing embedded systems projects
exports.getOngoingMobileDevelopmentProjects = function(req, res, next){
    Project.find({ $or: [{'skillrequirement.android': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.ios': { $in: ['begineer', 'intermediate', 'expert']}},
        {'skillrequirement.windowsphone': { $in: ['begineer', 'intermediate', 'expert']}},
        ], status: 'ongoing', applicationdeadline: { $gt: new Date() } }).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
            if (err){ res.send({ error : err.toString() }); }
            if (!projects.length) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
        });
}
//for newly created projects. e.g new sql projects e.t.c
exports.getnewProjectByCategory = function(req, res, next) {
    Project.find($in )
}

exports.checkforuniquetitle = function(req, res, next) {
  var titlelowercase = req.body.title.toLowerCase();
  console.log(titlelowercase);
  Project.findOne({ "titlelowercase" : { $regex : new RegExp("^" + titlelowercase + '$', "i") } }, (err, titleAlreadyTaken) => {
    if (err) return res.status(400).send('Internal Error');
    if(titleAlreadyTaken) { return res.status(400).json('Title already Taken'); }
  });
}

//create a project
exports.createproject = function(req, res, next){
  /*var uploadx = services.uploadprojectimage.single('image')
  uploadx(req, res, function(err){
    if (err) return res.status(400).send({ error: 'Only image files are allowed!'});

  var imageurl = process.env.SERVER_LINK + '/userfiles/' + req.user.username + '/' + req.file.filename;
  */
    try{
      var title = req.body.title;
      var introDescription = req.body.introDescription;
      var description = req.body.description;
      var category = req.body.category;
      var diffilcultyLevel = req.body.diffilcultyLevel;
      var bigdataNoSQL = req.body.bigdataNoSQL;
      var RelationalDB = req.body.RelationalDB;
      var programming = req.body.programming;
      var webdevelopment = req.body.webdevelopment;
      var networking = req.body.networking;
      var cloudcomputing = req.body.cloudcomputing;
      var operatingsystem = req.body.operatingsystem;
      var devices = req.body.devices;
      var games = req.body.games;
      var android = req.body.android;
      var ios = req.body.ios;
      var windowsphone = req.body.windowsphone;
      var location = req.body.location;
      var status = req.body.status;
      var projectlifespan = req.body.projectlifespan;
      var applicationdeadline = req.body.applicationdeadline;
    } catch(e){
        return res.status(400).json({error: 'Some vital inputs not specified!'});
    }
    var url = req.body.url;
    var titlelowercase = req.body.title.toLowerCase();
    //var imageUrl = req.body.imageUrl;
    //console.log(title);
    console.log(titlelowercase);

    var credentials = {'title': title, 'titlelowercase': titlelowercase,
    'introDescription': introDescription,
    'description': description,
    'category': category,
    'diffilcultyLevel': diffilcultyLevel,
    'bigdataNoSQL': bigdataNoSQL,
    'RelationalDB': RelationalDB,
    'programming': programming,
    'webdevelopment': webdevelopment,
    'networking': networking,
    'cloudcomputing': cloudcomputing,
    'operatingsystem': operatingsystem,
    'devices': devices,
    'games': games,
    'android': android,
    'ios': ios,
    'windowsphone': windowsphone,
    //'projectdocs': filearray, // comment out for file submission.
    'postedBy': req.user._id,
    'location': location,
    'status': status,
    'url': url,
    'projectlifespan': projectlifespan, //number of weeks of project lifespan.
    'datepublished': moment().format('YYYY-MM-DD'),
    'applicationdeadline': applicationdeadline,
    'dateupdated': moment().format('YYYY-MM-DD')
    };
    Project.findOne({ "titlelowercase" : { $regex : new RegExp("^" + titlelowercase + '$', "i") } }, (err, titleAlreadyTaken) => {
      if (err) return res.status(400).send('Internal Error');
      if(!titleAlreadyTaken) {
        console.log('project new confirmed');
        Project.create(credentials, function(err, project) {
          //if (err){ return res.status(500).send({error: err.toString()}); }
          if (err){ return next(err); }
          console.log(project)
          //var newproject = setProjectInfo(project);
          res.status(200).json(project);

    /*Project.findOneAndUpdate(query, { $set: {image: imageupload } }, {new: true}, (err, result) => {
      if (err) return err;
      //console.log(result);
      res.status(200).json(result);
    });*/

    /*Project.find({})
        .populate('postedBy')
        .exec(function(err, projects) {
    if (err){ return res.status(500).send({error: err.toString()}); }
        res.status(200).json(projects);
    });*/

    //});
    });
  } else {
    return res.status(400).json('Title already Taken');
  }
  })
//})
};

exports.loadprojectimage = [function(req, res, next){
  console.log(req.params.title);
  var uploadx = services.uploadprojectimage.single('image')
  uploadx(req, res, function(err){
    if (err) return res.status(400).send({ error: 'Only image files are allowed!'});

  var imageurl = process.env.SERVER_LINK + '/userfiles/' + req.user.username + '/' + req.file.filename;

  Project.findOneAndUpdate({"title": req.params.title}, { $set: { imageUrl: imageurl }},
  { new: true } ).populate('postedBy').exec(function(err, project) {
    if (err){
        return res.status(500).send({error: err.toString()});
    }
    var newproject = setProjectInfo(project);
    res.status(200).json(project);
  })
});
}]

exports.updateprojectimage = [function(req, res, next){
  console.log(req.params.title);
  console.log(req.params.imagename);

  var filenamed = '../client/public/userfiles/' + req.user.username + '/';
  var dfilename = filenamed + req.params.imagename;
  console.log(dfilename);

  services.delfile(dfilename, function(err, files){
    if(err) return res.status(500).send({error: err.toString() });

  var uploadx = services.uploadprojectimage.single('image')
  uploadx(req, res, function(err){
    if (err) return res.status(400).send({ error: 'Only image files are allowed!'});

  var imageurl = process.env.SERVER_LINK + '/userfiles/' + req.user.username + '/' + req.file.filename;

  Project.findOneAndUpdate({"title": req.params.title}, { $set: { imageUrl: imageurl }},
  { new: true } ).populate('postedBy').exec(function(err, project) {
    if (err){
        return res.status(500).send({error: err.toString()});
    }
    res.status(200).json(project);
  })
  });
});
}]

exports.updateproject = function(req, res, next) {
  var query = { _id: req.params.id };
  console.log(query);
  //User.findOneAndUpdate(query, { $set: req.body }, options, callback);
  Project.findOneAndUpdate(query, { $set: req.body }, {new: true}, (err, result) => {
    if (err) res.status(400).json('project update failed');
    //console.log(result);
    //var newproject = setProjectInfo(result);
    //console.log(newproject);
    res.status(200).json(result);
  });
};

exports.loadprojectfiles = [function(req, res, next){
  console.log(req.params.title);
  var uploadx = services.uploaddouble;
  uploadx(req, res, function(err){
    if (err) return res.status(400).send({ error: 'Only word documents, pdf files or image files are allowed!'});

    var filelen = req.files.length
    var filearray = [];
    var filenamed = process.env.SERVER_LINK + '/userfiles/' + req.user.username + '/';
    for(count = 0; count < filelen; count++){
        filearray.push(filenamed + req.files[count].filename);
    }
    console.log(filearray);
    Project.findOneAndUpdate({"title": req.params.title}, { $addToSet: { projectdocs: {$each: filearray } }
  }, { new: true }, (err, projects) => {
        if (err){
            return res.status(500).send({error: err.toString()});
        }
        res.status(200).json(projects);
  })
});
}]
//deletes one in the array of projectdocs. instead of using the req use why not use
// the postedBy username.
exports.deletefile = function(req, res, next){
  var query = { _id: req.params.id };
  var dfilename = null;
  var filename = req.params.filename;
  //var dfile = fullfilename.split("/");
  //var filename = dfile[5];
  var fullfilename = 'https://localhost:3000/userfiles/' + req.user.username + '/' + filename
  //console.log(req.params.title);
  console.log(filename);
  console.log(fullfilename);
  //var finame = fullfilename[0];

    if(req.user.role == 'admin' || req.user.role == 'member' || req.user.role == 'employer'){
        //dfilename = '../client/public/userfiles/'+req.user.username+'/'+ filename;
        dfilename = '../client/public/userfiles/'+req.user.username+'/'+ filename;
    } else {
        dfilename = '../client/public/img/'+ filename;
        //dfilename = '../client/public/img/'+ filename;
    }
    services.delfile(dfilename, function(err, files){
      if(err) return res.status(500).send({error: err.toString() });

  Project.findOneAndUpdate(query, { $pull: { projectdocs: fullfilename } } , {new: true}, (err, result) => {
    if (err) return err;
    //console.log(result);
    //let user = setUserInfo(result);
    res.status(200).json(result);
  });
  });

}

exports.deleteproject = function(req, res, next){
    //dfilename = '../client/public/userfiles/'+req.user.username+'/';
    //to delete any project additional documents

    var dfilename = '../client/public/userfiles/'+ req.params.username +'/';
    var query = Project.find({_id : req.params.id}).select({ "projectdocs": 1, "imageUrl": 1, "_id": 0});

    query.exec(function (err, retValue) {
        if (err) return next(err);
        //console.log(retValue[0]);
        var returValues = retValue[0];
        if(returValues.imageUrl) {
          var retImage = returValues.imageUrl;
          var splitString = retImage.toString();
          var splitString = splitString.split("/");
          var projectimage = splitString[5];
          projectimage = dfilename+projectimage;
          console.log(projectimage);
          services.delfile(projectimage, function(err, filess){
            if(err) return res.status(500).send({error: err.toString() });
          })
        }
        if(returValues.projectdocs) {
          var retdocs = returValues.projectdocs;
          //console.log(retdocs);
          for(count = 0; count < retdocs.length; count++){
            var splitedString = retdocs[count].toString();
            var splitedString = splitedString.split("/");
            var projectdocu = splitedString[5];
            var xfil = dfilename+projectdocu;
            console.log(xfil);
            services.delfile(xfil, function(err, filess){
              if(err) return res.status(500).send({error: err.toString() });
            })
          }
        }

        Project.remove({ _id : req.params.id }, function(err, project) {
          if (err){
              return res.status(500).send({error: err.toString()});
          }
          res.status(200).json({message: 'deleted succesfully'});
      });
      })
    }

//accept a project or award a project to member, thinking abt separting the initial
//user busy on another project part... for easy report display on the front end.
exports.checkUserAvailable = function(req, res, next){
    Project.findOne({'awardedTo': req.params.userid, status: {$in:['awarded', 'ongoing']} }, function(err, checker) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        if (checker) {
          res.status(400).json( { message: 'User is currently working on a Project'} );
        } else {
          res.status(200).json( { message: 'User is available for this Project'} );
        }
    });
  }

//this happens when a member accepts his/her offered project. and change its status to awarded.
exports.awardProjectToMember = function(req, res, next){
    var username = req.params.username;
    var email = req.params.email;
    var url = (process.env.EMAIL_URL || "https://localhost:4200");

    Project.findOne({'awardedTo': req.params.userid, status: {$in:['awarded', 'ongoing']} }, function(err, checker) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        if (checker) {
            res.status(200).json( { message: 'User is currently working on a Project'} );
    }
    Project.findOne({ "_id": req.params.projectid }, { projecttype: 1, awardedTo: 1 }, function(err, proj) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        //check if project is already awarded.
        if ((proj.awardedTo != "undefined" && proj.awardedTo != null ) && proj.projecttype == 'individual') {
            res.status(400).json( { message: 'Project already awarded'} );
        } else if ((proj.awardedTo == "undefined" || proj.awardedTo == null || proj.awardedTo.length < 1) && proj.projecttype == 'individual' ) {
            Project.findByIdAndUpdate({"_id": req.params.projectid},
            { $set : {status: 'awarded', awardedTo: req.params.userid} },
            { new: true } ).exec(function(err, projects) {
            if (err){ return res.status(500).send({error: err.toString()}); }
            //notify by mailing the member
            var proTitle = projects.title.toUpperCase();
            var mailOptions = {
            from: '"Admin Market Place" <gbolaga.famodun@gmail.com>', // sender address
            to: email, // list of receivers
            subject: 'Market Place Award you a Project', // Subject line
            text: 'Hello , You have been awarded a new project on Market place.', // plain text body
            html: '<b>Hello '+ username +' </b>'+
                    '<p>You are receiving this mail because you have been awarded a project on the Market Place platform.</p>' +
                    '<p>kindly kindly ensure you start immediately so as to finish within the allocated timeline:<p>' +
                    '<p>If you need anything do not hessitate to contact the employer or admin, we will be happy to help.<p/>'+
                    '<p>Project Title: ' + proTitle + '<p/>'+
                    '<p>If you are not a member of Market place, please ignore this email.\n</p>'+
                    '<p>Regards,</p>'
            };
            services.transporter.sendMail(mailOptions, (error, info) => {
              if (error) { return console.log(error); }
            });
            res.status(200).json(projects);
        })
      } else if (proj.projecttype == 'team'){
            Project.findByIdAndUpdate({"_id": req.params.projectid}, { $addToSet : { awardedToTeam: req.params.userid}
            }, { new: true } ).exec(function(err, project) {
            if (err){ return res.status(500).send({error: err.toString()}); }
            // send mail too like above if team project award succeeds.
            res.status(200).json({message: 'Project succesfully awarded'});
        })
    } else {}
    //Project.find({"_id": req.params.projectid, "awardedTo": {$ne : null} }, function(err, project) {
    })
    })
}

//members are offered project
exports.offerProjectToMember = function(req, res, next) {
    Project.findOne ({ "_id": req.params.projectid, status: {$ne : ['draft', 'awarded', 'finished']} }, function(err, proj) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        //if (proj) { res.status(201).json( { message: 'Project Already Offered to User'} );
        if (proj) {
            Project.findOne({"_id": req.params.projectid, "offeredTo": { $in : [ req.params.userid ]}}, function(err, projet){
                if (projet) { res.status(201).json( { message: 'Project Already Offered to User'} );
        } else {
            Project.findByIdAndUpdate({"_id": req.params.projectid}, { $set: { status: 'offered'}, $addToSet : {offeredTo: req.params.userid}
            }, { new: true } ).exec(function(err, project) {
                if (err){ return res.status(500).send({error: err.toString()}); }

            //notify by mailing the member
            var username = req.params.username;
            var email = req.params.email;
            var url = (process.env.EMAIL_URL || "https://localhost:4200");
            var proTitle = project.title.toUpperCase();
            var mailOptions = {
            from: '"Admin Market Place" <gbolaga.famodun@gmail.com>', // sender address
            to: email, // list of receivers
            subject: 'Market Place Offered you a Project', // Subject line
            text: 'Hello , You have been offered a new project on Market place, login to accept.', // plain text body
            html: '<b>Hello '+ username +' </b>'+
                    '<p>You are receiving this mail because you have been offered a project on the Market Place platform.</p>' +
                    '<p>kindly login into your account to accept the offer:<p>' +
                    '<p>Project Title: ' + proTitle + '<p/>'+
                    '<p>If you are not a member of Market place, please ignore this email.\n</p>'+
                    '<p>Regards,</p>'
            };
            services.transporter.sendMail(mailOptions, (error, info) => {
              if (error) { return console.log(error); }
            });
            res.status(201).json( { message: 'User successfully Offered this Project'} );
        })
    }
    })
        }
    })
}

//revoke a project from a user, update the awardedTo = null and status = created. { $set : { awardedTo: [{}]
exports.revokeProjectFromMember = function(req, res, next) {
  Project.findOne({ "_id": req.params.projectid}, function(err, prolice) {
      if (err) { return res.status(500).send({error: err.toString()});  }
      if(!prolice) {
        return res.status(400).send({message: 'Project do not exist'});
      } else {
        Project.findOne({ "_id": req.params.projectid, "awardedTo": req.params.userid }, { projecttype: 1, awardedTo: 1 }, function(err, proj) {
            if (err) { return res.status(500).send({error: err.toString()});  }
            if(!proj) {
              return res.status(400).send({message: 'Project not awarded to user'});
            } else {
              Project.findByIdAndUpdate({"_id": req.params.projectid}, { $set : { status: 'offered', awardedTo: undefined },
              $pull: {offeredTo: req.params.userid, applicantsList: req.params.userid}  }, { new: true } ).exec(function(err, proje) {
                  if (err){ return res.status(500).send({error: err.toString()}); }

                  //notify by mailing the member
                  var username = req.params.username;
                  var email = req.params.email;
                  var url = (process.env.EMAIL_URL || "https://localhost:4200");
                  var proTitle = proje.title.toUpperCase();
                  var mailOptions = {
                  from: '"Admin Market Place" <gbolaga.famodun@gmail.com>', // sender address
                  to: email, // list of receivers
                  subject: 'Market Place Revoke your Project', // Subject line
                  text: 'Hello , You have been removed from a project on Market place. login to check.', // plain text body
                  html: '<b>Hello '+ username +' </b>'+
                          '<p>You are receiving this mail because you have been removed from a project on the Market Place platform.</p>' +
                          '<p>kindly login into your account to check the details:<p>' +
                          '<p>Project Title: ' + proTitle + '<p/>'+
                          '<p>If you are not a member of Market place, please ignore this email.\n</p>'+
                          '<p>Regards,</p>'
                  };
                  services.transporter.sendMail(mailOptions, (error, info) => {
                    if (error) { return console.log(error); }
                  });
                  res.status(200).json(proje);
            })
      }

    })
    }
    })
}
//get project by employer username and title
exports.getProjectWithEmployerNameAndTitle = function(req, res, next) {
    var emp = 'employer'
    User.findOne({ "username": req.body.username, "role": emp }, function(err, user) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        if (!user) { return res.status(201).send({message: 'This employer does not exist'});  }
        //console.log(user._id);
    Project.find({"postedBy": user._id, "title": { $regex: req.body.projecttitle, $options: 'i' },
        status: {$ne: 'draft'}}).populate('postedBy').sort({datepublished: -1}).exec(function( err, projects) {
        if (err){ return res.status(500).send({error: err.toString()}); }
        if(!projects.length) { return res.status(201).send({message: 'This employer has no project like ' + req.body.projecttitle});  }
    res.status(200).json(projects);
    })
    })
}
exports.getemployerprojectsbyid = function(req, res, next) {
  //Project.find({"postedBy": req.params.id} ).populate('postedBy')
  Project.find({"postedBy": req.params.id, status: {$ne: 'draft'}} ).populate('postedBy')
      .sort({datepublished: -1}).exec(function(err, projects) {
      if (err){ return res.status(500).send({error: err.toString()}); }
      if(!projects.length) { return res.status(500).send({message: 'This employer ' + req.user.username+ ' has no project'});  }
      res.status(200).json(projects);
  })
}
//get projects by employer searching with username, sort by datepublished
exports.getAllEmployerProjects = function(req, res, next) {
  var userdetail = req.body.username;
  if(userdetail) {
    User.findOne({ "username": userdetail, "role": "employer" }, function(err, user) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        if (!user) { return res.status(201).send({message: 'This employer does not exist'});  }

      Project.find({"postedBy": req.user._id, status: {$ne: 'draft'}} ).populate('postedBy')
      //Project.find({"postedBy": user._id, status: {$ne: 'draft'}} ).populate('postedBy')
          .sort({datepublished: -1}).exec(function(err, projects) {
          if (err){ return res.status(500).send({error: err.toString()}); }
          if(!projects.length) { return res.status(201).send({message: 'This employer ' + req.user.username+ ' has no project'});  }
      res.status(200).json(projects);
      })
    })
  } else {
      Project.find({"postedBy": req.user._id} ).populate('postedBy')
      //Project.find({"postedBy": user._id, status: {$ne: 'draft'}} ).populate('postedBy')
          .sort({datepublished: -1}).exec(function(err, projects) {
          if (err){ return res.status(500).send({error: err.toString()}); }
          if(!projects.length) { return res.status(201).send({message: 'This employer ' + req.user.username+ ' has no project'});  }
      res.status(200).json(projects);
      })
    }
}

exports.getAdminProjects = function(req, res, next) {
  var userdetail = req.body.username;
  if(userdetail) {
    User.findOne({ "username": userdetail, "role": "admin" }, function(err, user) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        if (!user) { return res.status(201).send({message: 'This admin does not exist'});  }

      Project.find({"postedBy": req.user._id, status: {$ne: 'draft'}} ).populate('postedBy')
      //Project.find({"postedBy": user._id, status: {$ne: 'draft'}} ).populate('postedBy')
          .sort({datepublished: -1}).exec(function(err, projects) {
          if (err){ return res.status(500).send({error: err.toString()}); }
          if(!projects.length) { return res.status(201).send({message: 'This employer ' + req.user.username+ ' has no project'});  }
      res.status(200).json(projects);
      })
    })
  } else {
      Project.find({"postedBy": req.user._id} ).populate('postedBy')
      //Project.find({"postedBy": user._id, status: {$ne: 'draft'}} ).populate('postedBy')
          .sort({datepublished: -1}).exec(function(err, projects) {
          if (err){ return res.status(500).send({error: err.toString()}); }
          if(!projects.length) { return res.status(201).send({message: 'This admin ' + req.user.username+ ' has no project'});  }
      res.status(200).json(projects);
      })
    }
}

exports.getOtherProjectsForAdmin = function(req, res, next) {
    Project.find({postedBy: {$ne : req.user._id}, status: {$ne: 'draft'}} ).populate('postedBy')
    //Project.find({"postedBy": user._id, status: {$ne: 'draft'}} ).populate('postedBy')
        .sort({datepublished: -1}).exec(function(err, projects) {
        if (err){ return res.status(500).send({error: err.toString()}); }
        if(!projects.length) { return res.status(201).send({message: 'This admin ' + req.user.username+ ' has no project'});  }
    res.status(200).json(projects);
  })
}
//get projects awarded to member using member username sort by datepublished
exports.getAllMemberOngoingAndAwardedProjects = function(req, res, next) {
    //Project.find({$or: [{'offeredTo': { $in: [ user._id]}}, {'awardedTo': { $in: [ user._id ] } }],"status": { $in: [ 'awarded', 'ongoing' ] }
    Project.find({$or: [{'offeredTo': { $in : [req.user._id ] } }, {'awardedTo': { $in : [req.user._id ] }} ] } ).populate('postedBy').sort({datepublished: -1})
        .exec(function(err, projects) {
        if (err){ return res.status(500).send({error: err.toString()}); }
        if(!projects.length) { return res.status(201).send({message: 'This member ' + req.body.username+ ' has no project'});  }
        //return res.status(201).send({message: 'This member ' + req.body.username+ ' has no project'});
        res.status(200).json(projects);
    });
}

/*exports.getAllMemberOngoingAndAwardedProjects = function(req, res, next) {
    User.findOne({ "username": req.body.username, "role": "member" }, function(err, user) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        if (!user) { return res.status(201).send({message: 'This member does not exist'});  }
    //Project.find({$or: [{'offeredTo': { $in: [ user._id]}}, {'awardedTo': { $in: [ user._id ] } }],"status": { $in: [ 'awarded', 'ongoing' ] }
    console.log(user._id)
    Project.find({'awardedTo._id': { $in : [user._id ] }, "status": "awarded" } ).populate('postedBy').sort({datepublished: -1})
        .exec(function(err, projects) {
        if (err){ return res.status(500).send({error: err.toString()}); }
        if(!projects.length) { return res.status(201).send({message: 'This member ' + req.body.username+ ' has no project'});  }
        res.status(200).json(projects);
    })
    })
}*/
//get member all finished projects.
exports.getAllMemberFinishedProject = function(req, res, next) {
    User.findOne({ 'username': req.body.username, role: 'member' }, function(err, user) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        if (!user) { return res.status(201).send({message: 'This user does not exist'});  }
    Project.find({'awardedTo': { $in: [ user._id ] }, status: 'finished'} ).populate('postedBy').sort({datepublished: -1}), function(err, projects) {
        if (err){ return res.status(500).send({error: err.toString()}); }
        if(!projects) { return res.status(201).send({message: 'This member ' + req.body.username+ ' has no Finished project'});  }
        res.status(200).json(projects);
    }
    })
}

// change status of a team project to awarded after the team is filled.
exports.updateTeamProjectToAwarded = function(req, res, next) {
    Project.findOneAndUpdate({"_id": req.params.projectid, 'postedBy': req.user._id, "projecttype": 'team', 'awardedTo': { $exists: true, $ne: []} }, { $set : { status: 'awarded'}
        }, { new: true } ).exec(function(err, project) {
        if (err){ return res.status(500).send({error: err.toString()}); }
        if (!project) { return res.status(201).send( {message: 'Operation not possible' })}
        res.status(201).json({message: 'Project succesfully awarded'});
    })
}
//status update.
exports.updateProjectStatus = function(req, res, next){
    Project.findOneAndUpdate({"_id": req.params.projectid, 'postedBy': req.user._id }, { $set : { status: req.body.status}
        }, { new: true } ).exec(function(err, project) {
        if (err){ return res.status(500).send({error: err.toString()}); }
        if (!project) { return res.status(201).send( {message: 'Operation not possible' })}
        res.status(201).json({message: 'Project succesfully updated'});
    })
}
//allow for various types of project updates
