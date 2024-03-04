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

<<<<<<< HEAD
router.post(
=======

/**
 *  @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Register]
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
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ msg: 'Please enter your email address.' }, { msg: 'Please insert at least 6 characters.' }]
 *       409:
 *         description:  Bad request ( user not exists)
 *         content:
 *           application/json:
 *             example:
 *               msg: 'User Not exists'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: 'Server error'
 */


auth_router.post(
>>>>>>> d154fd95f4320f61086687d0caa1ecf88dc931bf
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
