import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  answers: [{ question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }, answer: String }],
  score: { type: Number },
});

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
