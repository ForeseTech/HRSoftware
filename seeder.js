const fs = require('fs');
const colors = require('colors');
const dotenv = require('dotenv').config();

const Database = require('./config/db');

// Load models
const Student = require('./models/studentModel');
const User = require('./models/userModel');
const Incharge = require('./models/inchargeModel');
const Score = require('./models/scoreModel');

// Read JSON files
const students = JSON.parse(fs.readFileSync(`${__dirname}/resources/data/students.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/resources/data/users.json`, 'utf-8'));
const incharges = JSON.parse(fs.readFileSync(`${__dirname}/resources/data/incharges.json`, 'utf-8'));

// Import into DB
const importData = async () => {
  try {
    await Student.create(students);
    await User.create(users);
    await Incharge.create(incharges);

    console.log('Data Imported...'.green);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await Student.deleteMany();
    await User.deleteMany();
    await Incharge.deleteMany();
    await Score.deleteMany();

    console.log('Data Destroyed...'.red);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
