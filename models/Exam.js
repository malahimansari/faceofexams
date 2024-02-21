import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  duration: { type: Number, required: true }, // Duration in minutes
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  maxScore: { type: Number, default: 100 },
  passingScore: { type: Number, default: 60 },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  maxAttempts: { type: Number, default: 1 },
});

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
