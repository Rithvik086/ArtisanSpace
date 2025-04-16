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
    let cart = await getCart(userId, session);

    if (!cart || cart.length === 0) {
      throw new Error("Cart is empty!");
    }

    // Checking if user have products in cart as well as reducing them from inventory
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
      } else {
        throw new Error("Product not found");
      }
    }

    //adding money and status and timestamp to the order
    delete cart._id;
    cart.money = money;
    cart.purchasedAt = new Date();
    cart.status = "pending";

    // Adding order to the order collection
    await Order.insertOne(cart, {
      new: true,
      runValidators: true,
      upsert: true,
      session,
    });

    //removeing the cart from the cart collection
    response = await removeCart(userId, session);

    if (!response.success) {
      throw new Error("Error removeCart failed: ");
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
