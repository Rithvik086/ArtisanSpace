import express from "express";
import { getProducts } from "../models/productmodel.js";
import authorizerole from "../middleware/roleMiddleware.js";
import {
  addItem,
  deleteItem,
  getCart,
  removeCompleteItem,
} from "../models/cartmodel.js";

const router = express.Router();
const custrole = "customer";

router.use(authorizerole("admin", "manager", "artisan", "customer"));

router.get("/", async (req, res) => {
  const products = await getProducts();
  const pro = products.slice(0, 10);
  res.render("customer/customerhome", { role: custrole, products: pro });
});
router.get("/workshop", (req, res) => {
  res.render("customer/workshop", { role: custrole });
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
    const product = products.find((product) => product.id === item.productId);
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
    const { userId, productId, action } = req.query;
    if (action === "add") {
      await addItem(userId, productId);
    } else if (action === "del") {
      await deleteItem(userId, productId);
    } else if (action === "rem") {
      await removeCompleteItem(userId, productId);
    }
    res.json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/contactus", (req, res) => {
  res.render("customer/customercontactus", { role: custrole });
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
    await addItem(userId, productId);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
