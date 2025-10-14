const { validationResult } = require('express-validator');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { sendOtpEmail } = require('../utils/mailer');

const generateToken = (user) => {
    return jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};



exports.updateProfileDetails = async (req, res, next) => {
    try {

        const userId = req.user.id;


        const profileData = req.body;

        const updatedUser = await UserModel.updateUserDetails(userId, profileData);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found or unable to update' });
        }


        res.status(200).json({
            message: 'Profile updated successfully!',
            user: updatedUser
        });

    } catch (err) {
        next(err);
    }
};


exports.sendOtp = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {

        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }


        const otp = Math.floor(100000 + Math.random() * 900000).toString();


        const upsertQuery = `
            INSERT INTO otps (email, otp) VALUES ($1, $2)
            ON CONFLICT (email) DO UPDATE SET otp = $2, created_at = NOW();
        `;
        await db.query(upsertQuery, [email, otp]);


        await sendOtpEmail(email, otp);

        res.status(200).json({ message: "OTP sent successfully to your email." });

    } catch (err) {

        next(err);
    }
};



exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, school, otp } = req.body;

    try {

        const result = await db.query("SELECT * FROM otps WHERE email = $1", [email]);
        const otpRecord = result.rows[0];

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid OTP or it has expired. Please request a new one." });
        }
        if (otpRecord.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP provided. Please try again." });
        }


        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        if (new Date(otpRecord.created_at) < tenMinutesAgo) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }


        const user = await UserModel.create({ fullName, email, school });

        await db.query("DELETE FROM otps WHERE email = $1", [email]);


        res.status(201).json({ message: "Registration successful! You can now log in." });

    } catch (err) {
        next(err);
    }
};

exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const user = await UserModel.findByEmail(email);

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const userPayload = await UserModel.findById(user.id);

        const token = generateToken(userPayload);
        res.json({
            token,
            user: {
                id: userPayload.id,
                full_name: userPayload.full_name,
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await UserModel.findAll({
            attributes: ["id", "username"]
        });
        res.json(users);
    } catch (err) {
        next(err);
    }
};

const assignTestToUser = async (userId, testId, isPaid) => {
    const { rows } = await db.query(
        `UPDATE users
         SET assigned_testid = $1, is_paid = $2
         WHERE id = $3
         RETURNING id, full_name, assigned_testid, is_paid`,
        [testId, isPaid, userId]
    );
    return rows[0];
};

exports.assignTest = async (req, res, next) => {
    try {
        const { userId, testId, isPaid } = req.body;

        if (!userId || !testId) {
            return res.status(400).json({ message: "User ID and Test ID are required" });
        }

        const updatedUser = await assignTestToUser(userId, testId, isPaid);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found or update failed" });
        }

        res.json({ message: "Test assigned successfully", user: updatedUser });
    } catch (err) {
        next(err);
    }
};




exports.getBoughtTests = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { rows: userRows } = await db.query(
            `SELECT assigned_testid, is_paid FROM users WHERE id = $1`,
            [userId]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = userRows[0];

        if (!user.is_paid || !user.assigned_testid) {
            return res.json([]);
        }

        const { rows: testRows } = await db.query(
            `SELECT id, test_name, subject_topic, num_questions FROM tests WHERE id = $1`,
            [user.assigned_testid]
        );

        if (testRows.length === 0) {
            return res.status(404).json({ message: "Test not found" });
        }

        res.json(testRows[0]);
    } catch (err) {
        next(err);
    }
};