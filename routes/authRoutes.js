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


auth_router.post(
  "/login",
  [
      check("email", "Please enter your valid email").isEmail(),
      check("password", "Please enter your valid password").exists(),
  ],
  authController.auth_login
)


export default auth_router;