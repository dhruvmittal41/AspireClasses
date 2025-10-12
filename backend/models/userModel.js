// models/userModel.js
const db = require('../config/db');

const findByEmail = async (email) => {
    const { rows } = await db.query('SELECT * FROM users WHERE email_or_phone = $1', [email]);
    return rows[0];
};

const create = async ({ fullName, email, school }) => {
    const { rows } = await db.query(
        'INSERT INTO users (full_name, email_or_phone, school_name) VALUES ($1, $2, $3) RETURNING id, full_name, email_or_phone, school_name',
        [fullName, email, school]
    );
    return rows[0];
};

const findById = async (id) => {
    const { rows } = await db.query('SELECT id, full_name, email_or_phone, school_name FROM users WHERE id = $1', [id]);
    return rows[0];
};
const findAll = async () => {
    const { rows } = await db.query(
        "SELECT id, full_name, email_or_phone, school_name FROM users"
    );
    return rows;
};



/**
  @param {number} userId
  @param {object} profileData 
  @returns {Promise<object>} 
 */
const updateUserDetails = async (userId, {
    full_name,
    school_name,
    dob,
    gender,
    mobileNumber, // This is camelCase from the frontend
    city,
    state,
    country
}) => {
    const { rows } = await db.query(
        `UPDATE users
     SET 
       full_name = $1, 
       school_name = $2, 
       dob = $3, 
       gender = $4, 
       mobile_number = $5, -- This is snake_case in the database
       city = $6, 
       state = $7, 
       country = $8
     WHERE id = $9
     RETURNING id, full_name, email_or_phone, school_name, dob, gender, mobile_number, city, state, country`,
        [full_name, school_name, dob, gender, mobileNumber, city, state, country, userId]
    );
    return rows[0];
};

module.exports = { findByEmail, create, findById, findAll, updateUserDetails };