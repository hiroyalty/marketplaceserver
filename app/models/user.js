var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
//var SkillsetSchema = require('./skillset.js');

var UserSchema = new mongoose.Schema({

    email: {
        type: String,
        lowercase: true,
        match: /.+@.+\..+/,
        unique: true,
        required: true
    },
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        lowercase: true,
        required: true
    },
    lastname: {
        type: String,
        lowercase: true,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'member', 'employer', 'manager', 'admin'],
        default: 'user'
    },
    address: {
         street: { type: String }
		    , city: {type: String}
        , region: { type: String }
        , zip: { type: String }
    },
    phonenumber: {
        type: String
    },
    picture: {
        type: String
    },
    cv: {
        type: String,
    },
    cvicon: {type: String},
    coverletter: {
        type: String
    },
    coverlettericon: {type: String},
    bio: {
      type: String
    },
    completedproject: {
        type: []
    },
    company: {
        type: String
    },
    url: {
        type: String
    },
    companycertificate: {
        type: String
    },
    companycertificateicon: {type: String},
    companyIDNumber: {
        type: String
    },
    interestedproject: {
      type: []
    },
    numberofongoingproject: {type: Number},
    resetpasswordtoken: { type: String },
    resetpasswordexpires: { type: Date },
    status: {
        type: String,
        enum: ['whitelisted', 'blacklisted'],
        default: 'whitelisted'
    },
    //skillset: {
        bigdataNoSQL: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        mysql: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        oracle: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        sqlserver: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        postgresql: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        sqlite: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        java: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        python: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        csharp: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        cplusplus: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        c: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        php: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        javascript: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        html5: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        networking: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        linux: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        windows: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        cloudcomputing: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        devices: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        games: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        android: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        ios: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        windowsphone: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] }
    //}
}, {
    timestamps: true
});

UserSchema.pre('save', function(next){
    var user = this;
    var SALT_FACTOR = 5;

    if(!user.isModified('password')){
        return next();
    }
    bcrypt.genSalt(SALT_FACTOR, function(err, salt){
        if(err){
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err){
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(passwordAttempt, cb){
    bcrypt.compare(passwordAttempt, this.password, function(err, isMatch){
        if(err){
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });
}

module.exports = mongoose.model('User', UserSchema);
