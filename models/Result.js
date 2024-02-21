import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  score: { type: Number },
  passStatus: { type: Boolean },
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
