import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Institute from "../models/Institute.js";

//register_institute
const register_institute = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ msg: result.array() });
  }
  const { name, email, password, phone } = req.body;
  try {
    let institute = await Institute.findOne({ email });
    if (institute) {
      return res.status(400).json({ msg: "Email Already Exists" });
    }
    institute = new Institute({
      name,
      email,
      password,
      phone,
    });
    const salt = await bcrypt.genSalt(10);
    institute.password = await bcrypt.hash(password, salt);

    await institute.save();

    const payload = {
      institute: {
        id: institute.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: 3600000 },
      (err, token) => {
        if (err) throw err;
        return res.json({
          token,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const login_institute = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ msg: result.array() });
  }
  const { email, password } = req.body;
  try {
    const institute = await Institute.findOne({ email });
    if (!institute) {
      return res.status(400).json({ msg: "Institute not exists" });
    }
    const isMatch = await bcrypt.compare(password, institute.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }
    const payload = {
      institute: {
        id: institute.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: 3600000 },
      (err, token) => {
        if (err) throw err;
        return res.json({
          token,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

export default { register_institute, login_institute };
