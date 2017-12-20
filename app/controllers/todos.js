var Todo = require('../models/todo');
var multer = require('multer');
const fs = require('fs');

exports.getTodos = function(req, res, next){
    Todo.find(function(err, todos) {
        if (err){
            res.send(err);
        }
        //res.json(todos);
        res.status(200).json(todos);
    });

}

exports.createTodo = function(req, res, next){
    Todo.create({ title : req.body.title}, function(err, todo) {
        if (err){
            res.send(err);
        }
        Todo.find(function(err, todos) {
            if (err){
                res.send(err);
            }
            res.json(todos);
        });
    });
}

exports.deleteTodo = function(req, res, next){
    Todo.remove({ _id : req.params.todo_id }, function(err, todo) {
        res.json(todo);
    });
}

exports.lilupload = [function(req, res, next){
    //var uploadx = multer({ dest: '../client/public/' }).single('avatar')
    console.log(req.file);
    var uploadx = multer({ dest: '../client/public/' }).single('avatar')
    uploadx(req, res, function(err){
    console.log(req.parmas);
    console.log(req.file);
    res.status(200).json('uploaded');
  })
}]

exports.getfiles = function(req, res, next){
  var filelist = [];
  fs.readdir('../client/public/', (err, files) => {
  files.forEach(file => {
    //console.log(file);
    if (fs.statSync('../client/public' + '/' + file).isDirectory()) {
      //filelist = walkSync('../client/public' + '/' + file, filelist);
    }
    else {
      filelist.push(file);
    }
  });
  res.status(200).json(filelist);
})
}
