import mongoose, { get } from "mongoose";
import Cart from "../models/cartmodel.js";
import { productCount } from "./productServices.js";

//NOTE: this function now outputs a array of objects containing the productId and quantity
export async function getCart(userId, session = null) {
  try {
    let cart;
    if (session) {
      cart = await Cart.findOne({ userId }, { products: 1, _id: 0 })
        .populate("products.$.productId")
        .session(session);
    } else {
      cart = await Cart.findOne({ userId }, { products: 1, _id: 0 }).populate(
        "products.productId"
      );
    }
    if (cart === null) {
      return [];
    }
    return cart.products;
  } catch (e) {
    throw new Error("Error fetching cart: " + e.message);
  }
}

export async function getCartProductQuantity(
  userId,
  productId,
  session = null
) {
  try {
    let cart;
    if (session) {
      cart = await Cart.findOne(
        { userId, "products.productId": productId },
        { "products.$": 1, _id: 0 }
      ).session(session);
    } else {
      cart = await Cart.findOne(
        { userId, "products.productId": productId },
        { "products.$": 1, _id: 0 }
      );
    }
    console.log(cart);

    if (!cart || !cart.products || cart.products.length === 0) {
      return 0; // Product not found in cart
    }
    return cart.products[0].quantity;
  } catch (e) {
    throw new Error("Error fetching cart: " + e.message);
  }
}

export async function addItem(userId, productId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const productQuantity = await productCount(productId, session);
    let cartQuantity = 0;

    cartQuantity = await getCartProductQuantity(userId, productId, session);
    console.log(
      "productQuantity",
      productQuantity,
      "cartQuantity",
      cartQuantity
    );
    if (productQuantity > cartQuantity) {
      if (cartQuantity > 0) {
        // Update the quantity of the existing product in the cart
        await Cart.findOneAndUpdate(
          { userId, "products.productId": productId },
          { $inc: { "products.$.quantity": 1 } },
          { new: true, runValidators: true, session }
        );
        await session.commitTransaction();
        return { success: true, message: "Cart updated!" };
      } else {
        // Add the product to the cart if it doesn't exist
        await Cart.findOneAndUpdate(
          { userId },
          { $addToSet: { products: { productId, quantity: 1 } } },
          { new: true, upsert: true, runValidators: true, session }
        );
        await session.commitTransaction();
        return { success: true, message: "Product added to cart!" };
      }
    } else {
      return { success: false, message: "Stock limit reached" };
    }
  } catch (e) {
    await session.abortTransaction();
    throw new Error("Error adding item to cart: " + e.message);
  } finally {
    session.endSession();
  }
}

export async function deleteItem(userId, productId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userProductCount = await getCartProductQuantity(
      userId,
      productId,
      session
    );
    const userCart = await getCart(userId, session);
    const productCount = userCart.length;

    if (userProductCount > 1) {
      // Update the quantity of the existing product in the cart
      await Cart.findOneAndUpdate(
        { userId, "products.productId": productId },
        { $inc: { "products.$.quantity": -1 } },
        { new: true, runValidators: true, session }
      );
      await session.commitTransaction();
      return { success: true, message: "Cart updated!" };
    } else {
      if (productCount > 1) {
        // Remove the product from the cart if its quantity is 1
        await Cart.findOneAndUpdate(
          { userId },
          { $pull: { products: { productId } } },
          { new: true, runValidators: true, session }
        );
        await session.commitTransaction();
        return { success: true, message: "Product removed from cart!" };
      } else {
        await Cart.deleteOne({ userId }, { session });
        await session.commitTransaction();
        return { success: true, message: "Cart deleted!" };
      }
    }
  } catch (e) {
    await session.abortTransaction();
    throw new Error("Error deleting item from cart: " + e.message);
  } finally {
    session.endSession();
  }
}

export async function changeProductAmount(userId, productId, amount) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const productQuantity = await productCount(productId, session);
    if (amount > productQuantity) {
      await Cart.findOneAndUpdate(
        { userId, "products.productId": productId },
        { "products.$.quantity": productQuantity },
        { new: true, runValidators: true, session }
      );
      await session.commitTransaction();
      return { success: true, message: "Inventory limit reached!" };
    } else {
      await Cart.findOneAndUpdate(
        { userId, "products.productId": productId },
        { "products.$.quantity": amount },
        { new: true, runValidators: true, session }
      );
      await session.commitTransaction();
      return { success: true, message: "Cart updated!" };
    }
  } catch (e) {
    await session.abortTransaction();
    throw new Error("Error changing product amount from cart: " + e.message);
  } finally {
    session.endSession();
  }
}

export async function removeCompleteItem(userId, productId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Cart.findOneAndDelete(
      { userId, "products.productId": productId },
      { new: true, runValidators: true, session }
    );
    await session.commitTransaction();
    return { success: true, message: "Product removed from cart!" };
  } catch (error) {
    await session.abortTransaction();
    throw new Error("Error removing complete item from cart " + error.message);
  } finally {
    session.endSession();
  }
}

export async function removeCart(userId) {
  try {
    await Cart.findOneAndDelete({ userId });
    if (!result) {
      throw new Error("Cart not found for the given userId.");
    }
    return { success: true, message: "Cart removed successfully." };
  } catch (error) {
    throw new Error("Error removing cart " + error.message);
  }
}

export async function removeProductFromAllCarts(productId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await Cart.updateMany(
      { "products.productId": productId },
      { $pull: { products: { productId } } },
      { new: true, runValidators: true, session }
    );
    if (result.modifiedCount === 0) {
      throw new Error("Product not found in any cart.");
    }
    await session.commitTransaction();
    return { success: true, message: "Product removed from all carts." };
  } catch (error) {
    await session.abortTransaction();
    throw new Error("Error removing product from all carts " + error.message);
  } finally {
    session.endSession();
  }
}
