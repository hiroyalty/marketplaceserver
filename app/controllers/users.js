const fs = require('fs');
const glob = require('glob');
const multer = require('multer');
var Jimp = require('jimp');
var services = require('./services.js');
var User = require('../models/user');
var InterestedProject = require('../models/interestedprojects');
var authentication = require('./authentication.js');
var Project = require('../models/project');
var bcrypt   = require('bcrypt-nodejs');
var crypto = require('crypto');

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

function setUserPrefInfo(request) {
  return {
    _id: request._id,
    username: request.username,
    projectdatabase: request.projectdatabase,
    projectprogramming: request.projectprogramming,
    projectweb: request.projectweb,
    projectmobile: request.projectmobile,
    probigdata: request.probigdata,
    promysql: request.promysql,
    prooracle: request.projectmobile,
    prosqlserver: request.prosqlserver,
    propostgresql: request.propostgresql,
    prosqllite: request.prosqllite,
    projava: request.projava,
    propython: request.propython,
    procsharp: request.procsharp,
    procplusplus: request.procplusplus,
    proc: request.proc,
    prophp: request.prophp,
    projavascript: request.projavascript,
    prohtml5: request.prohtml5,
    proandroid: request.proandroid,
    proios: request.proios,
    prowindowsphone: request.prowindowsphone
  };
}

function setUserInfo(request){
    return {
      _id: request._id,
      username: request.username,
      email: request.email,
      firstname: request.firstname,
      lastname: request.lastname,
      role: request.role,
      street: request.address.street,
      city: request.address.city,
      region: request.address.region,
      zip: request.address.zip,
      phonenumber: request.phonenumber,
      picture: request.picture,
      cv: request.cv,
      cvicon: request.cvicon,
      coverletter: request.coverletter,
      coverlettericon: request.coverlettericon,
      completedproject: request.completedproject,
      interestedproject: request.interestedproject,
      bigdataNoSQL: request.bigdataNoSQL,
      mysql: request.mysql,
      oracle: request.oracle,
      sqlserver: request.sqlserver,
      postgresql: request.postgresql,
      sqlite: request.sqlite,
      java: request.java,
      python: request.python,
      csharp: request.csharp,
      cplusplus: request.cplusplus,
      c: request.c,
      php: request.php,
      javascript: request.javascript,
      html5: request.html5,
      networking: request.networking,
      linux: request.linux,
      windows: request.windows,
      cloudcomputing: request.cloudcomputing,
      devices: request.devices,
      games: request.games,
      android: request.android,
      ios: request.ios,
      windowsphone: request.windowsphone,
      company: request.company,
      companyIDNumber: request.companyIDNumber,
      status: request.status,
      numberofongoingproject: request.numberofongoingproject,
      url: request.url,
      bio: request.bio,
      companycertificate: request.companycertificate,
      companycertificateicon: request.companycertificateicon,
      picture: request.picture,
      companyIDNumber: request.companyIDNumber,
      status: request.status
    };
}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

exports.getAllUser = function(req, res, next) {
  User.find(function(err, users) {
      if (err){
          res.send(err);
      }
      //res.json(todos);
      res.status(200).json(users);
  });
}

exports.getUser = function(req, res, next) {
  User.findOne({ _id : req.params.id },function(err, oneuser) {
    if (err){
        res.send(err);
    }
    var user = setUserInfo(oneuser);
    res.status(200).json(user);
  });
}

exports.deleteUser = function(req, res, next) {
  console.log(req.params.id);
  User.remove({ _id : req.params.id }, function(err, user) {
    if (err) { res.status(500).json('Internal Server Error'); }
    res.status(200).json('User deleted Successfully');
  });
}

exports.updateuser = function(req, res, next) {
  var query = { username: req.user.username };
  console.log(query);
  console.log(req.body);
  console.log(req.bodyNotEmpty);
  //User.findOneAndUpdate(query, { $set: req.body }, options, callback);
  User.findOneAndUpdate(query, { $set: req.bodyNotEmpty }, {new: true}, (err, result) => {
    if (err) return err;
    //console.log(result);
    let user = setUserInfo(result);
    res.status(200).json(user);
  });
}

exports.adminUpdateUser = function(req, res, next) {
  var query = { _id: req.params.id };
  console.log(query);
  console.log(req.body);
  console.log(req.bodyNotEmpty);
  //User.findOneAndUpdate(query, { $set: req.body }, options, callback);
  User.findOneAndUpdate(query, { $set: req.bodyNotEmpty }, {new: true}, (err, result) => {
    if (err) return err;
    //console.log(result);
    let user = setUserInfo(result);
    res.status(200).json(user);
  });
}

exports.updateuserprojectprefs = function(req, res, next) {
  var query = { username: req.params.id };
  console.log(query);
  console.log(req.body);
  InterestedProject.findOneAndUpdate(query, { $set: req.body }, {new: true}, (err, projectinterest) => {
    if (err) return err;
    //console.log(result);
    let userintproject = setUserPrefInfo(projectinterest);
    res.status(200).json(userintproject);
  });
}

exports.getuserprojectprefs = function(req, res, next) {
  var query = { username: req.params.id };
  console.log(query);
  InterestedProject.findOne(query, (err, projectinterest) => {
    if (err) return err;
  if(!projectinterest) {
    InterestedProject.create({ username : req.params.id, projectdatabase : true,
      projectprogramming : true, projectweb : true, projectmobile : true}, function(err, interestprojet) {
        if (err) {  return err;  } //res.send(err);
        InterestedProject.findOne({userid: req.user._id}, function(err, intproject) {
            if (err){ return err; } //res.send(err);
            let userintproject = setUserPrefInfo(intproject);
            res.status(200).json(userintproject);
        });
    });
  } else {
    let userintproject = setUserPrefInfo(projectinterest);
    res.status(200).json(userintproject);
  }
  });
}

function generatesaltpass(cpassword) {
  var SALT_FACTOR = 5;
  bcrypt.genSalt(SALT_FACTOR, function(err, salt){
    if(err) { return next(err); }
  bcrypt.hash(cpassword, salt, null, function(err, hash){
      if(err){ return next(err);  }
  return hash;
});
});
}

exports.updatepassword = function(req, res, next){
    var oldpassword = req.body.oldpassword;
    var newpassword = req.body.password;

    //var hashpass = generatesaltpass(oldpassword);
    var SALT_FACTOR = 5;

    bcrypt.genSalt(SALT_FACTOR, function(err, salt){
      if(err) { return next(err); }
    bcrypt.hash(oldpassword, salt, null, function(err, hash){
        if(err){ return next(err);  }
        console.log(hash);

    var query = {username: req.user.username};
    User.findOne(query, (err, oneuser) => {
      if (err) return err;
    if(oneuser) {
      //res.status(404).json('Wrong old Password');

    bcrypt.genSalt(SALT_FACTOR, function(err, salt){
      if(err){ return next(err); }
    bcrypt.hash(newpassword, salt, null, function(err, hash){
      if(err){ return next(err);  }
      var query = { username: req.user.username };
    User.findOneAndUpdate({ username: req.user.username },
      {$set: { password: hash } }, { new: true },(err, updatedmember) => {
        if (err) {return res.status(500).json({ error : err.toString() });}

          res.status(200).json('password update successful');
      });
      });
    });
  };
});
  });
  });
  }

//note file uploads is not happening here. we got to test array values for
// interestedproject and completedproject too.
exports.updateUsertoMember = function(req, res, next){
    //upload.single('picture');
    //var userInfo = setUserInfo(req.user);
    var interestproj =  ["rhapbeery pi", "android", "ios"]; //req.body.interestedproject;
    var compProject =  ["https://github.com/hiroyalty/livefree", "https://github.com/hiroyalty/behealthy"]; //req.body.completedproject;
    var userint = req.user.interestedproject;
    var usercom = req.user.completedproject;
    //console.log(userint);
    //console.log(usercom);
    if(userint != null && userint.length > 0){
      var interestprojs =  interestproj.concat(userint);
    } else {
      var interestprojs = interestproj;
    }
    if(usercom != null && usercom.length > 0){
      var compProjects = compProject.concat(usercom);
    } else {
      var compProjects = compProject;
    }

    var uniquecompleteproj = compProjects.filter( onlyUnique );
    var uniqueinterestedproj = interestprojs.filter( onlyUnique );
    try {
      var role = req.body.role;
      var streetaddress = req.body.streetaddress;
      var city = req.body.city;
      var region = req.body.region;
      var zip = req.body.zip;
      var phonenumber = req.body.phonenumber;
      var dateofbirth = req.body.dateofbirth;
    } catch(e) {
      return res.status(400).json({error: 'Some vital inputs not specified!'});
    }
    req.user.role = role;
    req.user.address = [{
      streetaddress: streetaddress,
      city: city,
      region: region,
      zip:zip
    }]
    req.user.phonenumber = phonenumber;
    req.user.dateofbirth = dateofbirth;
    req.user.company = req.body.company;
    req.user.website = req.body.website;
    if(uniquecompleteproj != "undefined" && uniquecompleteproj != null && uniquecompleteproj.length > 0) {
      req.user.completedproject = uniquecompleteproj;
    }
    if(uniqueinterestedproj != "undefined" && uniqueinterestedproj != null && uniqueinterestedproj.length > 0) {
      req.user.interestedproject = uniqueinterestedproj;
    }

    req.user.save(function(error, user) {
      if (error) { return res.status(500).json({error: error.toString() }); }

      var userInfo = setUserInfo(req.user);
      res.status(200).json({user: userInfo });
    })
}

//upload user photo, tried update did not work
exports.uploaduserphoto = [function(req, res, next){
  //if(req.user.picture) {
    //console.log(req.user.picture);
  var dfilename = process.env.userdir + req.user.username + '/' + 'picture*.*';
  services.delfile(dfilename, function(err, files){
    if(err) return res.status(500).send({error: err.toString() });
  //});
//}
  var uploadx = services.upload.single('picture')
  uploadx(req, res, function(err){
    if (err) return res.status(400).send({ error: 'Only image files are allowed!'});

    //req.user.picture = process.env.SERVER_LINK + '/userfiles/' + req.user.username + '/' + req.file.filename;
    var picturerecord = process.env.SERVER_LINK + '/userfiles/' + req.user.username + '/' + req.file.filename;
    //var picturesmallrecord = process.env.SERVER_LINK + '/userfiles/' + req.user.username + '/' + "picture-small.jpg";
    /*req.user.save(function(error, user) {
    if (error) { return res.status(500).json({error: error.toString() }); }
      console.log(req.user.picture);*/

    User.findOneAndUpdate({ username: req.user.username },
      {$set: { picture: picturerecord } }, { new: true },(err, updatedmember) => {
      if (err) return res.status(400).send('Internal Error');
    /*Jimp.read(picturerecord, function (err, picture) {
      if (err) return res.status(500).send({error: err.toString() });
    picture.resize(100, 100)            // resize
      .quality(70)                 // set JPEG quality // set greyscale
      .write(process.env.userdir + req.user.username + '/' +"picture-small.jpg"); // save
    });
    /*services.processpicture(process.env.userdir + req.user.username + '/' + req.user.picture,
      process.env.userdir + req.user.username + '/' +"picture-small.jpg", function(err){
        if(err) return res.status(500).send({ error: 'error with upload try again later'});
      });*/
      //var userInfo = setUserInfo(updatedmember);
      res.status(200).json(updatedmember);
    })
  })
  });
}]

//upload user cv
exports.uploadusercv = [function(req, res, next){
  var uploadx = services.uploadoc.single('cv')
  uploadx(req, res, function(err){
    if (err) return res.status(400).send({ error: 'Only word documets or pdf files are allowed!'});
    console.log(req.file.filename);
  //req.user.cv = req.file.filename;
  req.user.cv = process.env.SERVER_LINK + '/userfiles/' + req.user.username + '/' + req.file.filename;
  //req.user.cv = req.file.filename;
  var nufilname = req.file.filename;
  var tocvicon = nufilname.split(".");
  req.user.cvicon = tocvicon[1];
  console.log(req.user.cvicon);
  req.user.save(function(error, user) {
    if (error) { return res.status(500).json({error: error.toString() }); }

    var userInfo = setUserInfo(req.user);
    //res.status(200).json({user: userInfo });
    res.status(200).json(userInfo);
  })
  })
}]

//upload user coverletter
exports.uploadusercoverletter = [function(req, res, next){
  var uploadx = services.uploadoc.single('coverletter')
  uploadx(req, res, function(err){
    if (err) return res.status(400).send({ error: 'Only word documents or pdf files are allowed!'});

  req.user.coverletter = process.env.SERVER_LINK + '/userfiles/' + req.user.username + '/' + req.file.filename;
  //req.user.coverletter = req.file.filename;
  var nufilname = req.file.filename;
  var tocvicon = nufilname.split(".");
  req.user.coverlettericon = tocvicon[1];
  console.log(req.user.coverlettericon);
  req.user.save(function(error, user) {
    if (error) { return res.status(500).json({error: error.toString() }); }

    var userInfo = setUserInfo(req.user);
    //res.status(200).json({user: userInfo });
    res.status(200).json(userInfo);
  })
  })
}]

//upload companycertificate
exports.uploadusercompanycertificate = [function(req, res, next){
  var uploadx = services.uploadoc.single('companycertificate')
  uploadx(req, res, function(err){
    if (err) return res.status(400).send({ error: 'Only word documets or pdf files are allowed!'});
    console.log(req.file.filename);
  //req.user.cv = req.file.filename;
  req.user.companycertificate = process.env.SERVER_LINK + '/userfiles/' + req.user.username + '/' + req.file.filename;
  //req.user.cv = req.file.filename;
  var nufilname = req.file.filename;
  var tocompanycertificateicon = nufilname.split(".");
  req.user.companycertificateicon = tocompanycertificateicon[1];
  console.log(req.user.companycertificateicon);
  req.user.save(function(error, user) {
    if (error) { return res.status(500).json({error: error.toString() }); }

    var userInfo = setUserInfo(req.user);
    //res.status(200).json({user: userInfo });
    res.status(200).json(userInfo);
  })
  })
}]

//delete any file and update user record... and dynamically update database... working now..
exports.deletefile = [function(req, res, next){
  var query = { username: req.user.username };
  var dfilename = null;
  var fullfilename = req.params.filename.split(".");
  var finame = fullfilename[0];
  //var update = { $set : {}};
  //update.$set[finame] = undefined;

    if(req.user.role == 'user' || req.user.role == 'member' || req.user.role == 'employer'){
        dfilename = '../client/public/userfiles/'+req.user.username+'/'+req.params.filename;
    } else {
        dfilename = '../client/public/img/'+'/'+req.params.filename;
    }
    services.delfile(dfilename, function(err, files){
      if(err) return res.status(500).send({error: err.toString() });
  var updatequery = null;
  if(finame == 'picture') {
    /*xfils = '../client/public/userfiles/'+req.user.username+'/picture-small.jpg'
    services.delfile(xfils, function(err, files){
      if(err) return res.status(500).send({error: err.toString() });
    })*/
    //req.user.picture = undefined;
    updatequery = { $unset: { picture: "" }}
  } else if(finame == 'cv') {
    //req.user.cv = undefined;
    //req.user.cvicon = undefined;
    //updatequery = { $unset: { cv: "", cvicon: "" } }
    updatequery = { $unset: { cv: "" } }
  } else if (finame == 'coverletter') {
    //req.user.coverletter = undefined;
    //req.user.coverlettericon = undefined;
    updatequery = { $unset: { coverletter: "" } }
    //updatequery = { $unset: { coverletter: "", coverlettericon: "" } }
  } else if (finame == 'companycertificate'){
    //req.user.companycertificate = undefined;
    //req.user.companycertificateicon = undefined;
    //updatequery = { $unset: { companycertificate: "", companycertificateicon: "" } }
    updatequery = { $unset: { companycertificate: "" } }
  } else {
    // search project created by user where filename begin with title and remove the
    // filename from the list of project docs.
  }

  User.findOneAndUpdate(query, updatequery, {new: true}, (err, result) => {
    if (err) return err;
    //console.log(result);
    let user = setUserInfo(result);
    res.status(200).json(user);
  });
  /*req.user.save(function(error, user) {
    if (error) { return res.status(500).json({error: error.toString() }); }

    var userInfo = setUserInfo(req.user);
    res.status(200).json(userInfo);
  })*/
  });

}]

/****** edit user skillset ****/
exports.setuserskillset = function(req, res, next){
  try {
      var bigdataNoSQL = req.body.bigdataNoSQL;
      var sqlRDBMS = req.body.sqlRDBMS;
      var microsoftsqlserverACCESS = req.body.microsoftsqlserverACCESS;
      var java = req.body.java;
      var python = req.body.python;
      var csharp = req.body.csharp;
      var php = req.body.php;
      var javascript = req.body.javascript;
      var swift = req.body.swift;
      var cplusplus = req.body.cpluscplus;
      var networking = req.body.networking;
      var linux = req.body.linux;
      var windows = req.body.windows;
      var cloudcomputing = req.body.cloudcomputing;
      var rhapsberrypi = req.body.rhapsberrypi;
      var devices = req.body.devices;
      var games = req.body.games;
      var android = req.body.android;
      var ios = req.body.ios;
      var windowsphone = req.body.windowsphone;
    } catch(e) {
      return res.status(400).json({error: 'Some vital inputs not specified!'});
    }
    req.user.skillset = [{
      bigdataNoSQL: bigdataNoSQL,
      sqlRDBMS: sqlRDBMS,
      microsoftsqlserverACCESS: microsoftsqlserverACCESS,
      java: java,
      python: python,
      csharp: csharp,
      php: php,
      javascript: javascript,
      swift: swift,
      cpluscplus: cplusplus,
      networking : networking,
      linux: linux,
      windows: windows,
      cloudcomputing: cloudcomputing,
      rhapsberrypi: rhapsberrypi,
      devices: devices,
      games: games,
      android: android,
      ios: ios,
      windowsphone: windowsphone
    }]
    req.user.save(function(error, user) {
    if (error) { return res.status(500).json({error: error.toString() }); }

    var userInfo = setUserInfo(req.user);
    res.status(200).json({user: userInfo });
  })
}

//upload company certificate and company number (y-nuss)and update role to employer
//upload user coverletter
exports.uploadcompanycertificate = [function(req, res, next){
  var uploadx = services.uploadcert.single('companycertificate')
  uploadx(req, res, function(err){
    if (err) return res.status(400).send({ error: 'Only word documents, pdf files or image files are allowed!'});

  req.user.companycertificate = req.file.filename;
  req.user.companyIDNumber = req.body.companyID;
  req.user.role = 'employer';
  req.user.save(function(error, user) {
    if (error) { return res.status(500).json({error: error.toString() }); }

    var userInfo = setUserInfo(req.user);
    res.status(200).json({user: userInfo });
  })
  })
}]
//delete file functionality
exports.delfile = [function(req, res, next){
  var dfilename = null;
  var fullfilename = req.params.filename.split(".");
  var finame = fullfilename[0];

    if(req.user.role == 'user' || req.user.role == 'member' || req.user.role == 'employer'){
        dfilename = '../client/public/userfiles/'+req.user.username+'/'+req.params.filename;
    } else {
        dfilename = '../client/public/img/'+'/'+req.params.filename;
    }
    services.delfile(dfilename, function(err, files){
      if(err) return res.status(500).send({error: err.toString() });
    res.status(200).json({message: 'deleted'});
    })
}]

//other queries like get a users, all whitelisted users, get a user by id,
//update a user to blacklisted n back, user with certain expertise..e.g skillset
//and other functionalities can be developed to
exports.updateuserole = [function(req, res, next){
  var username = req.params.username;
  var userrole = req.body.role;
  console.log(userrole);
  User.findOneAndUpdate({username: username},
      {$set: {role: userrole}}, { new: true },(err, updatedmember) => {
    if (err) return res.status(500).send({ error : err.toString() });
    res.status(200).json({user: updatedmember });

})
}]
//apply for a project
exports.applyForProject = function(req, res, next) {
    Project.findOne({ "_id": req.params.projectId, "applicantsList": { $in : [ req.user._id ]}}, function(err, cproject) {
        if (err){ return res.status(500).send({error: err.toString()});  }
        if(!cproject) {
            Project.findByIdAndUpdate({"_id": req.params.projectId}, { $inc : { numofapplicants: 1}, $addToSet: { applicantsList: req.user._id  }
                }, { new: true } ).exec(function(err, project) {
                if (err){ return res.status(500).send({error: err.toString()}); }
                if(project) { res.status(201).json({message: 'Project application succesfull'}) };
            })
        }
     else {
        res.status(400).json({message: 'You already applied for this Project'})
    }
    })
}
//get all my offered projects { $in : [ req.user._id ]}
exports.getUserOfferedProject = function(req, res, next) {
  var userid = req.user._id;
  console.log(userid);
  //Project.find({'offeredTo':userid, 'status': 'offered'}).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
    Project.find({'offeredTo':userid, 'status': 'offered'}, function(err, projects) {
        if (err){ return res.status(500).send({error: err.toString()}); }
        if(!projects.length) { return res.status(201).send({message: req.user.username+' You have no Offered project'});  }
        res.status(200).json(projects);
  })
}
//user can also accept offer.
exports.acceptProjectOffer = function(req, res, next) {
    Project.findOne({'awardedTo': req.user._id, status: {$in:['awarded', 'ongoing']} }, function(err, checker) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        if (checker) {
            res.status(201).json( { message: 'You are not able to accept another Project'} );
        }
    Project.findOne({ "_id": req.params.projectid }, { projecttype: 1, awardedTo: 1 }, function(err, proj) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        if ((proj.awardedTo != "undefined" && proj.awardedTo != null && proj.awardedTo.length > 0) && proj.projecttype == 'individual') {
            res.status(201).json( { message: 'Project already awarded'} );
        } else if ((proj.awardedTo == "undefined" || proj.awardedTo == null || proj.awardedTo.length < 1) && proj.projecttype == 'individual' ) {
            Project.findByIdAndUpdate({"_id": req.params.projectid}, { $set : {'status': 'awarded'},
                $addToSet: { awardedTo: req.user._id}
            }, { new: true } ).exec(function(err, projects) {
            if (err){ return res.status(500).send({error: err.toString()}); }
            res.status(201).json({message: 'Project succesfully awarded'});
        })
        } else {
            /*Project.findOneAndUpdate({"_id": req.params.projectid}, { $addToSet : { awardedTo: req.params.userid}
            }, { new: true } ).exec(function(err, project) {
            if (err){ return res.status(500).send({error: err.toString()}); }
            res.status(201).json({message: 'Project succesfully awarded'});
        })*/
        res.status(201).json({message: 'You cannot accept a team Project'});
    }
    //Project.find({"_id": req.params.projectid, "awardedTo": {$ne : null} }, function(err, project) {
    })
    })
}
//get all my awarded projects
exports.getUserAwardedProject = [function(req, res, next) {
  Project.find({"awardedTo._id": req.user._id , "status": "awarded"}).populate('postedBy').sort({datepublished: -1}).exec(function(err, projects) {
        if (err){ return res.status(500).send({error: err.toString()}); }
        if(!projects) { return res.status(200).send({message: 'You have no awarded project'});  }
        res.status(200).json(projects);
  })
}]
//get all ongoing project
exports.getUserOngoingProject = [function(req, res, next) {
  Project.find({awardedTo: { $in : [ req.user._id ]} , status: 'ongoing'}).populate('postedBy').sort({datepublished: -1}), function(err, projects) {
        if (err){ return res.status(500).send({error: err.toString()}); }
        if(!projects) { return res.status(204).send({message: 'You have no Ongoing project'});  }
        res.status(200).json(projects);
  }
}]
//get all my finished.
exports.getUserFinishedProject = [function(req, res, next) {
  Project.find({awardedTo: { $in : [ req.user._id ]} , status: 'finished'}).populate('postedBy').sort({datepublished: -1}), function(err, projects) {
        if (err){ return res.status(500).send({error: err.toString()}); }
        if(!projects) { return res.status(204).send({message: 'You have no Finished project'});  }
        res.status(200).json(projects);
  }
}]
//give your completed project feedback
exports.giveProjectFeedback = [function(req, res, next) {
  Project.findOne({id: rea.params.id, $or: [{'offeredTo': { $in: [ user._id]}}, {'awardedTo': { $in: [ user._id ] } } ], status: 'finished'}), function(err, project) {
        if (err){ return res.status(500).send({error: err.toString()}); }
        if(!project) { return res.status(204).send({message: 'You can not give Feedback on this project'});  }
        if (req.user.role == 'member') {
          project.awardeefeedback = req.body.feedback;
          project.save(function(err) {
            res.status(201).json(project);
          })
        } else {
          project.employerfeedback = req.body.feedback;
          project.save(function(err) {
            res.status(201).json(project);
          })
        }
        //res.status(200).json(project);
  }
}]
