require('dotenv').config();
require('extend-error');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var multer = require('multer');
var InterestedProject = require('../models/interestedprojects');
var bcrypt   = require('bcrypt-nodejs');
const _ = require('lodash');
var crypto = require('crypto');
var passport = require('passport');
var services = require('./services.js');
//var errorhandle = require('./handlerror');
//var CustomError = require('./handlerror');
var uploadver = multer({ dest: '../client/public/' });
const fs = require('fs');

const nodemailer = require('nodemailer');
var authConfig = require('../../config/auth');

var AppError = Error.extend('AppError', 500);
var ClientError = Error.extend('ClientError', 400);

var HttpNotFound = ClientError.extend('HttpNotFound', 404);
var HttpUnauthorized = ClientError.extend('HttpUnauthorized', 401);

var myHttpNotFound = new HttpNotFound('End point do not exist, check and correct');
var myLoginError = new ClientError('Invalid Username and/or Password');


function generateToken(user){
  return jwt.sign(user, authConfig.secret, {
    expiresIn: 10080
  });
}

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
    prooracle: request.prooracle,
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
  }
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

exports.login = function(req,res,next) {
  passport.authenticate('local', function(err,user) {
    if(!user)
      //return res.status(errorhandle.myLoginError.code).json(errorhandle.myLoginError.message);
      return res.status(myLoginError.code).json(myLoginError.message);
    //console.log(user);
    if(user) {
      //res.send('Skeet skeet!');
      let userInfo = setUserInfo(user);

      var query = { username: userInfo.username };
      //console.log(query);
      InterestedProject.findOne(query, (err, projectinterest) => {
        if (err) return err;
        //console.log(projectinterest);
      if(!projectinterest) {
        InterestedProject.create({ username : userInfo.username, projectdatabase : true,
          projectprogramming : true, projectweb : true, projectmobile : true}, function(err, interestprojet) {
            if (err) {  return err;  } //res.send(err);
            //InterestedProject.findOne({userid: req.user._id}, function(err, intproject) {
                //if (err){ return err; } //res.send(err);
                let userintproject = setUserPrefInfo(interestprojet);
                res.status(200).json({
                    token: 'jwt ' + generateToken(userInfo)
                    ,user: userInfo
                    ,userPrefs: userintproject
                  });
                //res.status(200).json(userintproject);
            //});
        });
      } else {
        let userintproject = setUserPrefInfo(projectinterest);
        res.status(200).json({
            token: 'jwt ' + generateToken(userInfo)
            ,user: userInfo
            ,userPrefs: userintproject
          });
      }
      });

    }
  })(req,res,next);
}

/*exports.login = function(req, res, next){
    let userInfo = setUserInfo(req.user);
    console.log(userInfo);
      res.status(200).json({
          token: 'Bearer ' + generateToken(userInfo)
          ,user: userInfo
      });
}*/

exports.lilupload = multer({ dest: '../client/public/' }).single('avatar'), function (req, res, next) {
  console.log(req.parmas);
  console.log(req.file);
  res.status(200).json('uploaded');
};

exports.getfiles = function(req, res, next){
  files = fs.readdirSync('../client/public/');
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist);
    }
    else {
      filelist.push(file);
    }
  //});
  console.log(filelist);
  //return filelist;
  /*fs.readdir('../client/public/', (err, files) => {
  files.forEach(file => {
    console.log(file);
  });*/
  res.status(200).json(filelist);
});
}

exports.register = function(req, res, next){

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var role = req.body.role;

    if(!username){ return res.status(422).json('You must enter a username'); }

    if(!email){ return res.status(422).json('You must enter an email address'); }

    if(!password){ return res.status(422).json('You must enter a password'); }

    if(!firstname){ return res.status(422).json('You must enter your firstname'); }

    if(!lastname){ return res.status(422).json('You must enter your lastname'); }

    //User.findOne({email: email}, function(err, existingUser){ //
    User.findOne({ $or: [{ email:email}, { username: username}]}, function(err, existingUser){
        if(err){ return next(err); }

        if(existingUser){ return res.status(422).json('The Username or email address is already in use'); }

        var user = new User({
            username: username,
            email: email,
            password: password,
            firstname: firstname,
            lastname: lastname,
            role: role
        });
        // send confirmation email
        var url = (process.env.EMAIL_URL || "https://localhost:4200");
        var mailOptions = {
        from: '"Admin Market Place" <gbolaga.famodun@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Market Place Account Confirmation', // Subject line
        text: 'Hello , click on the link below to confirm your account', // plain text body
        html: '<b>Hello '+ firstname +' </b>'+
                '<p>You are receiving this mail because you (or someone else) have just signed up to use the Market Place platform.</p>' +
                '<p>Please click on the following link, or paste this into your browser to complete the process:<p>' +
                '<p>'+ url + '/confirmaccount/' + 'Member/' + username + '<p/>'+
                '<p>If you did not request this, please ignore this email.\n</p>'+
                '<p>Regards,</p>'
        };
        services.transporter.sendMail(mailOptions, (error, info) => {
          if (error) { return console.log(error); }
        });
        user.save(function(err, user){
            if(err){ return next(err); }

            var userInfo = setUserInfo(user);
            //token: 'JWT ' + generateToken(userInfo),
            res.status(201).json({
                token: 'jwt ' + generateToken(userInfo),
                user: userInfo
            })
        });
    });
}

// For password update, if verified we send email to the given mail. 195.148.98.148, 10.112.223.3
exports.verifyemail = function(req,res,next){
    var email = req.body.email;

    var utoken = null

    crypto.randomBytes(20, function(err, buf) {
        if(err) return err;
        utoken = buf.toString('hex');

    User.findOneAndUpdate({email: email},
        {$set: { resetpasswordtoken: utoken, resetpasswordexpires: Date.now()+3600000 }}, { new: true },(err, existingUser) => {
            if (err) return res.status(500).json('Internal Server Error: Operation Failed');
            if(!existingUser) return res.status(400).json('This email does not exist on the Platform');

    var url = (process.env.EMAIL_URL || "http://localhost:4200"); // \
    var mailOptions = {
    from: '"Admin Market Place" <gbolaga.famodun@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Market Place Password Reset', // Subject line
    text: 'Hello , click on the link below to update your password', // plain text body
    html: '<b>Hello '+ existingUser.username +' </b>'+
            '<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>' +
            '<p>Please click on the following link, or paste this into your browser to complete the process:<p>' +
            '<p>'+ url + '/resetpassword/' + utoken + '<p/>'+
            '<p>If you did not request this, please ignore this email and your password will remain unchanged.\n</p>'+
            '<p>Regards,</p>'
    };
    // send mail with defined transport object
    services.transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    //res.send({status: 200, success: true, message: 'Email sent successfully' });
    res.status(200).json('Email sent successfully');
    });

    });
    })
}

exports.resetpassword = function(req, res, next){
    var tokenid = req.body.utoken;
    var updatedpass = req.body.password;

    User.findOne({ resetpasswordtoken: tokenid, resetpasswordexpires: { $gt: Date.now() } }, function(err, user) {
      if(err) { res.status(500).json('Operation Failed')}
    if (!user) {
      res.status(400).json({ error: 'Password reset token is invalid or has expired.'});
    } else {

    var SALT_FACTOR = 5;
     bcrypt.genSalt(SALT_FACTOR, function(err, salt){
      if(err){ return next(err); }
      bcrypt.hash(updatedpass, salt, null, function(err, hash){
        if(err){ return next(err);  }
      User.findOneAndUpdate({resetpasswordtoken: tokenid},
        {$set: { password: hash } }, { new: true },(err, updatedmember) => {
          if (err) {return res.status(500).json({ error : err.toString() });}
          var userInfo = setUserInfo(updatedmember);
          //token: 'JWT ' + generateToken(userInfo),
          res.status(201).json({
              token: 'jwt ' + generateToken(userInfo),
              user: userInfo
          })
          //res.status(200).json({success: true, message: 'password update successful'});
      });
      });
    });
    }
    });
}

exports.confirmaccount = function(req,res,next){
    var category = req.params.category;
    var username = req.params.username;

    User.findOneAndUpdate({username: username}, {$set: { role: category }}, { new: true },(err, existingUser) => {
      if (err) return res.status(500).json({ error : err.toString() });
      if(existingUser) {
        InterestedProject.findOneAndUpdate({ username : username}, { $set : { projectdatabase:true,
          projectprogramming:true, projectweb:true, projectmobile:true }}, { new: true }, (err, interestprojet) => {
            if (err) return res.status(500).json({ error : err.toString() });
            res.status(200).json('Your Account is now Confirmed');
          });
        }
  });
}

exports.roleAuthorization = function(roles){

    return function(req, res, next){

        var user = req.user;

        User.findById(user._id, function(err, foundUser){

            if(err){
                res.status(422).json({error: 'No user found.'});
                return next(err);
            }
            if((roles.indexOf(foundUser.role) > -1) & foundUser.status == 'whitelisted'){
                return next();
            }
            res.status(401).json('You are not authorized to view this content');
            return next('Unauthorized');
        });
    }
}

exports.onlyNotEmpty = function(req, res, next){
  return function(req, res, next){
    const out = {};
    _(req.body).forEach((value, key) => {
        if (!_.isEmpty(value)) {
            out[key] = value;
        }
    });

    req.bodyNotEmpty = out;
    next();
  }
}
