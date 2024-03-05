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


/**
 *  @swagger
 * /api/v1/exam/:room_id?:
 *   post:
 *     summary: Create Exam
 *     tags: [Exams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (at least 6 characters)
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



// ---------------------------------------------------------------------
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