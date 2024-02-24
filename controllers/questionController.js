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
  try {
    const { text, options, correctAnswer } = req.body;

    const instituteId = req.institute.id;

    // Retrieve the first room associated with the institute
    const room = await Room.findOne({ institute: instituteId });

    if (!room) {
      return res.status(404).json({ msg: "No rooms found for the institute" });
    }

    const question = new Question({
      text,
      options,
      correctAnswer,
      room,
      institute: req.institute.id,
    });

    await question.save();

    res.json({ msg: "Question created successfully", question });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

export default { createQuestion, getQuestionsForRoom };
