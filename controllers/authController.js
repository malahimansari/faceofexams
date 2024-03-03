import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Question from "../models/Question.js";
import Exam from "../models/Exam.js";
import Result from "../models/Result.js";

//get login
const get_login = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

//login user
const auth_login = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ result: result.array() });
  }
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not exists" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }
    const payload = {
      user: {
        id: user.id,
        role: user.role,
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

//get available exams
const getAvailableExams = async (req, res) => {
  try {
    const room_id = req.params.room_id;

    const availableExams = await Exam.find({ room: room_id });

    res.json({ exams: availableExams });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Start Exam Logic
const startExam = async (req, res) => {
  const room_id = req.params.room_id;

  try {
    const availableExams = await Exam.find({ room: room_id });
    if (!availableExams) {
      return res.status(404).json({ msg: "Exam not found." });
    }

    const { exam_id } = req.body;

    // Check if the exam exists
    const exam = await Exam.findById(exam_id);

    if (!exam) {
      return res.status(404).json({ msg: "Exam not found." });
    }

    // Check Exam Availability
    const currentDateTime = new Date();
    if (
      currentDateTime < exam.scheduledStartTime ||
      currentDateTime > exam.scheduledEndTime
    ) {
      return res
        .status(403)
        .json({ msg: "Unauthorized. Exam is not available at this time." });
    }

    // if (exam.maxAttempts > 0 && exam.attempts >= exam.maxAttempts) {
    //   return res
    //     .status(403)
    //     .json({ msg: "Unauthorized. Maximum attempts reached for this exam." });
    // }

    // if (exam.status === "not_started") {
    //   exam.status = "in_progress";
    //   await exam.save();
    // }

    return res.json({ msg: "Exam started successfully", exam });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const submitExamAnswers = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const { answers } = req.body;

    const exam = await Exam.findById(exam_id);

    if (!exam) {
      return res.status(404).json({ msg: "Exam not found." });
    }

    const questionIds = exam.questions.map((question) => question.toString());

    const isValidAnswers = answers.every((answer) =>
      questionIds.includes(answer.question_id)
    );

    if (!isValidAnswers) {
      return res.status(400).json({ msg: "Invalid answers provided." });
    }

    const questions = await Question.find({ _id: { $in: questionIds } });

    // answers.forEach((answer) => {
    //   const question = questions.find(
    //     (q) => q && q._id.toString() === answer.question_id
    //   );

    //   console.log("correctAnswer:", question.correctAnswer);
    // });

    const user = await User.findById(req.user.id);

    const userExam = user.role.find((role) => {
      const matchCondition =
        role.status === 0 &&
        String(role.room_id) === exam.room.toString() &&
        role.exams.some(
          (userExam) =>
            userExam.exam_id.equals(exam._id) &&
            userExam.attempts < exam.maxAttempts
        );

      return matchCondition;
    });

    console.log(userExam)
    if (!userExam) {
      return res
        .status(403)
        .json({ msg: "Unauthorized. User has no access or maximum attempts reached for this exam." });
    }
    const score = calculateScore(answers, questions, exam.maxScore);

    const result = new Result({
      user: req.user.id,
      exam: exam._id,
      score,
      totalQuestions: questionIds.length,
      answeredQuestions: answers.length,
    });

    await User.updateOne(
      {
        _id: req.user.id,
        "role.exams.exam_id": exam._id.toString(),
        "role.exams.attempts": { $lt: exam.maxAttempts },
      },
      {
        $set: {
          "role.$[roleElem].exams.$[examElem].result": result._id,
        },
        $inc: {
          "role.$[roleElem].exams.$[examElem].attempts": 1,
        },
      },
      {
        arrayFilters: [
          { "roleElem.room_id": exam.room.toString() },
          { "examElem.exam_id": exam._id.toString() },
        ],
      }
    );

    await result.save();

    return res.json({ msg: "Exam submitted successfully", result });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const calculateScore = (answers, questions, maxScore) => {
  const scorePerQuestion = maxScore / questions.length;
  let score = 0;

  answers.forEach((answer) => {
    const question = questions.find(
      (q) => q && q._id && q._id.toString() === answer.question_id
    );

    if (question && question.correctAnswer === answer.selected_option) {
      score += scorePerQuestion;
    }
  });

  return score;
};

export default {
  auth_login,
  get_login,
  getAvailableExams,
  startExam,
  submitExamAnswers,
};
