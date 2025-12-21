// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const resultRoutes = require('./routes/resultRoutes');
const productroutes = require('./routes/ProductRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const url = process.env.FRONTEND_URL;

const app = express();





app.use(cors({
    origin: url,
    credentials: true,
}));

app.use(express.json());
app.use(require('cookie-parser')());


app.use('/api', authRoutes);
app.use('/api', testRoutes);
app.use('/api', resultRoutes);
app.use('/api', productroutes);




app.post("/api/login", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email or phone is required" });
    }


    let user = await userModel.findByEmail(email);


    if (!user) {
        return errorMiddleware()
    }


    const payload = {
        id: user.id,
        email: user.email_or_phone,
    };


    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);


    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/api",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.json({
        accessToken,
        user: payload,
    });
});


app.post("/api/refresh", async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.sendStatus(401);
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET,
        async (err, decoded) => {
            if (err) return res.sendStatus(403);


            const user = await userModel.findById(decoded.id);
            if (!user) return res.sendStatus(401);


            const accessToken = generateAccessToken({
                id: user.id,
                email: user.email_or_phone,
            });

            res.json({
                accessToken,
                user: {
                    id: user.id,
                    email: user.email_or_phone,
                },
            });
        }
    );
});



app.post('/api/admin/login', async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }


    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminUsername || !adminPasswordHash) {
        console.error("FATAL ERROR: Admin credentials are not set in the .env file.");
        return res.status(500).json({ message: "Server configuration error." });
    }

    try {

        const isUsernameMatch = (username === adminUsername);


        const isPasswordMatch = await bcrypt.compare(password, adminPasswordHash);


        if (!isUsernameMatch || !isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials. Please try again.' });
        }


        const payload = {
            user: {
                username: adminUsername,
                role: 'admin'
            }
        };


        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '8h' },
            (err, token) => {
                if (err) throw err;

                res.json({ token });
            }
        );

    } catch (err) {
        console.error("Error during admin login:", err);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
});


app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));