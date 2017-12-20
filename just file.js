// for user array input vals
//var skillinfo = [];
    //var compproinfo = [];
        //for (var i = 0; i < req.body.skillset.length; i++) {
            //skillinfo.push(req.body.skillset[i]);
        //}
        //for (var i = 0; i < req.body.completedproject.length; i++) {
            //compproinfo.push(req.body.completedproject[i]);
        //}
        //console.log(skillinfo);
        //console.log(compproinfo);

{
    "message": "Cast to string failed for value \"{ size: 6096,\n  path: '../client/public/img/picture-hiroyalty',\n  filename: 'picture-hiroyalty',\n  destination: '../client/public/img',\n  mimetype: 'image/jpeg',\n  encoding: '7bit',\n  originalname: 'images.jpeg',\n  fieldname: 'picture' }\" at path \"picture\"",
    "name": "CastError",
    "stringValue": "\"{ size: 6096,\n  path: '../client/public/img/picture-hiroyalty',\n  filename: 'picture-hiroyalty',\n  destination: '../client/public/img',\n  mimetype: 'image/jpeg',\n  encoding: '7bit',\n  originalname: 'images.jpeg',\n  fieldname: 'picture' }\"",
    "kind": "string",
    "value": {
        "size": 6096,
        "path": "../client/public/img/picture-hiroyalty",
        "filename": "picture-hiroyalty",
        "destination": "../client/public/img",
        "mimetype": "image/jpeg",
        "encoding": "7bit",
        "originalname": "images.jpeg",
        "fieldname": "picture"
    },
    "path": "picture"
}

// create reusable transporter object using the default SMTP transport.. STILL NEEDS CONFIGURATION
/*let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'gbolaga.famodun@gmail.com',
        pass: 'ayokunle1982'
    }
}); */

/*User.findOne({email: email}, function(err, existingUser){
        if(err){ return next(err); }
        if(!existingUser){
            res.status(422).json({error: 'No user found.'});
        } 
    var token = services.gentoken
    if(!token) {res.status(500).json({error: 'Request Failed.'}); }
    existingUser.resetPasswordToken = token;
    existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour */

<p>, click on this link to update your password</p>'+
    '<a href='+url+'/updatepassword/'+existingUser._id+'>Update Password</a><p>Regards</p>'
old user
{
    "status": 200,
    "success": true,
    "user": {
        "_id": "594a84fd48525c45815127f6",
        "username": "hiroyalty",
        "email": "biyibg@yahoo.co.uk",
        "firstname": "testaccount",
        "lastname": "testaccount",
        "role": "member",
        "address": [
            {
                "zip": "02772",
                "region": "Uusimaa",
                "city": "espoo",
                "streetaddress": "vieraskuja 5f",
                "_id": "594a856348525c45815127f7"
            }
        ],
        "phonenumber": "+358469685462",
        "dateofbirth": "1990-06-08T21:00:00.000Z",
        "picture": "picture-hiroyalty",
        "completedproject": [
            [
                "https://github.com/hiroyalty/livefree",
                "https://github.com/hiroyalty/behealthy"
            ]
        ],
        "skillset": [
            [
                "css",
                "html"
            ]
        ],
        "skilllevel": "intermediate",
        "company": "leadtech",
        "website": "https://behealthyapp.herokuapp.com/",
        "status": "whitelisted"
    }
}





{
    "user": {
        "_id": "59579498ed73db09a66d7e3d",
        "username": "hiroyalty",
        "email": "gbohlahgah@gmail.com",
        "firstname": "testaccount",
        "lastname": "testaccount",
        "role": "member",
        "address": [
            {
                "streetaddress": "vieraskuja 5f",
                "city": "valkeakoski",
                "region": "Tampere",
                "zip": "02678",
                "_id": "59579c5c963a8b0e5bff3cd9"
            }
        ],
        "phonenumber": "+358469685462",
        "dateofbirth": "1997-06-08T21:00:00.000Z",
        "completedproject": [
            "https://github.com/hiroyalty/livefree",
            "https://github.com/hiroyalty/behealthy"
        ],
        "interestedproject": [
            "rhapbeery pi",
            "android",
            "ios"
        ],
        "skillset": [],
        "company": "leadtech",
        "website": "https://behealthyapp.herokuapp.com/",
        "status": "whitelisted"
    }
}

skillset: [{
        database: {
            bigdataNoSQL: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'},
            sqlRDBMS: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'},
            microsoftsqlserverACCESS: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'}},
        programming: {
            java: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'},
            python: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'},
            csharp: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'},
            php: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'},
            javascript: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'},
            swift: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'},
            cplusplus: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'}
        },
        networking: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'},
        operatingSystem: {
            linux: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'},
            windows: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'}
        },
        cloudcomputing: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'},
        embeddedsystems: {
            rhapsberrypi: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'},
            devices: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'},
            games: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'}
        },
        mobiledevelopment: {
            android: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'},
            ios: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'},
            windows: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'], default: 'none'}
        },
        memberID: {type: String},
        projectId: {type: String}
    }
}]

 /*console.log(req.files['projectdocsecond'][0].filename);
    var fileone = req.files['projectdocfirst'][0].filename;
    var filetwo = req.files['projectdocsecond'][0].filename;
    var filethree = req.files['projectdocthird'][0].filename;
    if(fileone != null && filetwo == null && filethree == null){
        var filearray = [fileone];
    } else if (fileone != null && filetwo != null && filethree == null){
        var filearray = [fileone, filetwo];
    } else {
        var filearray = [fileone, filetwo, filethree];
    }*/
    /*if(req.user.picture) {
    dfilename = '../client/public/userfiles/'+req.user.username+'/'+req.user.picture;
    dsmall = '../client/public/userfiles/'+req.user.username+'/picture-small.jpg';
    services.delfile(dfilename, function(err, files){
      if(err) return res.status(500).send({error: err.toString() });
    })
    services.delfile(dsmall, function(err, files){
      if(err) return res.status(500).send({error: err.toString() });
    })
  }*/

  <div class="col-sm-10">
    <p class="form-control-static"><%= user.firstname %></p>
</div>

//if ((proj.projecttype == 'individual') && (proj.status == 'awarded' || proj.status == 'ongoing' || proj.status == 'finished')) {

    /* Project.find({ "_id": req.params.projectid }, { projecttype: 1, awardedTo: 1 }, function(err, projet) {
        if (err) { return res.status(500).send({error: err.toString()});  }
        if ((!proj.awardedTo) && proj.projecttype == 'team') {
            Project.findByIdAndUpdate({"_id": req.params.projectid}, { $set : { awardedTo: undefined, status: 'created'},  
            }, { new: true } ).exec(function(err, proo) {
            if (err){ return res.status(500).send({error: err.toString()}); }
            res.status(201).json({message: 'Project succesfully revoked', project: proo});
        } ) 
        }
    })*/
    
Model.find( {...}, function (err, results) {
    if (err) { ... }
    if (!results.length) {
        // do stuff here
    }
}
Model.findOne( {...}, function (err, result) {
    if (err) { ... }
    if (!result) {
        // do stuff here
    }
}