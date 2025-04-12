import express from "express";
import {
  getApprovedProducts,
  getProducts,
} from "../services/productServices.js";
import {
  addItem,
  changeProductAmount,
  deleteItem,
  getCart,
  removeCompleteItem,
} from "../services/cartServices.js";
import { getUserById } from "../services/userServices.js";
import { bookWorkshop } from "../services/workshopServices.js";
import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.js";
import { addRequest } from "../services/requestServices.js";

const router = express.Router();
const custrole = "customer";

// router.use(authorizerole("admin", "manager", "artisan", "customer"));

router.get("/", async (req, res) => {
  const products = await getProducts();
  const pro = products.slice(0, 10);
  res.render("customer/customerhome", { role: custrole, products: pro });
});

router.get("/store", async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.query;
    const products = await getApprovedProducts(category);

    const page = parseInt(req.query.page) || 1;
    const limit = 12;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedProducts = products.slice(startIndex, endIndex);

    res.render("customer/store", {
      products: paginatedProducts,
      currentPage: page,
      totalPages: Math.ceil(products.length / limit),
      role: custrole,
      userId,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/store", async (req, res) => {
  const { userId, productId } = req.query;
  try {
    res.json(await addItem(userId, productId));
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/orders", async (req, res) => {
  const userId = req.user.id;
  const products = await getProducts();
  const cart = await getCart(userId);

  let amount = 0;
  for (const item of cart) {
    const product = products.find(
      (product) => product.productId === item.productId
    );
    amount += item.quantity * product.newPrice;
  }

  if (req.headers["x-requested-with"] === "XMLHttpRequest") {
    res.render("partials/cart", { cart, products, userId, amount });
  } else {
    res.render("customer/customerorders", {
      role: custrole,
      cart,
      products,
      userId,
      amount,
    });
  }
});

router.post("/orders", async (req, res) => {
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
});

router.get("/workshop", (req, res) => {
  res.render("customer/workshop", { role: custrole });
});

router.post("/requestWorkshop", async (req, res) => {
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
});

router.get("/customorder", (req, res) => {
  res.render("customer/customorder", { role: req.user.role });
});

router.post("/customorder", upload.single("image"), async (req, res) => {
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
});

router.get("/checkout", async (req, res) => {
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
      const product = products.find((p) => p.productId === item.productId);
      if (product) {
        amount += product.newPrice * item.quantity;
      }
    });

    // Calculate shipping and tax
    const shipping = 50; // Fixed shipping fee
    const tax = Math.round(amount * 0.05 * 100) / 100; // 5% tax
    let user = await getUserById(userId);

    res.render("customer/checkout", {
      role: custrole,
      // userId,

      cart,
      products,
      amount: amount.toFixed(2),
      shipping,
      tax,
      user,
    });
  } catch (error) {
    console.error("Error loading checkout page:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to load checkout page" });
  }
});

router.get("/settings", async (req, res) => {
  const user = await getUserById(req.user.id);
  delete user.password;
  delete user.userId;
  delete user.role;
  res.render("settings", { role: custrole, user });
});

export default router;
