import mongoose, { Types } from "mongoose";

const ticketSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  subject: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: {
      values: ["open", "in-progress", "closed"],
      message: "{VALUE} is not a valid status",
    },
    default: "open",
  },
});

export default mongoose.model("Ticket", ticketSchema);
