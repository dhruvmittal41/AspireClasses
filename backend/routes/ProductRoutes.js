const express = require('express');
const { check } = require('express-validator');


const { protect } = require('../middleware/authMiddleware');
const { getAllTestBundles } = require('../controllers/ProductController');


const router = express.Router();



router.get('/test_bundles', protect, getAllTestBundles);

module.exports = router;