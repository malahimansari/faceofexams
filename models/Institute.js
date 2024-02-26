import mongoose from "mongoose";

const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  logoUrl: { type: String },
  phone: { type: String, required: true },
  // category: {
  //   type: String,
  //   enum: ["university", "college", "school"],
  //   required: true,
  //   default: "school",
  // },
  subscription: {
    status: {
      type: String,
      enum: ["trial", "active", "inactive"],
      default: "trial",
    },
    trialEndDate: { type: Date },
    pricing: { type: Number },
  },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
});

const Institution = mongoose.model("Institution", institutionSchema);

export default Institution;
