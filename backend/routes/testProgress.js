const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.post("/save", async (req, res) => {
    const { userId, testId, answers } = req.body;

    if (!userId || !testId || !Array.isArray(answers)) {
        return res.status(400).json({ message: "Invalid payload" });
    }

    try {
        for (const { questionId, selectedOption } of answers) {
            await db.query(
                `
        INSERT INTO test_progress (user_id, test_id, question_id, selected_option)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, test_id, question_id)
        DO UPDATE SET selected_option = $4, updated_at = NOW()
        `,
                [
                    Number(userId),
                    Number(testId),
                    Number(questionId),
                    selectedOption,
                ]
            );
        }

        res.json({ success: true });
    } catch (err) {
        console.error("SAVE PROGRESS ERROR:", err);
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

module.exports = router;
