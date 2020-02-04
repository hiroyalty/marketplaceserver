var mongoose = require('mongoose');

var ProjectCategorySchema = new mongoose.Schema({

    pctitle: {
      type: String,
      required: true
    },
    pcdescription: {
      type: String,
      required: true
    },
    subcategories: [
        { subcategory: { type: String }
    }]
  }, {
    timestamps: true
  });

module.exports = mongoose.model('ProjectCategory', ProjectCategorySchema);
