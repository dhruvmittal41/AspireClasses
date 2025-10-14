const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { findBundleBySlug } = require('../models/ProductModel');



exports.getAllTestBundles = async (req, res, next) => {
    try {
        // Find all bundles in the database.
        const bundles = await findBundleBySlug.findAll({
            attributes: [
                'id',
                'bundle_name',
                'slug',
                'description',
                'price',
                'image_url',
                'category',
                'features'
            ]
        });

        // Send the list of bundles as a JSON response.
        res.json(bundles);

    } catch (err) {
        // Pass any database errors to the central error handler.
        next(err);
    }
};