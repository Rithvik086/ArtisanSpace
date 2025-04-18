import mongoose from "mongoose";
import Product from "./productmodel.js";
import Cart from "./cartmodel.js";
import Ticket from "./supportticketmodel.js";
import Workshop from "./workshopmodel.js";
import Request from "./customRequestModel.js";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile_no: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    required: true,
    enum: {
      values: ["admin", "manager", "artisan", "customer"],
      message: "{VALUE} is not a valid role",
    },
  },
});

userSchema.pre(
  "deleteOne",
  { document: true, query: true },
  async function (next) {
    try {
      await Promise.all([
        Product.deleteMany({ artisanId: this._id }),
        Cart.deleteMany({ userId: this._id }),
        Ticket.deleteMany({ userId: this._id }),
        Workshop.deleteMany({ userId: this._id }),
        Workshop.updateMany(
          { artisanId: this._id },
          { $set: { artisanId: null, status: 0 } }
        ),
        Request.deleteMany({ userId: this._id }),
        Request.updateMany(
          { artisanId: this._id },
          { $set: { artisanId: null, isAccepted: false } }
        ),
      ]);
      next();
    } catch (error) {
      next(error);
    }
  }
);

export default mongoose.model("User", userSchema);
