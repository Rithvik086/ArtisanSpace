import express from "express";
import { getProducts } from "../models/productmodel.js";

const router = express.Router();

router.get("/", (req, res) => {});

router.get("/workshop", (req, res) => {
  res.render("workshop");
});
router.get("/settings", (req, res) => {});

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
