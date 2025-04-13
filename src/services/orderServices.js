import mongoose from "mongoose";
import Order from "../models/ordersModel.js";
import { getCart, removeCart } from "./cartServices.js";
import { decreaseProductQuantity, productCount } from "./productServices.js";

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

export async function placeOrder(userId, money) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const cart = await getCart(userId, session);

    if (!cart || cart.length === 0) {
      throw new Error("Cart is empty!");
    }

    for (const item of cart) {
      const count = await productCount(item.productId._id, session);

      if (count) {
        const newStock = count - item.quantity;

        if (newStock < 0) {
          throw new Error("Stock limit reached");
        }
        let response;

        response = await decreaseProductQuantity(
          item.productId._id,
          newStock,
          session
        );

        if (!response.success) {
          throw new Error("Error changePtoductQuantity failed: ");
        }
        await Order.findOneAndUpdate(
          { userId },
          {
            $addToSet: {
              products: {
                productId: item.productId._id,
                quantity: item.quantity,
              },
              money,
              purchasedAt: Date.now(),
              status: "pending",
            },
          },
          { new: true, runValidators: true, upsert: true, session }
        );

        response = await removeCart(userId, session);

        if (!response.success) {
          throw new Error("Error removeCart failed: ");
        }
      } else {
        throw new Error("Product not found");
      }
    }
    await session.commitTransaction();
    return { success: true, message: "Order placed successfully!" };
  } catch (e) {
    await session.abortTransaction();
    throw new Error("Error placing order: " + e.message);
  } finally {
    session.endSession();
  }
}
