import express from "express";
import { getProducts } from "../models/productmodel.js";

const router = express.Router();

const custrole = "customer";

router.get("/", (req, res) => {
  res.render("customer/customerhome", { role: custrole });
});
router.get("/workshop", (req, res) => {
  res.render("customer/workshop", { role: custrole });
});
router.get("/settings", (req, res) => {
  res.json({ message: "settings" });
});

router.get("/orders", (req, res) => {});

router.get("/store", async (req, res) => {
  try {
    const products = await getProducts();

    const page = parseInt(req.query.page) || 1;
    const limit = 12;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedProducts = products.slice(startIndex, endIndex);

    const totalProducts = await products;
    res.render("store", {
      products: paginatedProducts,
      currentPage: page,
      totalPages: Math.ceil(products.length / limit),
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
export default router;
