// routes/testRoutes.js
const express = require('express');
const {
    getAllTests,
    getDemoTests,
    getUpcomingTests,
    getTestById,
    getTestQuestions,
    submitTest,
    updateQuestion,
    deleteQuestion,
    createTest,
    addQuestionToTest,
    uploadQuestionImage,
    deleteQuestionImage,
    updateTest
} = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/Cloudinary.js');
const router = express.Router();

router.get('/tests', getAllTests);
router.get('/demo-tests', getDemoTests);
router.get('/upcoming-tests', getUpcomingTests);
router.get('/tests/:id', getTestById);
router.get('/tests/:id/questions', protect, getTestQuestions);
router.post('/tests/:id/submit', protect, submitTest);
router.put('/questions/:id', protect, updateQuestion);
router.put('/tests/:id', updateTest);
router.delete('/questions/:id', protect, deleteQuestion);
router.post('/tests', createTest);
router.post('/tests/:testId/questions', addQuestionToTest);
router.post('/upload-image', protect, upload.single('questionImage'), uploadQuestionImage);
router.delete('/questions/:id/image', protect, deleteQuestionImage);

router.post("/save", async (req, res) => {
    const { userId, testId, answers } = req.body;

    if (!userId || !testId || !answers) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        for (const { questionId, selectedOption } of answers) {
            await client.query(
                `
        INSERT INTO test_progress (user_id, test_id, question_id, selected_option)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, test_id, question_id)
        DO UPDATE SET selected_option = $4, updated_at = NOW();
        `,
                [userId, testId, questionId, selectedOption]
            );
        }

        await client.query("COMMIT");
        res.json({ success: true });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ message: "Failed to save progress" });
    } finally {
        client.release();
    }
});


router.get("/load", async (req, res) => {
    const { userId, testId } = req.query;

    const result = await pool.query(
        `
    SELECT question_id, selected_option
    FROM test_progress
    WHERE user_id = $1 AND test_id = $2;
    `,
        [userId, testId]
    );

    res.json(result.rows);
});

export default router;



module.exports = router;