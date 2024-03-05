import express from "express";
import { check } from "express-validator";
import questionController from "../controllers/questionController.js";

const router = express.Router();

// Middleware
import roleMiddleware from "../middlewares/roleMiddleware.js";

/**
 * @route GET /api/v1/questions/room/:roomId
 * @desc Get questions for a specific room
 * @access Public (accessible to students)
 */


/**
 *  @swagger
 * /api/v1/question/{roomId}:
 *   get:
 *     summary: Get Questions
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: text
 *         description: ID of the room where the question is created
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               token: <JWT_TOKEN>
 *       400:
 *         description: Bad request (validation errors)
 *             
 *       409:
 *         description:  Bad request ( user not exists)
 *         
 *       500:
 *         description: Internal server error
 */


// ---------------------------------------------------------------------------------------
router.get("/:room_id",roleMiddleware, questionController.getQuestionsForRoom);

/**
 * @route POST /api/v1/questions
 * @desc Create a new question
 * @access Private (for institute admins and teachers)
 */


/**
 *  @swagger
 * /api/v1/question/{roomId}:
 *   post:
 *     summary: Create Question
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: text
 *         description: ID of the room where the question is created
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text of the question
 *               type:
 *                 type: string
 *                 description: The type of question
 *               correctanswer:
 *                 type: string
 *                 description: The correct answer to the question
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of options for the question
 *     responses:
 *       200:
 *         description: Successful question creation
 *         content:
 *           application/json:
 *             example:
 *               message: Question created successfully
 *       400:
 *         description: Bad request (validation errors)
 *       409:
 *         description: Conflict (user not exists)
 *       500:
 *         description: Internal server error
 */



// ---------------------------------------------------------------------------------------

router.post(
  "/:room_id",
  roleMiddleware,
  [
    check("text", "Question text is required").not().isEmpty(),
    check("type", "Invalid question type").isIn([
      "single-choice",
      "multi-choice",
    ]),
    check("options").isArray().optional(),
    check("correctAnswer", "Correct answer is required").not().isEmpty(),
  ],
  questionController.createQuestion
);

export default router;
