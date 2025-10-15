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
    // Lookup models safely (some models may register under different names)
    function safeModel(name) {
      try {
        return mongoose.model(name);
      } catch (e) {
        return null;
      }
    }

    const Product = safeModel("Product");
    const Cart = safeModel("Cart");
    const Ticket = safeModel("Ticket"); // support ticket model
    const Workshop = safeModel("Workshop");
    // The custom request model is registered as "Request" in customRequestModel.js
    const Request = safeModel("Request") || safeModel("CustomRequest");
    const Order = safeModel("Order");

    const tasks = [];
    if (Product) tasks.push(Product.deleteMany({ userId }));
    if (Cart) tasks.push(Cart.deleteMany({ userId }));
    if (Ticket) tasks.push(Ticket.deleteMany({ userId }));
    if (Workshop) tasks.push(Workshop.deleteMany({ userId }));
    if (Workshop)
      tasks.push(
        Workshop.updateMany(
          { artisanId: userId },
          { $set: { artisanId: null, status: 0 } }
        )
      );
    if (Request) tasks.push(Request.deleteMany({ userId }));
    if (Order) tasks.push(Order.deleteMany({ userId }));
    if (Request)
      tasks.push(
        Request.updateMany(
          { artisanId: userId },
          { $set: { artisanId: null, isAccepted: false } }
        )
      );

    if (tasks.length > 0) await Promise.all(tasks);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.User || mongoose.model("User", userSchema);
