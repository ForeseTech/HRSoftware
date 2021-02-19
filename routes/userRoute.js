const express = require('express');
const router = express.Router();

const {
  renderLogin,
  loginUser,
  logoutUser,
  renderUsers,
  createUser,
  getUser,
  deleteUser,
  assignStudentToUser,
  deallocateStudentToUser,
  scoreStudent,
} = require('../controllers/userController');

const { isLoggedIn, authorize } = require('../middleware/auth');

// Auth Routes
router.route('/login').get(renderLogin).post(loginUser);
router.route('/logout').get(logoutUser);

// CRUD Routes
router.route('/').get(isLoggedIn, authorize('Admin'), renderUsers).post(isLoggedIn, authorize('Admin'), createUser);
router.route('/:id').get(isLoggedIn, getUser).delete(isLoggedIn, authorize('Admin'), deleteUser);

// Assign and Deallocate Student Routes
router.route('/:interviewerId/assign_student').put(isLoggedIn, authorize('Admin'), assignStudentToUser);
router
  .route('/:interviewerId/deallocate_student/:studentId')
  .put(isLoggedIn, authorize('Admin'), deallocateStudentToUser);

// Score Student Route
router.route('/:interviewerId/students/:studentId').post(isLoggedIn, authorize('Interviewer'), scoreStudent);

module.exports = router;
