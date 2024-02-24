import express from "express";
import { check } from "express-validator";
import questionController from "../controllers/questionController.js";

const router = express.Router();

// Middleware
import authMiddleware from "../middlewares/authMiddleware.js";
import instituteMiddleware from "../middlewares/instituteMiddleware.js";

router.use(authMiddleware);

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
  instituteMiddleware,
  [
    check("text", "Please enter the question text").not().isEmpty(),
    check("options", "Please provide options for the question").isArray({
      min: 2,
    }),
    check("correctAnswer", "Please specify the correct answer").not().isEmpty(),
  ],
  questionController.createQuestion
);

export default router;
