import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Exam from "../models/Exam.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

const createExam = async (req, res) => {
  const { room_id } = req.params;

  if (!room_id || !mongoose.Types.ObjectId.isValid(room_id)) {
    return res.status(400).json({ msg: "Invalid Room ID" });
  }

  try {
    const existingRoom = await Room.findById(room_id);

    if (!existingRoom) {
      return res.status(404).json({ msg: "Room not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Server Error" });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, questions, duration, maxScore, passingScore, maxAttempts } =
    req.body;

  try {
    const newExam = new Exam({
      title,
      questions,
      duration,
      room: room_id,
      maxScore,
      passingScore,
      maxAttempts,
    });

    await newExam.save();

    const room = await Room.findById(room_id);

    room.scheduledExams.push({
      exam: newExam._id,
      date: new Date(),
    });

    await room.save();

    const studentIds = room.students.map((student) => student.user);

    await User.updateMany(
      { _id: { $in: studentIds }, "role.room_id": room_id },
      {
        $addToSet: {
          "role.$[roleElem].exams": {
            exam_id: newExam._id,
            result: null, // Adjust this based on your structure
          },
        },
      },
      {
        arrayFilters: [
          { "roleElem.room_id": room_id },
        ],
      }
    );

    return res.json({ msg: "Exam created successfully", exam: newExam });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

export default { createExam };
