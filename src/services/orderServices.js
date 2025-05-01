import mongoose from "mongoose";
import Order from "../models/ordersModel.js";
import Cart from "../models/cartmodel.js";
import { getCart, removeCart } from "./cartServices.js";
import { decreaseProductQuantity, productCount } from "./productServices.js";

export async function placeOrder(userId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let cart = await getCart(userId, session);
    let amount = 0;

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

        amount += item.productId.newPrice * item.quantity;

        // Decreasing the product quantity
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

    amount = (amount + Math.round(amount * 0.05 * 100) / 100 + 50).toFixed(2); // 5% tax and 50 shipping

    cart = await Cart.findOne({ userId }).populate("products.productId");

    const cartObj = cart.toObject();

    //adding money and status and timestamp to the order
    delete cartObj._id;
    cartObj.money = amount;
    cartObj.purchasedAt = new Date();
    cartObj.status = "pending";

    // Adding order to the order collection
    await Order.insertOne(cartObj, {
      new: true,
      runValidators: true,
      upsert: true,
      session,
    });

    //removeing the cart from the cart collection
    const response = await removeCart(userId, session);

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

export async function getOrdersById(userId) {
  try {
    const orders = await Order.find({ userId }).populate("products.productId");
    if (!orders) {
      throw new Error("Orders not found!");
    }
    console.log(orders);
    return orders;
  } catch (err) {
    throw new Error("Error in getting order by ID: " + err.message);
  }
}

export async function totalOrders() {
  try {
    const allOrders = await Order.find();
    if (allOrders && allOrders.length > 0) {
      return allOrders;
    } else {
      return [];
    }
  } catch (e) {
    throw new Error("Error getting total orders: " + e.message);
  }
}
