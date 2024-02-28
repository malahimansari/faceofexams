import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: [{ type: String, enum: ['single-choice', 'multi-choice'], default: 'single-choice' }],
  options: [{ type: String }],
  correctAnswer: { type: String },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  institute: { type: mongoose.Schema.Types.ObjectId, ref: "Institute" },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
