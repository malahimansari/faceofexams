import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register User
const register_user = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        msg: "User Already Exists",
      });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        return res.json({
          token,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      msg: "Server Error",
    });
  }
};

export default { register_user };
