import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: [
    {
      status: {
        type: Number,
        enum: [0, 1, 2, 3, 4], //0: student, 1: teacher, 2: user, 3: institute admin, 4: super admin
        default: 2,
        required: true,
      },
      room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", userSchema);

export default User;
