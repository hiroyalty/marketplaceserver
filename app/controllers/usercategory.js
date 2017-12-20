var UserCategory = require('../models/usercategory');

exports.getUserCategory = function(req, res, next){
  UserCategory.find(function(err, usercategories) {
    if (err){
      res.send(err);
    }
    res.status(200).json(usercategories);
  });
}

exports.getOneUserCategory = function(req, res, next){
    UserCategory.findOne({"title": req.params.title}, function(err, usercategory) {
        if (err){
            res.send({ error : err.toString() });
        }
        if (!usercategory) return res.status(404).send("No User Category found.");
        res.status(200).json(usercategory);
    });
}

exports.createUserCategory = function(req, res, next){
  var title = req.body.title;
  var description = req.body.description;

  UserCategory.findOne({ title: title}, function(err, existingCategory){
      if(err){ return res.status(500).send({error: err.toString()}); }

      if(existingCategory){ return res.status(422).json('The Category Already exist'); }

  var usercategory = new UserCategory({
     title: title,
     description: description
   });
   usercategory.save(function(err, usercategory){
      if(err){ return res.status(500).send({error: err.toString()}); }
   })
 })
  UserCategory.find(function(err, usercategories) {
    if (err){ res.send(err);  }
    res.status(200).json(usercategories);
  });
}

exports.deleteUserCategory = function(req, res, next){
  UserCategory.remove({ title: req.params.id }, function(err, projectcategory) {
    if(err) {
      return res.status(500).send({error: err.toString()});
    }
    res.status(200).json('Project Category Succesfully deleted');
  });
}

exports.addProjectSubCategory = function(req, res, next) {
  if(req.body.subcategory instanceof Array) {
    UserCategory.update({ title: req.body.title },
      { $addToSet: { subcategory: { $each: [ req.body.subcategory ] } } },
      function(err, projectcategory) {
        if(err) {  return res.status(500).send({error: err.toString()});  }
        res.status(200).json('Project Category Succesfully updated');
      });
  }
  UserCategory.update({ title: req.body.title },
    { $addToSet: { subcategory: req.body.subcategory } },
    function(err, projectcategory) {
      if(err) {  return res.status(500).send({error: err.toString()});  }
      res.status(200).json('Project Subcategory Succesfully updated');
    });
}

exports.deleteProjectSubCategory = function(req, res, next) {
  UserCategory.update({ title: req.body.title },
    { $pull: { subcategory: { $in: [ req.body.subcategory ] } } },
    function(err, projectcategory) {
      if(err) {  return res.status(500).send({error: err.toString()});  }
      res.status(200).json('Project Subcategory Succesfully removed');
  });
}
