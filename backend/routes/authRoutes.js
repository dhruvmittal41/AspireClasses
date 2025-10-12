const express = require('express');
const { check } = require('express-validator');
// Import the new 'sendOtp' controller alongside the existing ones
const {
    sendOtp,
    registerUser,
    loginUser,
    getUserProfile,
    getAllUsers,
    assignTest,
    getBoughtTests,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route  POST /api/send-otp
// @desc  Validate email, generate and send OTP
// @access Public
router.post(
    '/send-otp',
    [
        // Add specific email validation for this step
        check('email', 'Please include a valid email').isEmail(),
    ],
    sendOtp // New controller function for sending the OTP
);

// @route  POST /api/register
// @desc  Register a new user after verifying OTP
// @access Public
router.post(
    '/register',
    [
        // Update validation to include all required fields for registration
        check('fullName', 'Full name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('school', 'School name is required').not().isEmpty(), // Assuming 'school' is a required field
        check('otp', 'A 6-digit OTP is required').isLength({ min: 6, max: 6 }).isNumeric(),
    ],
    registerUser // This controller now also handles OTP verification
);

// @route  POST /api/login
// @desc  Authenticate user & get token
// @access Public
router.post(
    '/login',
    [check('email', 'Please include a valid email or phone').not().isEmpty()],
    loginUser
);

// @route  GET /api/user
// @desc  Get user data
// @access Private
router.get('/user', protect, getUserProfile);
router.get('/user/all', protect, getAllUsers);
router.post('/user/assigntest', protect, assignTest);
router.get('/user/mytests', protect, getBoughtTests);

module.exports = router;