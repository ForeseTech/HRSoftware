const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['Interviewer', 'Admin'],
  },
  company: {
    type: String,
    required: [
      function () {
        return this.role === 'Interviewer';
      },
    ],
  },
  date: {
    type: Date,
    required: [
      function () {
        return this.role === 'User';
      },
    ],
  },
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
    },
  ],
});

// Encrypt Password using bcrypt
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Remove interviewerId from student.interviewers when an interviewer is to be deleted.
// Delete the incharge whose is the incharge of the to be deleted interviewerId
UserSchema.post('remove', async function (next) {
  if (this.role === 'Interviewer') {
    await this.model('Student').updateMany({ $pull: { interviewers: this._id } });

    await this.model('Incharge').deleteOne({ interviewer: this._id });
  }
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = mongoose.model('User', UserSchema, 'Users');
module.exports = User;
