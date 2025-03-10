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

router.get("/orders", (req, res) => {
  res.render("customer/customerorders", {role : custrole})
});
router.get("/contactus", (req, res) => {
  res.render("customer/customercontactus", {role : custrole})
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
      role : custrole
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
export default router;
