const moment = require('moment');
const glob = require('glob');
var FrontBanner = require('../models/frontbanner');
var User = require('../models/user');
var services = require('./services.js');
const fs = require('fs');

function setBannerInfo(request){
    return {
      _id: request._id,
      btitle: request.btitle,
      bdescription: request.bdescription,
      imageLink: request.imageLink
    }
}

exports.getFrontBanner = function(req, res, next){
    FrontBanner.findOne( function(err, banner) {
        if (err){
            res.send({ error : err.toString() });
        }
        if (!banner) return res.status(404).send("No Banner found.");
        res.status(200).json(banner);
    });
}

exports.createBanner = function(req, res, next){
  var fbtitle = req.body.btitle;
  var fbdescription = req.body.bdescription;
  console.log(fbtitle)
  var frontbanner = new FrontBanner({
     btitle: fbtitle,
     bdescription: fbdescription
   });
   frontbanner.save(function(err, frontbanner){
      if(err){ return res.status(500).send({error: err.toString()}); }
   })
  FrontBanner.findOne(function(err, frontbanners) {
    if (err){
        res.send(err);
    }
    res.status(200).json(frontbanners);
  });
}

exports.updateBanner = function(req, res, next) {
  var query = { _id: req.params.bannerid };
  console.log(query);
  console.log(req.body);
  console.log(req.bodyNotEmpty);
  //User.findOneAndUpdate(query, { $set: req.body }, options, callback);
  FrontBanner.findOneAndUpdate(query, { $set: req.body }, {new: true}, (err, result) => {
    if (err) return err;
    console.log(result);
    let banner = setBannerInfo(result);
    res.status(200).json(banner);
  });
}

exports.uploadbannerImage = [function(req, res, next){
  console.log(req.params.btitle);
  var uploadx = services.adminuploadimage.single('imageLink')
  uploadx(req, res, function(err){
    if (err) return res.status(400).send({ error: 'Only image files are allowed!'});

  var imagedlink = process.env.SERVER_LINK + '/img/banner/' + req.file.filename;

  FrontBanner.findOneAndUpdate({"btitle" : req.params.btitle}, { $set: { imageLink: imagedlink }},
  { new: true } ).exec(function(err, banner) {
    if (err){
        return res.status(500).send({error: err.toString()});
    }
    //var newbanner = setBannerInfo(banner);
    res.status(200).json(banner);
  })
});
}]

exports.updatebannerImage = [function(req, res, next){
  console.log(req.params.btitle);
  console.log(req.params.imagename);

  var filenamed = '../client/public/img/banner/';
  var dfilename = filenamed + req.params.imagename;
  console.log(dfilename);

  //services.delfile(dfilename, function(err, files){
    //if(err) return res.status(500).send({error: err.toString() });
  var uploadx = services.adminuploadimage.single('imageLink')
  uploadx(req, res, function(err){
    if (err) return res.status(400).send({ error: 'Only image files are allowed!'});

  var imagedlink = process.env.SERVER_LINK + '/img/banner/' + req.file.filename;

  FrontBanner.findOneAndUpdate({"btitle": req.params.btitle}, { $set: { imageLink: imagedlink }},
  { new: true } ).exec(function(err, banner) {
    if (err){
        return res.status(500).send({error: err.toString()});
    }
    //var newbanner = setBannerInfo(banner);
    res.status(200).json(banner);
  })
  });
//});
}]
