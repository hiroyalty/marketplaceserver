var AuthenticationController = require('./controllers/authentication'),
    UserController = require('./controllers/users'),
    TodoController = require('./controllers/todos'),
    ProjectController = require('./controllers/projects'),
    ProjectCategoryController = require('./controllers/projectcategory'),
    UserCategoryController = require('./controllers/usercategory'),
    BannerController = require('./controllers/frontbanner'),
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');

var requireAuth = passport.authenticate('jwt', {session: false});
    //requireLogin = passport.authenticate('local', {session: false, failureFlash: 'Invalid Credentials'});

  function handleError(err,req,res,next){
      var output = {
          error: {
              name: err.name,
              message: err.message,
              text: err.toString()
          }
      };
      var statusCode = err.status || 500;
      res.status(statusCode).json(output);
  }

module.exports = function(app){

    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        userRoutes = express.Router(),
        todoRoutes = express.Router(),
        projectcategoryRoutes = express.Router(),
        usercategoryRoutes = express.Router(),
        projectRoutes = express.Router(),
        bannerRoutes = express.Router()

    // Auth Routes
    apiRoutes.use('/auth', authRoutes);

    authRoutes.post('/register', AuthenticationController.register);

    authRoutes.get('/confirmaccount/:category/:username', AuthenticationController.confirmaccount);

    authRoutes.post('/verifyemail', AuthenticationController.verifyemail);

    authRoutes.post('/resetpassword', AuthenticationController.resetpassword);

    authRoutes.post('/fileupload', AuthenticationController.lilupload);

    authRoutes.get('/allimages', AuthenticationController.getfiles);
    //authRoutes.post('/login', requireLogin, AuthenticationController.login );
    authRoutes.post('/login', AuthenticationController.login );

    authRoutes.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });

    // UserCategory Routes
    apiRoutes.use('/usercategory', usercategoryRoutes);

    usercategoryRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['admin']), UserCategoryController.getUserCategory);

    usercategoryRoutes.get('/getone/:title', requireAuth, AuthenticationController.roleAuthorization(['admin']), UserCategoryController.getOneUserCategory);

    usercategoryRoutes.post('/create', requireAuth, AuthenticationController.roleAuthorization(['admin']), UserCategoryController.createUserCategory);

    usercategoryRoutes.delete('/:id', requireAuth, AuthenticationController.roleAuthorization(['admin']), UserCategoryController.deleteUserCategory);
    // ProjectCategory Routes
    apiRoutes.use('/projectcategory', projectcategoryRoutes);

    //projectcategoryRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['member','employer','manager','admin']), ProjectCategoryController.getProjectCategory);

    projectcategoryRoutes.get('/', ProjectCategoryController.getProjectCategory);

    projectcategoryRoutes.get('/getone/:id', requireAuth, AuthenticationController.roleAuthorization(['admin']), ProjectCategoryController.getProjectCategoryById);

    projectcategoryRoutes.post('/create', requireAuth, AuthenticationController.roleAuthorization(['admin']), ProjectCategoryController.createProjectCategory);

    projectcategoryRoutes.delete('/:id', requireAuth, AuthenticationController.roleAuthorization(['admin']), ProjectCategoryController.deleteProjectCategory);

    projectcategoryRoutes.post('/addprjsubcate/:title', requireAuth, AuthenticationController.roleAuthorization(['admin']), ProjectCategoryController.addProjectSubCategory);

    projectcategoryRoutes.get('/deleteprjsubcate/:title/:subcategory', requireAuth, AuthenticationController.roleAuthorization(['admin']), ProjectCategoryController.deleteProjectSubCategory);

    // Todo Routes
    apiRoutes.use('/todos', todoRoutes);

    //todoRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['user', 'member', 'employer', 'admin']), TodoController.getTodos);
    todoRoutes.post('/fileupload', TodoController.lilupload);

    todoRoutes.get('/getimages', TodoController.getfiles);

    todoRoutes.get('/', TodoController.getTodos);

    todoRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['employer','admin']), TodoController.createTodo);
    todoRoutes.delete('/:todo_id', requireAuth, AuthenticationController.roleAuthorization(['admin']), TodoController.deleteTodo);

    //user details routes
    apiRoutes.use('/users', userRoutes);

    userRoutes.get('/getallusers', requireAuth, AuthenticationController.roleAuthorization(['admin']), UserController.getAllUser);

    userRoutes.get('/getuser/:id', requireAuth, AuthenticationController.roleAuthorization(['member', 'employer', 'admin']), UserController.getUser);

    userRoutes.delete('/remove/:id', requireAuth, AuthenticationController.roleAuthorization(['admin']), UserController.deleteUser);

    userRoutes.put('/update', requireAuth, AuthenticationController.roleAuthorization(['member', 'employer', 'admin']), AuthenticationController.onlyNotEmpty(), UserController.updateuser);

    userRoutes.patch('/adminUpdateUser/:id', requireAuth, AuthenticationController.roleAuthorization(['employer', 'admin']), AuthenticationController.onlyNotEmpty(), UserController.adminUpdateUser);

    userRoutes.put('/updateprefs/:id', requireAuth, AuthenticationController.roleAuthorization(['member', 'employer', 'admin']), AuthenticationController.onlyNotEmpty(), UserController.updateuserprojectprefs);

    //userRoutes.get('/projectprefs/:id', requireAuth, AuthenticationController.roleAuthorization(['member', 'employer', 'admin']), UserController.getuserprojectprefs);

    userRoutes.post('/updatepassword', requireAuth, AuthenticationController.roleAuthorization(['member', 'employer', 'admin']), AuthenticationController.onlyNotEmpty(), UserController.updatepassword);

    userRoutes.get('/projectprefs/:id', UserController.getuserprojectprefs);

    //userRoutes.post('/uploadpicture', UserController.uploaduserphoto);

    userRoutes.post('/uploadpicture', requireAuth, AuthenticationController.roleAuthorization(['user', 'member', 'employer', 'admin']), UserController.uploaduserphoto);

    userRoutes.post('/uploadcv', requireAuth, AuthenticationController.roleAuthorization(['user', 'member', 'employer', 'admin']), UserController.uploadusercv);

    userRoutes.post('/uploadcoverletter', requireAuth, AuthenticationController.roleAuthorization(['user', 'member', 'employer', 'admin']), UserController.uploadusercoverletter);

    userRoutes.post('/uploadcompanycerticate', requireAuth, AuthenticationController.roleAuthorization(['user', 'member', 'employer', 'admin']), UserController.uploadusercompanycertificate);

    userRoutes.delete('/deletefile/:filename', requireAuth, AuthenticationController.roleAuthorization(['user', 'member', 'employer', 'admin']), UserController.deletefile);

    userRoutes.get('/delfile/:filename', requireAuth, AuthenticationController.roleAuthorization(['user', 'member', 'employer', 'admin']), UserController.delfile);

    userRoutes.post('/setmemberskillset', requireAuth, AuthenticationController.roleAuthorization(['member', 'employer', 'admin']), UserController.setuserskillset);

    userRoutes.post('/updateuserole/:username', requireAuth, AuthenticationController.roleAuthorization(['user', 'member', 'manager', 'admin']), UserController.updateuserole);

    userRoutes.get('/applyforproject/:projectId', requireAuth, AuthenticationController.roleAuthorization(['member', 'employer','manager', 'admin']), UserController.applyForProject);

    userRoutes.get('/userofferedproject', requireAuth, AuthenticationController.roleAuthorization(['member', 'employer','manager', 'admin']), UserController.getUserOfferedProject);

    userRoutes.get('/userawardedproject', requireAuth, AuthenticationController.roleAuthorization(['member', 'employer','manager', 'admin']), UserController.getUserAwardedProject);

    userRoutes.get('/useracceptproject/:projectid', requireAuth, AuthenticationController.roleAuthorization(['member', 'employer','manager', 'admin']), UserController.acceptProjectOffer);

    //Project Routes
    apiRoutes.use('/projects', projectRoutes);

    projectRoutes.post('/create', requireAuth, AuthenticationController.roleAuthorization(['employer','manager', 'admin']), ProjectController.createproject);

    projectRoutes.post('/loadimage/:title', requireAuth, AuthenticationController.roleAuthorization(['employer','manager', 'admin']), ProjectController.loadprojectimage);

    projectRoutes.post('/updateimage/:title/:imagename', requireAuth, AuthenticationController.roleAuthorization(['employer','manager', 'admin']), ProjectController.updateprojectimage);

    projectRoutes.post('/checktitle', requireAuth, AuthenticationController.roleAuthorization(['employer','manager', 'admin']), ProjectController.checkforuniquetitle);

    projectRoutes.post('/loadfiles/:title', requireAuth, AuthenticationController.roleAuthorization(['employer','manager', 'admin']), ProjectController.loadprojectfiles);

    projectRoutes.post('/update/:id', requireAuth, AuthenticationController.roleAuthorization(['employer','manager', 'admin']), ProjectController.updateproject);

    projectRoutes.delete('/deletefile/:id/:filename', requireAuth, AuthenticationController.roleAuthorization(['employer','manager', 'admin']), ProjectController.deletefile);

    projectRoutes.delete('/deleteproject/:id/:username', requireAuth, AuthenticationController.roleAuthorization(['employer','manager', 'admin']), ProjectController.deleteproject);

    //projectRoutes.get('/getall', requireAuth, AuthenticationController.roleAuthorization(['manager', 'admin']), ProjectController.getallProjects);

    projectRoutes.get('/getall', ProjectController.getallProjects);

    projectRoutes.get('/getOneProjectView/:id', ProjectController.getProjectByIdPreview);

    projectRoutes.get('/getCompletedProjectByMember/:id', ProjectController.getCompletedProjectByMember);

    projectRoutes.get('/getOngoingProjectByMember/:id', ProjectController.getOngoingProjectByMember);

    projectRoutes.get('/getone/:id', requireAuth, AuthenticationController.roleAuthorization(['member', 'employer', 'manager', 'admin']), ProjectController.getProjectById);

    projectRoutes.get('/getApplicantsList/:id', requireAuth, AuthenticationController.roleAuthorization(['employer', 'manager', 'admin']), ProjectController.getApplicantsList);

    projectRoutes.get('/offerproject/:projectid/:userid/:username/:email', requireAuth, AuthenticationController.roleAuthorization(['member','employer', 'manager', 'admin']), ProjectController.offerProjectToMember);

    projectRoutes.get('/awardproject/:projectid/:userid/:username/:email', requireAuth, AuthenticationController.roleAuthorization(['member','employer', 'manager', 'admin']), ProjectController.awardProjectToMember);

    projectRoutes.get('/revokeproject/:projectid/:userid/:username/:email', requireAuth, AuthenticationController.roleAuthorization(['employer', 'manager', 'admin']), ProjectController.revokeProjectFromMember);

    projectRoutes.post('/getemployertitledprojects', requireAuth, AuthenticationController.roleAuthorization(['employer', 'manager', 'admin']), ProjectController.getProjectWithEmployerNameAndTitle);

    projectRoutes.get('/getemployerprojects', requireAuth, AuthenticationController.roleAuthorization(['employer', 'manager', 'admin']), ProjectController.getAllEmployerProjects);

    projectRoutes.get('/getadminprojects', requireAuth, AuthenticationController.roleAuthorization(['manager', 'admin']), ProjectController.getAdminProjects);

    projectRoutes.get('/getotherprojectsforadmin', requireAuth, AuthenticationController.roleAuthorization(['manager', 'admin']), ProjectController.getOtherProjectsForAdmin);

    projectRoutes.get('/getemployerprojectsbyid/:id', requireAuth, ProjectController.getemployerprojectsbyid);

    projectRoutes.get('/getmemberprojects', requireAuth, AuthenticationController.roleAuthorization(['member', 'employer', 'manager', 'admin']), ProjectController.getAllMemberOngoingAndAwardedProjects);

    projectRoutes.get('/getnewdatabaseprojects', requireAuth, AuthenticationController.roleAuthorization(['member', 'employer', 'manager', 'admin']), ProjectController.getNewDatabaseProjects);

    //Banner Routes
    apiRoutes.use('/banner', bannerRoutes);

    bannerRoutes.get('/getbanner', BannerController.getFrontBanner);

    bannerRoutes.post('/create', requireAuth, AuthenticationController.roleAuthorization(['manager', 'admin']), BannerController.createBanner);

    bannerRoutes.patch('/update/:bannerid', requireAuth, AuthenticationController.roleAuthorization(['manager', 'admin']), BannerController.updateBanner);

    bannerRoutes.post('/uploadImage/:btitle', requireAuth, AuthenticationController.roleAuthorization(['manager', 'admin']), BannerController.uploadbannerImage);

    bannerRoutes.post('/updateImage/:btitle/:imagename', requireAuth, AuthenticationController.roleAuthorization(['manager', 'admin']), BannerController.updatebannerImage);

    // Set up ALL routes ****/
    app.use('/api', apiRoutes);

    // handling 404 errors
    app.get('*', function(req, res, next) {
      var err = new Error();
      err.status = 404;
      next(err);
    });
    app.post('*', function(req, res, next) {
      var err = new Error();
      err.status = 404;
      next(err);
    });

}
