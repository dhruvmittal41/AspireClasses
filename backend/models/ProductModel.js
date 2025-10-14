
const db = require('../config/db');

const findAllBundles = async () => {
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
        ORDER BY 
            id ASC
    `;

    const { rows } = await db.query(query);


    return rows;
};


module.exports = {
    findAllBundles
};



