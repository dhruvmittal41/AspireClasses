import express from "express";
const db = require('../config/db');

const router = express.Router();

router.post("/save", async (req, res) => {
    const { userId, testId, answers } = req.body;

    try {
        for (const { questionId, selectedOption } of answers) {
            await db.query(
                `
        INSERT INTO test_progress (user_id, test_id, question_id, selected_option)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, test_id, question_id)
        DO UPDATE SET selected_option = $4, updated_at = NOW();
        `,
                [userId, testId, questionId, selectedOption]
            );
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to save progress" });
    }
});

router.get("/load", async (req, res) => {
    const { userId, testId } = req.query;

    const result = await db.query(
        `
    SELECT question_id, selected_option
    FROM test_progress
    WHERE user_id = $1 AND test_id = $2
    `,
        [userId, testId]
    );

    res.json(result.rows);
});

export default router;
