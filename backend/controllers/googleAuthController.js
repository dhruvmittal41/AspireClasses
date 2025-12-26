const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateAccessToken = (user) =>
    jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (user) =>
    jwt.sign(user, process.env.REFRESH_SECRET, { expiresIn: "7d" });

exports.googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ error: "Google token missing" });

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;

        if (!email) {
            return res.status(400).json({ error: "Google account has no email" });
        }

        let user = await UserModel.findByEmail(email);

        if (!user) {
            user = await UserModel.create({
                fullName: name || "Google User",
                email,
                school: "Google Signup",
            });
        }

        const jwtPayload = {
            id: user.id,
            email: user.email_or_phone,
            full_name: user.full_name,
        };

        const accessToken = generateAccessToken(jwtPayload);
        const refreshToken = generateRefreshToken(jwtPayload);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            accessToken,
            user: jwtPayload,
        });
    } catch (err) {
        console.error("Google auth error:", err);
        res.status(401).json({ error: "Google authentication failed" });
    }
};
