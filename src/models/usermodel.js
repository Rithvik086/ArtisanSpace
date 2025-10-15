import mongoose from "mongoose";

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

userSchema.post("deleteOne", { query: true }, async function (_, next) {
  const userId = this.getFilter()._id;
  if (!userId) return next();

  try {
    // Get models by their registered names
    const Product = mongoose.model("Product");
    const Cart = mongoose.model("Cart");
    const Ticket = mongoose.model("Ticket"); // Correct name from supportticketmodel.js
    const Workshop = mongoose.model("Workshop");
    const Request = mongoose.model("CustomRequest"); // Correct name from customRequestModel.js

    await Promise.all([
      Product.deleteMany({ userId }),
      Cart.deleteMany({ userId }),
      Ticket.deleteMany({ userId }),
      Workshop.deleteMany({ userId }),
      Workshop.updateMany(
        { artisanId: userId },
        { $set: { artisanId: null, status: 0 } }
      ),
      Request.deleteMany({ userId }),
      Request.updateMany(
        { artisanId: userId },
        { $set: { artisanId: null, isAccepted: false } }
      ),
    ]);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.User || mongoose.model("User", userSchema);