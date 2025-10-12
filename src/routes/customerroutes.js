import express from "express";
import authorizerole from "../middleware/roleMiddleware.js";
import upload from "../middleware/multer.js";

import {
  getHomePage,
  getStorePage,
  addToCart,
  getCartController,
  editCart,
  getWorkshopPage,
  bookWorkshopPage,
  getCustomOrderPage,
  reqCustomOrder,
  checkout,
  placeOrderController,
  getSettingsCustomer,
  getOrdersPageCustomer,
  checkout1,
} from "../controller/customerController.js";

const router = express.Router();

router.use(authorizerole("admin", "manager", "artisan", "customer"));

router.get("/", getHomePage);

// API endpoint for homepage products (first 10)
import { getProducts } from "../services/productServices.js";
router.get("/api/products", async (req, res) => {
  try {
    const products = await getProducts(null, true);
    res.json(products.slice(0, 10));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});
router.get("/orders/:orderId", getOrdersPageCustomer);
router.get("/store", getStorePage);
router.post("/store", addToCart);
router.get("/cart", getCartController);
router.post("/cart", editCart);
router.get("/workshop", getWorkshopPage);
router.post("/requestWorkshop", bookWorkshopPage);
router.get("/customorder", getCustomOrderPage);
router.post("/customorder", upload.single("image"), reqCustomOrder);
router.get("/checkout", checkout);
router.get("/checkout-products", checkout1);
router.post("/place-order", placeOrderController);
router.get("/settings", getSettingsCustomer);

export default router;
