var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    titlelowercase: {type: String },
    introDescription: {type: String},
    description: {
        type: String,
        required: true
    },
    projecttype: {
        type: String,
         enum: ['individual', 'team' ],
        default: 'individual'
    },
    diffilcultyLevel: {type: String, enum: ['begineer', 'intermediate', 'advance'] },
    bigdataNoSQL: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
    RelationalDB: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
    programming: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
    webdevelopment: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
    networking: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
    cloudcomputing: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
    operatingsystem: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
    devices: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
    games: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
    android: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
    ios: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
    windowsphone: {type: String, enum: ['none', 'begineer', 'intermediate', 'expert'] },
    projectdocs: {
        type: []
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: { type: String },
    awardedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    awardedToTeam: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }],
    applicantsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }],
    numofapplicants: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
    },
    offeredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }],
    status: {
        type: String,
        enum: ['draft', 'created', 'offered', 'awarded', 'finished'],
        default: 'draft'
    },
    projectlifespan: {
        type: String,
        required: true
    },
    imageUrl: { type: String },
    additionalinfo: {type: String },
    url: {type: String },
    datepublished: {type: Date, required: true},
    applicationdeadline: {type: Date, required: true},
    dateupdated: {type: Date, required: true},
    employerfeedback: { type: [String] },
    awardeefeedback: { type: [String] }
    },
    {
    timestamps: true
});

ProjectSchema.index({ "title": 1, "postedBy": 1}, { unique: true });

module.exports = mongoose.model('Project', ProjectSchema);
