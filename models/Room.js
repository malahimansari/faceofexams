import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  code: { type: String, unique: true, required: true },
  capacity: { type: Number, required: true },
  scheduledExams: [{
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    date: { type: Date, required: true },
  }],
  isAvailable: { type: Boolean, default: true },
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
