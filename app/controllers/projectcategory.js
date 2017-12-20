var ProjectCategory = require('../models/projectcategory');

exports.getProjectCategory = function(req, res, next){
  ProjectCategory.find(function(err, projectcategories) {
    if (err){
      res.send(err);
    }
    res.status(200).json(projectcategories);
  });
}

exports.getProjectCategoryById = function(req, res, next){
    ProjectCategory.findOne({"_id": req.params.id}, function(err, projects) {
        if (err){
            res.send({ error : err.toString() });
        }
        if (!projects) return res.status(404).send("No Project found.");
        res.status(200).json(projects);
    });
}

exports.createProjectCategory = function(req, res, next){
  var pctitle = req.body.pctitle;
  var pcdescription = req.body.pcdescription;
  var subcategories = req.body.subcategories;

  ProjectCategory.findOne({ pctitle: pctitle}, function(err, existingCategory){
      if(err){ return res.status(500).send({error: err.toString()}); }

      if(existingCategory){ return res.status(422).json('The Category Already exist'); }

  var projectcategory = new ProjectCategory({
     pctitle: pctitle,
     pcdescription: pcdescription,
     subcategories: subcategories
   });
   projectcategory.save(function(err, projectcategory){
      if(err){ return res.status(500).send({error: err.toString()}); }
   })
 })
    ProjectCategory.find(function(err, projectcategories) {
      if (err){
          res.send(err);
      }
      res.status(200).json(projectcategories);
    });
}

//_id : req.params.todo_id
exports.deleteProjectCategory = function(req, res, next){
  ProjectCategory.remove({ pctitle: req.params.id }, function(err, projectcategory) {
    if(err) {
      return res.status(500).send({error: err.toString()});
    }
    res.status(200).json('Project Category Succesfully deleted');
  });
}

exports.addProjectSubCategory = function(req, res, next) {
  if(req.body.subcategory instanceof Array) {
    ProjectCategory.update({ title: req.body.title },
      { $addToSet: { subcategory: { $each: [ req.body.subcategory ] } } },
      function(err, projectcategory) {
        if(err) {  return res.status(500).send({error: err.toString()});  }
        res.status(200).json('Project Category Succesfully updated');
      });
  }
  ProjectCategory.update({ title: req.body.title },
    { $addToSet: { subcategory: req.body.subcategory } },
    function(err, projectcategory) {
      if(err) {  return res.status(500).send({error: err.toString()});  }
      res.status(200).json('Project Subcategory Succesfully updated');
    });
}

exports.deleteProjectSubCategory = function(req, res, next) {
  ProjectCategory.update({ title: req.body.title },
    { $pull: { subcategory: { $in: [ req.body.subcategory ] } } },
    function(err, projectcategory) {
      if(err) {  return res.status(500).send({error: err.toString()});  }
      res.status(200).json('Project Subcategory Succesfully removed');
  });
}
