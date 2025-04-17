import mongoose from "mongoose";
import { Types } from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },

  products: [
    {
      productId: {
        type: Types.ObjectId,
        required: true,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
        validate: {
          validator: Number.isInteger,
          mesage: "{VALUE} is not a valid number",
        },
      },
    },
  ],
});

export default mongoose.model("Cart", cartSchema);
