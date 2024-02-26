import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teachers: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      approved: { type: Boolean, default: false },
    },
  ],
  students: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      approved: { type: Boolean, default: true },
    },
  ],
  institute: { type: mongoose.Schema.Types.ObjectId, ref: "Institute" },
  scheduledExams: [
    {
      exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
      date: { type: Date, required: true },
    },
  ],
  isAvailable: { type: Boolean, default: true },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
