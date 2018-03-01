var mongoose = require('mongoose');

var FrontBannerSchema = new mongoose.Schema({
    btitle: {
        type: String,
        required: true
    },
    bdescription: {
        type: String,
        required: true
    },
    imageLink: {
      type: String
    },
  }, {
    timestamps: true
});

module.exports = mongoose.model('FrontBanner', FrontBannerSchema);
