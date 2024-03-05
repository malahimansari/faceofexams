import { Router } from "express";
import { check } from "express-validator";
const user_router = Router();
import userController from "../controllers/userController.js";


/**
 * @route POST /api/v1/users/register_user
 * @desc Create a new user
 * @access public
 */




/**
 * @swagger
 * tags:
 *   name: All APIs
 *   description: Register -> Login -> Create Institute -> Create Room -> Create Exam -> Create Question
 */
/**
 * @swagger
 * /api/v1/users/register_user:
 *   post:
 *     summary: User SignUp
 *     tags: [Register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
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
 *         description: Successful signup
 *         content:
 *           application/json:
 *             example:
 *               token: <JWT_TOKEN>
 *       400:
 *         description: Bad request (validation errors)
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ msg: 'Please enter your full name.' }, { msg: 'Please enter your email address.' }, { msg: 'Please insert at least 6 characters.' }]
 *       409:
 *         description: Conflict (user already exists)
 *         content:
 *           application/json:
 *             example:
 *               msg: 'User already exists'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               msg: 'Server error'
 */





user_router.post(
    "/register_user",
    [
        check("name", "Please enter your fullname").not().isEmpty(),
        check("email", "Please enter a valid email address").isEmail(),
        check("password", "Please Enter a password with 6 or more characters").isLength({ min: 6 }),
    ], userController.register_user

)



export default user_router;