import mongoose, { Types } from "mongoose";

const customRequestSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
    required: true,
  },
  requiredBy: {
    type: String,
    required: true,
  },
  artisanId: {
    type: Types.ObjectId,
    ref: "User",
    default: null,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Request", customRequestSchema);
