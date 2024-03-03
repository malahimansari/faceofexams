import { Router } from "express";
import { check } from "express-validator";
const router = Router();
import userController from "../controllers/userController.js";

/**
 * @route POST /api/v1/users/register_user
 * @desc Create a new user
 * @access public
 */

router.post(
  "/register_user",
  [
    check("name", "Please enter your fullname").not().isEmpty(),
    check("email", "Please enter a valid email address").isEmail(),
    check(
      "password",
      "Please Enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  userController.register_user
);

export default router;
