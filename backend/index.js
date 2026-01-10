// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('../config/db');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const resultRoutes = require('./routes/resultRoutes');
const productroutes = require('./routes/ProductRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const url = process.env.FRONTEND_URL;
const cookieParser = require("cookie-parser");
const UserModel = require('./models/userModel');
const testProgressRoutes = require("./routes/testProgress.js");




const app = express();


const allowedOrigins = [
    url,
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000"
];


app.use(cors({
    origin: function (origin, callback) {

        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());


app.use('/api', authRoutes);
app.use('/api', testRoutes);
app.use('/api', resultRoutes);
app.use('/api', productroutes);
app.use("/api/test-progress", testProgressRoutes);


const generateAccessToken = (user) =>
    jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: '15m' });




app.post("/api/logout", (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
    });

    res.sendStatus(200);
});

app.post("/api/tests/:testId/start", async (req, res) => {
    const userId = req.user.id;
    const { testId } = req.params;

    await db.query(`
    INSERT INTO test_attempts (user_id, test_id, status, started_at)
    VALUES ($1, $2, 'started', NOW())
    ON CONFLICT (user_id, test_id)
    DO UPDATE SET status = 'started', started_at = NOW()
  `, [userId, testId]);

    res.json({ success: true });
});


app.get("/api/admin/tests/:testId/monitor", async (req, res) => {
    try {

        const { testId } = req.params;

        const { rows } = await db.query(
            `
      SELECT 
        u.id AS user_id,
        u.name,
        u.email,
        COALESCE(ta.status, 'not_started') AS status,
        ta.started_at,
        ta.completed_at
      FROM users u
      LEFT JOIN test_attempts ta
        ON ta.user_id = u.id AND ta.test_id = $1
      ORDER BY u.name
      `,
            [testId]
        );

        res.json(rows);
    } catch (err) {
        console.error("Monitor test error:", err);
        res.status(500).json({ error: "Failed to load test monitor data" });
    }
});


app.post("/api/refresh", async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.sendStatus(401);
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET
        );

        console.time("refresh-db");
        const user = await UserModel.findById(decoded.id);
        console.timeEnd("refresh-db");

        if (!user) {
            return res.sendStatus(401);
        }

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email_or_phone,
        });

        return res.json({
            accessToken,
            user: {
                id: user.id,
                email: user.email_or_phone,
                full_name: user.full_name,
            },
        });
    } catch (err) {
        console.error("REFRESH ERROR:", err.message);
        return res.sendStatus(403);
    }
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