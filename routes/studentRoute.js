const express = require('express');
const router = express.Router();

const { renderStudent, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');

router.route('/').get(renderStudent).post(createStudent);
router.route('/:id').put(updateStudent).delete(deleteStudent);

module.exports = router;
