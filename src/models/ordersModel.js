import mongoose, { Types } from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  products: [
    {
      productId: {
        name: String,
        category: String,
        material: String,
        image: String,
        oldPrice: String,
        newPrice: String,
        quantity: Number,
        description: String,
      },
      quantity: {
        type: Number,
        default: 1,
        validate: {
          validator: Number.isInteger,
          message: "{VALUE} is not a valid number",
        },
      },
    },
  ],
  money: {
    type: Number,
    required: true,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "delivered", "cancelled"],
  },
});

export default mongoose.model("Order", orderSchema);
