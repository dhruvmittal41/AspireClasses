const express = require('express');
const { check } = require('express-validator');


const {
    sendOtp,
    registerUser,
    loginUser,
    getUserProfile,
    getAllUsers,
    assignTest,
    getBoughtTests,
    updateProfileDetails,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();


router.post(
    '/send-otp',
    [

        check('email', 'Please include a valid email').isEmail(),
    ],
    sendOtp
);


router.post(
    '/register',
    [

        check('fullName', 'Full name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('school', 'School name is required').not().isEmpty(),
        check('otp', 'A 6-digit OTP is required').isLength({ min: 6, max: 6 }).isNumeric(),
    ],
    registerUser
);


router.post(
    '/login',
    [check('email', 'Please include a valid email or phone').not().isEmpty()],
    loginUser
);




router.get('/user', protect, getUserProfile);
router.post('/user/details', protect, updateProfileDetails);
router.get('/user/all', protect, getAllUsers);
router.post('/user/assigntest', protect, assignTest);
router.get('/user/mytests', protect, getBoughtTests);

module.exports = router;