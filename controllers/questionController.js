import { validationResult } from "express-validator";
import Question from "../models/Question.js";
import Room from "../models/Room.js";

const getQuestionsForRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId;

    // Retrieve questions for the specified room
    const questions = await Question.find({ room: roomId });

    res.json({ questions });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

const createQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { text, type, options, correctAnswer } = req.body;
  try {
    const newQuestion = new Question({
      text,
      type,
      options,
      correctAnswer,
    });

    await newQuestion.save();
    return res.json({
      msg: "Question created successfully",
      question: newQuestion,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

export default { createQuestion, getQuestionsForRoom };
