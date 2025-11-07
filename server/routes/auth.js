const express = require('express');
const { body } = require('express-validator');
const { register, login, logout, getProfile } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('userType').isIn(['applicant', 'recruiter']),
  body('profile.firstName').optional().trim().isLength({ min: 1 }),
  body('profile.lastName').optional().trim().isLength({ min: 1 })
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  body('userType').isIn(['applicant', 'recruiter'])
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.get('/profile', requireAuth, getProfile);

module.exports = router;