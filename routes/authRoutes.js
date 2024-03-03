import { Router } from "express";
import { check } from "express-validator";
const router = Router();

// Controller
import authController from "../controllers/authController.js";

// Middleware
import authMiddleware from "../middlewares/authMiddleware.js";
import studentMiddleware from "../middlewares/studentMiddleware.js";

/**
 * @route GET /api/v1/auth
 * @desc get loged in data
 * @access private
 */

router.get("/", authMiddleware, authController.get_login);

/**
 * @route POST /api/v1/auth/login
 * @desc log in user
 * @access public
 */

router.post(
  "/login",
  [
    check("email", "Please enter your valid email").isEmail(),
    check("password", "Please enter your valid password").exists(),
  ],
  authController.auth_login
);

/**
 * @route GET /api/v1/exam/available-exams
 * @desc Get available exams for the student
 * @access Private (for students)
 */

router.get(
  "/available-exams/:room_id",
  [authMiddleware, studentMiddleware],
  authController.getAvailableExams
);

/**
 * @route POST /api/v1/exam/start/:exam_id
 * @desc Start an exam
 * @access Private (for students)
 */
router.post(
  "/start/:room_id",
  [authMiddleware, studentMiddleware],
  [check("exam_id", "Exam ID is required").notEmpty()],
  authController.startExam
);

router.post(
  "/submit/:room_id/:exam_id",
  [
    check("answers", "Answers are required").isArray().notEmpty(),
  ],
  [authMiddleware, studentMiddleware],
  authController.submitExamAnswers
);

export default router;
