import {
  getApprovedProducts,
  getProducts,
} from "../services/productServices.js";
import path from "path";
import {
  addItem,
  changeProductAmount,
  deleteItem,
  getCart,
  removeCompleteItem,
} from "../services/cartServices.js";
import { getUserById } from "../services/userServices.js";
import {
  bookWorkshop,
  getWorkshopByUserId,
} from "../services/workshopServices.js";

import cloudinary from "../config/cloudinary.js";
import { addRequest, getRequestById } from "../services/requestServices.js";
import {
  getOrderByOrderId,
  getOrdersById,
  placeOrder,
} from "../services/orderServices.js";
const custrole = "customer";

export const getHomePage = async (req, res) => {
  res.sendFile(
    path.join(process.cwd(), "src/views/customer/customerhome.html")
  );
};

export const getOrdersPageCustomer = async (req, res) => {
  res.sendFile(
    path.join(process.cwd(), "src/views/customer/orderDetails.html")
  );
};

export const getStorePage = async (req, res) => {
  res.sendFile(path.join(process.cwd(), "src/views/customer/store.html"));
};

export const addToCart = async (req, res) => {
  const { productId } = req.query;
  const userId = req.user.id;
  try {
    res.json(await addItem(userId, productId));
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Orders

export const getCartController = async (req, res) => {
  res.sendFile(
    path.join(process.cwd(), "src/views/customer/customerCart.html")
  );
};

export const editCart = async (req, res) => {
  try {
    const { userId, productId, action, amount } = req.query;
    let msg;
    if (action === "add") {
      msg = await addItem(userId, productId);
    } else if (action === "del") {
      msg = await deleteItem(userId, productId);
    } else if (action === "rem") {
      msg = await removeCompleteItem(userId, productId);
    } else if (action === "none") {
      msg = await changeProductAmount(userId, productId, amount);
    }
    res.json(msg);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Workshops

export const getWorkshopPage = (req, res) => {
  res.sendFile(path.join(process.cwd(), "src/views/customer/workshop.html"));
};

export const bookWorkshopPage = async (req, res) => {
  const { workshopTitle, workshopDesc, date, time } = req.body;
  console.log(workshopTitle, workshopDesc);

  if (!workshopTitle || !workshopDesc || !date || !time) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required!" });
  }

  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const newWorkshop = await bookWorkshop(
      req.user.id,
      workshopTitle,
      workshopDesc,
      date,
      time
    );

    res.json({
      success: newWorkshop.success,
      message: "Workshop booked!",
      workshop: newWorkshop,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to book workshop" });
  }
};

//Custom orders

export const getCustomOrderPage = (req, res) => {
  res.sendFile(path.join(process.cwd(), "src/views/customer/customorder.html"));
};

export const reqCustomOrder = async (req, res) => {
  try {
    const { title, type, description, budget, requiredBy } = req.body;
    if (!title || !type || !description || !budget || !requiredBy) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled!",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    const result = await cloudinary.uploader.upload(req.file.path);
    const newrequest = await addRequest(
      req.user.id,
      title,
      type,
      result.secure_url,
      description,
      budget,
      requiredBy
    );
    res.json({
      success: true,
      message: "Custom order submitted successfully!",
      request: newrequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to submit request please try again later",
    });
  }
};

//checkout Page
export const checkout = async (req, res) => {
  res.sendFile(path.join(process.cwd(), "src/views/customer/checkout.html"));
};

export const checkout1 = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await getCart(userId);

    if (!cart || cart.length === 0) {
      return res.redirect("/customer/orders");
    }

    const products = await getProducts();

    // Calculate total amount
    let amount = 0;
    cart.forEach((item) => {
      if (item) {
        amount += item.productId.newPrice * item.quantity;
      }
    });

    // Calculate shipping and tax
    const shipping = 50; // Fixed shipping fee
    const tax = Math.round(amount * 0.05 * 100) / 100; // 5% tax
    let user = await getUserById(userId);

    res.json({ cart, amount });
  } catch (error) {
    console.error("Error loading checkout page:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to load checkout page" });
  }
};

export const placeOrderController = async (req, res) => {
  try {
    const userId = req.user.id;

    const response = await placeOrder(userId);

    if (response.success) {
      res.status(200).json(response);
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to place Order!" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Failed to place Order!" });
  }
};

export const getSettingsCustomer = async (req, res) => {
  const user = await getUserById(req.user.id);
  delete user.password;
  delete user.userId;
  delete user.role;
  res.render("settings", { role: custrole, user });
};
