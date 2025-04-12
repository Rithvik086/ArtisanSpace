import Order from "../models/Order.js";
import { getCart } from "./cartServices";

export async function addOrder(userId, money) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const cart = await getCart(userId, session);

    if (cart.length === 0) {
      throw new Error("Cart is empty");
    }

    const order = new Order({
      cart,
      money,
      status: "pending",
    });
    await order.save({ session });
    await session.commitTransaction();
    return {
      success: true,
      message: "Order added successfully",
    };
  } catch (e) {
    await session.abortTransaction();
    throw new Error("Error adding order: " + e.message);
  } finally {
    session.endSession();
  }
}
