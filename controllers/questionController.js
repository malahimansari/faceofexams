import { validationResult } from "express-validator";
import Question from "../models/Question.js";
import Room from "../models/Room.js";

const getQuestionsForRoom = async (req, res) => {
  try {
    const roomId = req.params.room_id;

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

  const { room_id } = req.params;

  try {


     // Check if the room exists
     const room = await Room.findById(room_id);
     if (!room) {
       return res.status(404).json({ msg: "Room not found" });
     }

    const { text, type, options, correctAnswer } = req.body;
    const newQuestion = new Question({
      text,
      type,
      options,
      correctAnswer,
      room: room_id,
      // institute: req.institute.id || req.user.id,
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
