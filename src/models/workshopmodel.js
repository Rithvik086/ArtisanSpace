import mongoose, { Types } from "mongoose";

const workshopSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  workshopTitle: {
    type: String,
    required: true,
  },
  workshopDescription: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 0, // 0 for pending, 1 for accepted
  },
  artisanId: {
    type: Types.ObjectId,
    ref: "User",
    default: null,
  },
  acceptedAt: {
    type: String,
    default: null,
  },
});

export default mongoose.model("Workshop", workshopSchema);
