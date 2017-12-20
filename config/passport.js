var passport = require('passport');
var User = require('../app/models/user');
var config = require('./auth');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;

var localOptions = {
    usernameField: 'email',
    passwordField: 'password'
};
 //use either email or username to log in. localOptions,
var localLogin = new LocalStrategy(localOptions, function(email, password, done){

    var criteria = (email.indexOf('@') === -1) ? {username: email, status: 'whitelisted'} : {email: email, status: 'whitelisted'};

    //email: email
    User.findOne(criteria, function(err, user){

        if(err){ return done(err); }

        if(!user){ return done(null, false, {error: 'Login failed. Please try again.'}); }

        user.comparePassword(password, function(err, isMatch){
            if(err){ return done(err);}
            if(!isMatch){
                return done(null, false, {error: 'Login failed. Please try again.'});
            }
            return done(null, user);
        });

    });

});
//ExtractJwt.fromAuthHeaderWithScheme('Bearer'), ExtractJwt.fromAuthHeader(),
var jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: config.secret
};

var jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    //console.log(payload);
    User.findById(payload._id, function(err, user){

        if(err){
            return done(err, false);
        }

        if(user){
            done(null, user);
        } else {
            done(null, false);
        }

    });

});

passport.use(jwtLogin);
passport.use(localLogin);
