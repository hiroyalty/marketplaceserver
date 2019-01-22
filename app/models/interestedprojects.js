var mongoose = require('mongoose');

var InterestedProjectSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  projectdatabase: { type: Boolean },
  projectprogramming: { type: Boolean},
  projectweb: { type: Boolean },
  projectmobile: { type: Boolean },
  probigdata: { type: Boolean },
  promysql: { type: Boolean },
  prooracle: { type: Boolean },
  prosqlserver: { type: Boolean },
  propostgresql: { type: Boolean },
  prosqllite: { type: Boolean },
  projava: { type: Boolean },
  propython: { type: Boolean },
  procsharp: { type: Boolean },
  procplusplus: { type: Boolean },
  proc: { type: Boolean },
  prophp: { type: Boolean },
  projavascript: { type: Boolean },
  prohtml5: { type: Boolean },
  proandroid: { type: Boolean },
  proios: { type: Boolean },
  prowindowsphone: { type: Boolean }
}, {
  timestamps: true
});

module.exports = mongoose.model('InterestedProject', InterestedProjectSchema);
