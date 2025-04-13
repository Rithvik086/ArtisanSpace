import express from "express";
import authorizerole from "../middleware/roleMiddleware.js";
import upload from "../middleware/multer.js";

import {
  getHomePage,
  getStorePage,
  addToCart,
  getOrders,
  editCart,
  getWorkshopPage,
  bookWorkshopPage,
  getCustomOrderPage,
  reqCustomOrder,
  checkout,
  placeOrderController,
  getSettingsCustomer,
} from "../controller/customerController.js";

const router = express.Router();

router.use(authorizerole("admin", "manager", "artisan", "customer"));

router.get("/", getHomePage);
router.get("/store", getStorePage);
router.post("/store", addToCart);
router.get("/orders", getOrders);
router.post("/orders", editCart);
router.get("/workshop", getWorkshopPage);
router.post("/requestWorkshop", bookWorkshopPage);
router.get("/customorder", getCustomOrderPage);
router.post("/customorder", upload.single("image"), reqCustomOrder);
router.get("/checkout", checkout);
router.post("/place-order", placeOrderController);
router.get("/settings", getSettingsCustomer);

export default router;
