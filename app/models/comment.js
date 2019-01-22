var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({

    userId: { type: String, required: true  },
    username: { type: String, required: true },
    userpix: { type: String },
    message: { type: String, required: true },
    messageTime: { type: Date, required: true },
    projectId: { type: String, required: true },
    projectTitle: { type: String, required: true }

}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', CommentSchema);
