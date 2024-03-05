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


/**
 *  @swagger
 * /api/v1/auth/:
 *   get:
 *     summary: get user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               token: <JWT_TOKEN>
 *       400:
 *         description: Bad request (validation errors)
 *       409:
 *         description:  Bad request ( user not exists)
 *       500:
 *         description: Internal server error
 */

router.get("/", authMiddleware, authController.get_login);




/**
 * @route POST /api/v1/auth/login
 * @desc log in user
 * @access public
 */


/**
 *  @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [User]
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
 *       409:
 *         description:  Bad request ( user not exists)
 *       500:
 *         description: Internal server error
 */


router.post(
  "/login",
  [
      check("email", "Please enter your valid email").isEmail(),
      check("password", "Please enter your valid password").exists(),
  ],
  authController.auth_login
)

/**
 * @route GET /api/v1/exam/available-exams
 * @desc Get available exams for the student
 * @access Private (for students)
 */



/**
 *  @swagger
 * /api/v1/auth/available-exams/{room_id}:
 *   post:
 *     summary: available-exams
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: room_id
 *         schema:
 *           type: text
 *         description: ID of the room
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
 *       409:
 *         description:  Bad request ( user not exists)
 *       500:
 *         description: Internal server error
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



/**
 *  @swagger
 * /api/v1/auth/start/{room_id}:
 *   post:
 *     summary: start exam
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: room_id
 *         schema:
 *           type: text
 *         description: ID of the room
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
 *       409:
 *         description:  Bad request ( user not exists)
 *       500:
 *         description: Internal server error
 */
router.post(
  "/start/:room_id",
  [authMiddleware, studentMiddleware],
  [check("exam_id", "Exam ID is required").notEmpty()],
  authController.startExam
);



/**
 *  @swagger
 * /api/v1/auth/submit/{room_id}/{exam_id}:
 *   post:
 *     summary: submit exam
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: room_id
 *         schema:
 *           type: text
 *         description: ID of the room
 *       - in: path
 *         name: exam_id
 *         schema:
 *           type: text
 *         description: ID of the exam
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
 *       409:
 *         description:  Bad request ( user not exists)
 *       500:
 *         description: Internal server error
 */
router.post(
  "/submit/:room_id/:exam_id",
  [
    check("answers", "Answers are required").isArray().notEmpty(),
  ],
  [authMiddleware, studentMiddleware],
  authController.submitExamAnswers
);

export default router;
