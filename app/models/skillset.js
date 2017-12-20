var mongoose = require('mongoose');
 
var SkillSetSchema = new mongoose.Schema({
        skillrequirement: [{
        bigdataNoSQL: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        sqlRDBMS: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        microsoftsqlserverACCESS: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },  
        java: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        python: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        csharp: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        php: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        javascript: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        swift: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        cplusplus: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        networking: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        linux: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        windows: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        cloudcomputing: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        rhapsberrypi: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        devices: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        games: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        android: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        ios: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
        windowsphone: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] }
    }],
        memberID: {type: String},
        projectId: {type: String}
    }
);

module.exports = mongoose.model('SkillSet', SkillSetSchema);