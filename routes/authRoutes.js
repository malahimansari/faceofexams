import { Router } from "express";
import { check } from "express-validator";
const auth_router = Router();

// Controller
import authController from "../controllers/authController.js";

// Middleware
import authMiddleware from "../middlewares/authMiddleware.js";


/**
 * @route GET /api/v1/auth
 * @desc get loged in data
 * @access private
 */


auth_router.get(
  "/",
  authMiddleware,
  authController.get_login
)



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
  "/login",
  [
      check("email", "Please enter your valid email").isEmail(),
      check("password", "Please enter your valid password").exists(),
  ],
  authController.auth_login
)


export default auth_router;