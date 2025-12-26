const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Google token missing" });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;

        if (!email) {
            return res.status(400).json({ message: "Google account has no email" });
        }

        let user = await User.findByEmail(email);

        if (!user) {
            // Since Google signup doesn't ask for school, we store "Google User" as placeholder
            user = await User.create({
                fullName: name || "Google User",
                email,
                school: "Google Signup",
            });
        }

        const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ token: jwtToken, user });
    } catch (err) {
        console.error("Google auth error:", err);
        res.status(401).json({ message: "Google authentication failed" });
    }
};
