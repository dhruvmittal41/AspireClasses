
const db = require('../config/db');

const findBundleBySlug = async (slug) => {
    const query = `
        SELECT 
            id, 
            bundle_name, 
            slug, 
            description, 
            price, 
            features, 
            image_url, 
            category 
        FROM 
            test_bundles 
        WHERE 
            slug = $1
    `;

    // Execute the query with the slug as a parameter
    const { rows } = await db.query(query, [slug]);

    // Since slug is unique, return the first result found, or undefined
    return rows[0];
};

module.exports = {
    findBundleBySlug
};






