const moment = require('moment');
const glob = require('glob');
var Project = require('../models/project');
var User = require('../models/user');
var services = require('./services.js');

function setProjectInfo(request){
    return {
      _id: request._id,
      title: request.title,
      description: request.description,
      projecttype: request.projecttype,
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
      applicantList: request.applicantList,
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
    Project.findOne({"_id": req.params.id}).populate('postedBy').populate('applicantsList').exec(function(err, project) {
        if (err){ res.send({ error : err.toString() }); }
        if (!project) return res.status(404).send("No Project found.");

        var newproject = setProjectInfo(project);
        //console.log(newproject);
        res.status(200).json(newproject);
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
  var titlelowercase = req.body.title.toLowerCase();
    try{
      var title = req.body.title;
      var description = req.body.description;
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
    //var imageUrl = req.body.imageUrl;
    console.log(title);
    console.log(titlelowercase);
    //var project = new Project({ 'title': title, 'description': description})
    //test this upload with actuallu form to be sure multiple file uploads succeed with data submission.
    /*var filearray = [];
    var uploadx = services.uploaddouble;
        uploadx(req, res, function(err){
            if (err) return res.status(400).send({ error: 'Only word documents, pdf files or image files are allowed!'});
        var filelen = req.files.length
        //var filearray = [];
        for(count = 0; count < filelen; count++){
            filearray.push(req.files[count].filename);
        }
  })*/

    var credentials = {'title': title, 'titlelowercase': titlelowercase,
    'description': description,
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

    /*var query = { title: req.body.title, postedBy: req.user._id };

    var uploadx = services.uploadprojectimage.single('image')
    uploadx(req, res, function(err){
    if (err) return res.status(400).send({ error: 'Only image files are allowed!'});
return res.status(400).json('Title already Taken');
    var imageupload = process.env.SERVER_LINK + '/userfiles/' + req.user.username + '/' + req.file.filename;
        //console.log(credentials);*/
    Project.findOne({ "titlelowercase" : { $regex : new RegExp("^" + titlelowercase + '$', "i") } }, (err, titleAlreadyTaken) => {
      if (err) return res.status(400).send('Internal Error');
      if(!titleAlreadyTaken) {
        Project.create(credentials, function(err, project) {
          //if (err){ return res.status(500).send({error: err.toString()}); }
          if (err){ return next(err); }
          var newproject = setProjectInfo(project);
          res.status(200).json(newproject);
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
//deletes one in the array of projectdocs.
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
    dfilename = '../client/public/userfiles/'+req.user.username+'/';
    var query = Project.find({_id : req.params.projectid}).select({ "projectdocs": 1, "_id": 0});

    query.exec(function (err, someValue) {
        if (err) return next(err);
        console.log(someValue);
        for(count = 0; count < someValue; count++){
            var xfil = dfilename+someValue[count];
            console.log(xfil);
            glob(xfil, (err,files) => {
	            if (err) return res.status(400).send({ error : err.toString() });
		    files.forEach((item,index,array) => {
		    console.log(item + " found");
	    });
	        // Delete files
	    files.forEach((item,index,array) => {
		    fs.unlink(item, (err) => {
            if (err) return res.status(400).send({ error : err.toString() });
                console.log(item + " deleted");
		    });
	    });
        });
    }
    })
    Project.remove({ _id : req.params.projectid }, function(err, project) {
        if (err){
            return res.status(500).send({error: err.toString()});
        }
        res.json({message: 'deleted succesfully'});
    });
}
//accept a project or award a project to member
exports.awardProjectToMember = function(req, res, next){
    Project.findOne({'awardedTo': req.params.userid, status: {$in:['awarded', 'ongoing']} }, function(err, checker) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        if (checker) {
            res.status(200).json( { message: 'User is currently working on a Project'} );
    }
    Project.findOne({ "_id": req.params.projectid }, { projecttype: 1, awardedTo: 1 }, function(err, proj) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        if ((proj.awardedTo != "undefined" && proj.awardedTo != null && proj.awardedTo.length > 0) && proj.projecttype == 'individual') {
            res.status(200).json( { message: 'Project already awarded'} );
        } else if ((proj.awardedTo == "undefined" || proj.awardedTo == null || proj.awardedTo.length < 1) && proj.projecttype == 'individual' ) {
            Project.findByIdAndUpdate({"_id": req.params.projectid}, { $set : {'status': 'awarded'},
                $addToSet: { awardedTo: req.params.userid}
            }, { new: true } ).exec(function(err, projects) {
            if (err){ return res.status(500).send({error: err.toString()}); }
            res.status(200).json({message: 'Project succesfully awarded'});
        })
        } else {
            Project.findByIdAndUpdate({"_id": req.params.projectid}, { $addToSet : { awardedTo: req.params.userid}
            }, { new: true } ).exec(function(err, project) {
            if (err){ return res.status(500).send({error: err.toString()}); }
            res.status(200).json({message: 'Project succesfully awarded'});
        })
    }
    //Project.find({"_id": req.params.projectid, "awardedTo": {$ne : null} }, function(err, project) {
    })
    })
}

//member accept a newly offered project and change its status to ongoing
exports.offerProjectToMember = function(req, res, next) {
    Project.findOne ({ "_id": req.params.projectid, status: {$ne : ['draft', 'ongoing', 'finished']} }, function(err, proj) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        //if (proj) { res.status(201).json( { message: 'Project Already Offered to User'} );
        if (proj) {
            Project.findOne({"_id": req.params.projectid, "offeredTo": { $in : [ req.params.userid ]}}, function(err, projet){
                if (projet) { res.status(201).json( { message: 'Project Already Offered to User'} );
        } else {
            Project.findByIdAndUpdate({"_id": req.params.projectid}, { $set: { status: 'offered'}, $addToSet : {offeredTo: req.params.userid}
            }, { new: true } ).exec(function(err, project) {
                if (err){ return res.status(500).send({error: err.toString()}); }
            res.status(201).json( { message: 'User successfully Offered this Project'} );
        })
    }
    })
        }
    })
}

//revoke a project from a user, update the awardedTo = null and status = created. { $set : { awardedTo: [{}]
exports.revokeProjectFromMember = function(req, res, next) {
    Project.findOne({ "_id": req.params.projectid, "awardedTo": req.params.userid }, { projecttype: 1, awardedTo: 1 }, function(err, proj) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        if(!proj) { return res.status(201).send({message: 'Project do not exist'});  }
        if((proj.awardedTo == "undefined" && proj.awardedTo == null && proj.awardedTo.length < 1)){
            return res.status(201).send({message: 'Project not previously awarded'});
        }
        if ((proj.awardedTo != "undefined" && proj.awardedTo != null && proj.awardedTo.length > 0) && proj.projecttype == 'individual') {
            Project.findByIdAndUpdate({"_id": req.params.projectid}, { $pull : { awardedTo: req.params.userid}, status: 'created'
            }, { new: true } ).exec(function(err, project) {
            if (err){ return res.status(500).send({error: err.toString()}); }
            res.status(201).json({message: 'Project succesfully revoked', project: project});
        })
    } else {
        Project.findByIdAndUpdate({"_id": req.params.projectid}, { $pull : { awardedTo: req.params.userid},
            }, { new: true } ).exec(function(err, proje) {
            if (err){ return res.status(500).send({error: err.toString()}); }
        res.status(201).json( { message: 'Project Successfully revoked'} );
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

//get projects awarded to member using member username sort by datepublished.
exports.getAllMemberOngoingAndAwardedProjects = function(req, res, next) {
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
}
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
