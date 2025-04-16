import mongoose from "mongoose";
import Product from "../models/productmodel.js";

export async function addProduct(
  userId,
  uploadedBy,
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
      userId,
      uploadedBy,
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
      throw new Error("Invalid product ID");
    }

    const product = await Product.findById(productId).session(session);
    if (!product) {
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

export async function getProduct(productId) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (e) {
    throw new Error("Error getting product: " + e.message);
  }
}

export async function getProducts(artisanId = null, approved = false) {
  try {
    let products;
    if (artisanId) {
      if (approved) {
        products = await Product.find({
          userId: artisanId,
          status: "approved",
        }).populate("userId");
      } else {
        products = await Product.find({ userId: artisanId }).populate("userId");
      }
    } else {
      if (approved) {
        products = await Product.find({ status: "approved" }).populate(
          "userId"
        );
      } else {
        products = await Product.find().populate("userId");
      }
    }
    return products;
  } catch (e) {
    throw new Error("Error getting products: " + e.message);
  }
}

export async function getProductsByRole(role) {
  try {
    const products = Product.find({ uploadedBy: role });
    return products;
  } catch (e) {
    throw new Error("Error getting products by role: " + e.message);
  }
}

export async function productCount(productId, session = null) {
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID");
    }

    let product;
    if (session && session.inTransaction()) {
      product = await Product.findOne({
        status: "approved",
        _id: productId,
      }).session(session);
    } else {
      product = await Product.findOne({
        status: "approved",
        _id: productId,
      });
    }

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
      throw new Error("Invalid product ID");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { status: "approved" },
      { new: true, runValidators: true, session }
    );

    if (!updatedProduct) {
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
      throw new Error("Invalid product ID");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { status: "disapproved" },
      { new: true, runValidators: true, session }
    );

    if (!updatedProduct) {
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
      return await Product.find({ status: "approved" }).populate("userId");
    } else {
      if (!Array.isArray(category)) {
        //checking if category is not a array
        return await Product.find({ status: "approved", category }).populate(
          "userId"
        );
      } else {
        return await Product.find({
          status: "approved",
          category: { $in: category },
        }).populate("userId");
      }
    }
  } catch (e) {
    throw new Error("Error getting approved products: " + e.message);
  }
}

export async function getDisapprovedProducts() {
  try {
    return await Product.find({ status: "disapproved" }).populate("userId");
  } catch (e) {
    throw new Error("Error getting disapproved products: " + e.message);
  }
}

export async function getPendingProducts() {
  try {
    return await Product.find({ status: "pending" }).populate("userId");
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

export async function decreaseProductQuantity(
  productId,
  quantity,
  session = null
) {
  let newSession = false;

  if (!session) {
    session = await mongoose.startSession();
    session.startTransaction();
    newSession = true;
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID");
    }

    const count = await productCount(productId, session);

    if (count < quantity) {
      throw new Error("Not enough stock");
    }
    if (quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }
    if (quantity === 0) {
      throw new Error("Quantity cannot be zero");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { quantity },
      { new: true, runValidators: true, session }
    );

    if (!updatedProduct) {
      throw new Error("Product not found");
    } else {
      if (newSession) {
        await session.commitTransaction();
      }
      return {
        success: true,
        message: "Product quantity updated successfully!",
      };
    }
  } catch (e) {
    if (newSession) {
      await session.abortTransaction();
    }
    throw new Error("Error decreasing product quantity: " + e.message);
  } finally {
    if (newSession) {
      session.endSession();
    }
  }
}

export async function updateProduct(
  productId,
  name,
  oldPrice,
  newPrice,
  quantity,
  description
) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, oldPrice, newPrice, quantity, description },
      { new: true, runValidators: true, session }
    );

    if (!updatedProduct) {
      throw new Error("Product not found");
    } else {
      await session.commitTransaction();
      return { success: true, message: "Product updated successfully!" };
    }
  } catch (e) {
    await session.abortTransaction();
    throw new Error("Error updating product: " + e.message);
  } finally {
    session.endSession();
  }
}
