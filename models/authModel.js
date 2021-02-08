const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },

  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },

  role: {
    type: String,
    required: true,
    enum: ['HR Incharge', 'Interviewer', 'Admin'],
  },

  incharge: {
    type: mongoose.Schema,
  },
});

const User = mongoose.model('User', UserSchema, 'users');
module.exports = User;
