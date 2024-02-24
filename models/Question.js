import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' },
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
