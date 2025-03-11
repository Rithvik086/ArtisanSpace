import express from "express";
import { getProducts } from "../models/productmodel.js";
import { addItem, deleteItem, getCart } from "../models/cartmodel.js";

const router = express.Router();

const custrole = "customer";

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
  let cart = await getCart(userId);
  if (req.headers["x-requested-with"] === "XMLHttpRequest") {
    res.render("partials/cart", { cart, products, userId });
  } else {
    res.render("customer/customerorders", {
      role: custrole,
      cart,
      products,
      userId,
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
router.get("/aboutus", (req, res) => {
  res.render("customer/Aboutus", { role: custrole });
});

router.get("/store", async (req, res) => {
  try {
    const products = await getProducts();

    const page = parseInt(req.query.page) || 1;
    const limit = 12;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedProducts = products.slice(startIndex, endIndex);

    const totalProducts = await products;
    res.render("customer/store", {
      products: paginatedProducts,
      currentPage: page,
      totalPages: Math.ceil(products.length / limit),
      role: custrole,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
export default router;
