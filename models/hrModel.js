const mongoose = require('mongoose');

const HrSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
});

const Hr = mongoose.model('Hr', HrSchema, 'Hrs');
module.exports = Hr;
