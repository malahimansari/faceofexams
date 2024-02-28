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
router.get("/room/:roomId", questionController.getQuestionsForRoom);

/**
 * @route POST /api/v1/questions
 * @desc Create a new question
 * @access Private (for institute admins and teachers)
 */
router.post(
  "/",
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
