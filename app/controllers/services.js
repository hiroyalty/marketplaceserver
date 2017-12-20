'use strict'
require('dotenv').config()
const nodemailer = require('nodemailer');
var crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const glob = require('glob');
const path = require('path');
var Jimp = require('jimp');
var mkdirp = require('mkdirp');

//for emailing services. // we can use other services like metropolia.fi
exports.transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE_STATUS, // secure:true for port 465, secure:false for port 587
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.processpicture = function(dfile, tfile, callback){
    Jimp.read( dfile, function (err, picture) {
    if (err) throw err;
    picture.resize(100, 100)            // resize
         .quality(70)                 // set JPEG quality // set greyscale
         .write(tfile + '/' +"picture-small.jpg"); // save
    });
    callback(null, true);
}

exports.gentoken = function(tokin){
    crypto.randomBytes(20, function(err, buf) {
        if(err) return err;
        //var token = buf.toString('hex');
        tokin = buf.toString('hex');
    return tokin;
});
}

//exports.deletefile = function (dfilename,callback) {
exports.delfile = function (dfilename,callback) {
	glob(dfilename, (err,files) => {
	//if (err) throw err;
    if (err) return cb(err, false);
		files.forEach((item,index,array) => {
		console.log(item + " found");
	});
	// Delete files
	files.forEach((item,index,array) => {
		fs.unlink(item, (err) => {
        //if (err) throw err;
        if (err) return cb(err, false);
        console.log(item + " deleted");
		});
	});
    });
    callback(null, true);
};

/*************for multer image upload***********************/
//dynamic image destination set up multer
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var dest = null;
        if(req.user.role == 'user' || req.user.role == 'member' || req.user.role == 'employer'){
            dest = '../client/public/userfiles/' + req.user.username;
        } else {
            dest = '../client/public/img';
        }
      var stat = null
      try {
        stat = fs.statSync(dest);
      } catch (err) {
        fs.mkdirSync(dest);
      }
      if (stat && !stat.isDirectory()) {
            throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
      }
      callback(null, dest);
    },
    filename: (req, file, callback) => {
      //var filenamesplit = file.originalname.split("."); //path.extname(file.originalname)
      callback(null, file.fieldname + path.extname(file.originalname) ); //set the file name and extension
    }
});

var storageprojectupload = multer.diskStorage({
    destination: (req, file, callback) => {
        var dest = null;
        var las = req.params.title;
            las = las.replace(/\s/g,'');
        if(req.user.role == 'member' || req.user.role == 'employer' || req.user.role == 'admin' || req.user.role == 'manager'){

            var resDir = '../client/public/userfiles';
            //dest = '../client/public/userfiles/' + req.user.username + '/projects/' + req.body.title.trim();
            dest = path.join(resDir, req.user.username);
            //dest = path.join(resDir, req.user.username, 'projects', las );
            //mkdirp(dest);
        } else {
            dest = '../client/public/img';
        }
      var stat = null
      try {
        //stat = fs.stat(dest);
        stat = fs.statSync(dest);
        //stat = mkdirp(dest);
      } catch (err) {
        //fs.mkdir(dest);
        fs.mkdirSync(dest);
        //mkdirp(dest);
      }
      if (stat && !stat.isDirectory()) {
            throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
      }
      callback(null, dest);
    },
    filename: (req, file, callback) => {
        var las = req.params.title;
            las = las.replace(/\s/g,'');
      //callback(null, las + '-' +file.fieldname + path.extname(file.originalname)); //set the file name and extension
      callback(null, las + '-' +file.originalname);
    }
});

// filter for image
const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
//filter for document
const documentFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(doc|docx|pdf|ppt)$/)) {
        return cb(new Error('Only word documents or pdf files are allowed!'), false);
    }
    cb(null, true);
};

//filter for certifcate
const certFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(doc|docx|pdf|ppt|jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only word documents, pdf files or image files are allowed!'), false);
    }
    cb(null, true);
};

exports.upload = multer({ storage: storage, fileFilter: imageFilter});
exports.uploadoc = multer({storage: storage, fileFilter: documentFilter}); //const upload = multer({storage: storage});
exports.uploadcert = multer({storage: storage, fileFilter: certFilter});
//exports.uploadprojectimage = multer({storage: storageprojectupload, filter: imageFilter}).fields([{name:'projectdocfirst', maxCount:1},{name:'projectdocsecond', maxCount:1},{name:'projectdocthird', maxCount:1}]);
exports.uploaddouble = multer({storage: storageprojectupload, filter: certFilter}).array('projectdoc[]', 4);
exports.uploadprojectimage = multer({storage: storageprojectupload, filter: imageFilter});
/************************MULTER ENDS ************************************/
