import mongoose from "mongoose";
import Product from "../models/productmodel.js";

//TODO: need to change the type of product to category

export async function addProduct(
  artisanId,
  name,
  category,
  image,
  oldPrice,
  quantity,
  description
) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    oldPrice = parseFloat(oldPrice).toFixed(2);
    quantity = parseInt(quantity);
    const newPrice = (oldPrice * 0.9).toFixed(2);

    const product = new Product({
      artisanId,
      name,
      category,
      image,
      oldPrice,
      newPrice,
      quantity,
      description,
      status: "pending",
    });

    await product.save({ session });
    await session.commitTransaction();
    return { success: true };
  } catch (e) {
    await session.abortTransaction();
    throw new Error("Error adding product: " + e.message);
  } finally {
    session.endSession();
  }
}

export async function deleteProduct(productId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      await session.abortTransaction();
      throw new Error("Invalid product ID");
    }

    const product = await Product.findById(productId);
    if (!product) {
      session.abortTransaction();
      throw new Error("Product not found");
    }

    await product.deleteOne({ session });
    await session.commitTransaction();
    return { success: true };
  } catch (e) {
    await session.abortTransaction();
    throw new Error("Error deleting product: " + e.message);
  } finally {
    session.endSession();
  }
}

export async function getProducts(artisanId) {
  try {
    const products = await Product.find({ artisanId });
    return products;
  } catch (e) {
    throw new Error("Error getting products: " + e.message);
  }
}

export async function productCount(productId) {
  try {
    const product = await Product.findOne({
      status: "approved",
      productId,
    });

    return product ? product.quantity : 0;
  } catch (e) {
    throw new Error("Error getting product count: " + e.message);
  }
}

export async function approveProduct(productId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      await session.abortTransaction();
      throw new Error("Invalid product ID");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { status: "approved" },
      { new: true, runValidators: true, session }
    );

    if (!updatedProduct) {
      await session.abortTransaction();
      throw new Error("Product not found");
    } else {
      await session.commitTransaction();
      return { success: true };
    }
  } catch (e) {
    await session.abortTransaction();
    throw new Error("Error approving product: " + e.message);
  } finally {
    session.endSession();
  }
}

export async function disapproveProduct(productId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      await session.abortTransaction();
      throw new Error("Invalid product ID");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { status: "disapproved" },
      { new: true, runValidators: true, session }
    );

    if (!updatedProduct) {
      await session.abortTransaction();
      throw new Error("Product not found");
    } else {
      await session.commitTransaction();
      return { success: true };
    }
  } catch (e) {
    await session.abortTransaction();
    throw new Error("Error approving product: " + e.message);
  } finally {
    session.endSession();
  }
}

export async function getApprovedProducts(category = null) {
  try {
    // if no category is provided, return all approved products
    if (!category) {
      return await Product.find({ status: "approved" });
    } else {
      if (!Array.isArray(category)) {
        //checking if category is not a array
        return await Product.find({ status: "approved", category });
      } else {
        return await Product.find({
          status: "approved",
          category: { $in: category },
        });
      }
    }
  } catch (e) {
    throw new Error("Error getting approved products: " + e.message);
  }
}

export async function getDiassprovedProducts() {
  try {
    return await Product.find({ status: "disapproved" });
  } catch (e) {
    throw new Error("Error getting disapproved products: " + e.message);
  }
}

export async function getPendingProducts() {
  try {
    return await Product.find({ status: "pending" });
  } catch (e) {
    throw new Error("Error getting pending products: " + e.message);
  }
}

export async function getProductsCount() {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Ensure all expected statuses are present
    const counts = {
      approved: 0,
      pending: 0,
      disapproved: 0,
    };

    result.forEach(({ _id, count }) => {
      counts[_id] = count;
    });

    return counts;
  } catch (e) {
    throw new Error("Error getting products count: " + e.message);
  }
}
