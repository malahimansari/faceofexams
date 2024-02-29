import express from "express";
import { check } from "express-validator";
import examController from "../controllers/examController.js";

const router = express.Router();

import roleMiddleware from "../middlewares/roleMiddleware.js";

/**
 * @route POST /api/v1/questions
 * @desc Create an Exam
 * @access Private (for institute admins and teachers)
 */
router.post(
  "/:room_id?",
  roleMiddleware,
  [
    check("title", "Title is required").not().isEmpty(),
    check("questions", "Questions are required").isArray(),
    check("duration", "Duration is required").isNumeric(),
    check("maxScore", "Max score must be a number").optional().isNumeric(),
    check("passingScore", "Passing score must be a number")
      .optional()
      .isNumeric(),
    check("maxAttempts", "Max attempts must be a number")
      .optional()
      .isNumeric(),
  ],
  examController.createExam
);


export default router;