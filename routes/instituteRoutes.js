import { Router } from "express";
import { check } from "express-validator";
const institute_router = Router();

// Controllers
import instituteController from "../controllers/instituteController.js";

/**
 * @route POST /api/v1/institute/register
 * @desc register in user
 * @access public
 */




/**
 *  @swagger
 * /api/v1/institute/register:
 *   post:
 *     summary: institute register
 *     tags: [Institute]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 format: text
 *                 description: Institute Name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: enter a valid email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: password (at least 6 characters)
 *               phone:
 *                 type: string
 *                 format: text
 *                 description: enter a valid phone number
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




institute_router.post(
  "/register",
  [
    check("name", "Please enter institute name").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please Enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("phone", "Please Enter a valid phone number").isLength({
      min: 10,
      max: 13,
    }),
  ],
  instituteController.register_institute
);




/**
 *  @swagger
 * /api/v1/institute/login:
 *   post:
 *     summary: institute login
 *     tags: [Institute]
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





institute_router.post("/login", [
  check("email", "Please enter your valid email").isEmail(),
  check("password", "Please enter your valid password").exists(),
],
  instituteController.login_institute
);

export default institute_router;
