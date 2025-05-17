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
} from "../controller/customerController.js";

const router = express.Router();

router.use(authorizerole("admin", "manager", "artisan", "customer"));

router.get("/", getHomePage);
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
router.post("/place-order", placeOrderController);
router.get("/settings", getSettingsCustomer);

export default router;
