var mongoose = require('mongoose');

var UserCategorySchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
      type: String,
      required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserCategory', UserCategorySchema);
