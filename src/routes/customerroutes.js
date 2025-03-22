import express from "express";
import { getProducts } from "../models/productmodel.js";
import authorizerole from "../middleware/roleMiddleware.js";
import {
  addItem,
  changeProductAmount,
  deleteItem,
  getCart,
  removeCompleteItem,
} from "../models/cartmodel.js";
import { getUserById } from "../models/usermodel.js";
import { bookWorkshop } from "../models/workshopmodel.js";

const router = express.Router();
const custrole = "customer";

// router.use(authorizerole("admin", "manager", "artisan", "customer"));

router.get("/", async (req, res) => {
  const products = await getProducts();
  const pro = products.slice(0, 10);
  res.render("customer/customerhome", { role: custrole, products: pro });
});

router.get("/settings", (req, res) => {
  res.json({ message: "settings" });
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

router.get("/store", async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await getProducts();

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
      user.username,
      user.email,
      user.pno || "9090909090", // Use user's phone if available, otherwise use default
      workshopTitle,
      workshopDesc,
      date,
      time
    );

    res.json({
      success: true,
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

export default router;
