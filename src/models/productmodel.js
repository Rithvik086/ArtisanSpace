import mongoose from "mongoose";
import { Types } from "mongoose";
import Cart from "./cartmodel.js";

const productSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  uploadedBy: {
    type: String,
    required: true,
    enum: {
      values: ["artisan", "manager"],
      message: "{VALUE} is not allowed to upload products.",
    },
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: { type: String, required: true },
  oldPrice: { type: Number, required: true },
  newPrice: { type: Number, required: true },
  quantity: {
    type: Number,
    default: 1,
    validate: {
      validator: Number.isInteger,
      mesage: "{VALUE} is not a valid number",
    },
  },
  description: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["approved", "pending", "disapproved"],
      message: "{VALUE} is not a valid status",
    },
  },
});

productSchema.pre(
  "deleteOne",
  { document: true, query: true },
  async function (next) {
    try {
      await Promise.all([Cart.deleteMany({ productId: this._id })]);
      next();
    } catch (error) {
      next(error);
    }
  }
);

export default mongoose.model("Product", productSchema);

