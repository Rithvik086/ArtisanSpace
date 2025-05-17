import express from "express";
import { verifytoken } from "../middleware/authMiddleware.js";
import adminroutes from "../routes/adminroutes.js";
import managerroutes from "../routes/managerroutes.js";
import customerroutes from "../routes/customerroutes.js";
import artisanroutes from "../routes/artisanroutes.js";
import {
  deleteAccount,
  productPage,
  renderAboutUs,
  renderContactUs,
  renderSupportTicket,
  submitSuppotTicket,
  updatProfile,
  getCustomerChart,
  getOrdersChart,
  getProductsChart,
  getProductsApi,
} from "../controller/userController.js";
const router = express.Router();

router.use(verifytoken);

router.use("/admin", adminroutes);
router.use("/artisan", artisanroutes);
router.use("/customer", customerroutes);
router.use("/manager", managerroutes);
router.get("/aboutus", renderAboutUs);
router.get("/contactus", renderContactUs);
router.get("/supportTicket", renderSupportTicket);
router.post("/submit-ticket", submitSuppotTicket);
router.post("/update-profile", updatProfile);
router.get("/delete-account", deleteAccount);
router.get("/products/:productId", productPage);
router.get("/api/customer_chart", getCustomerChart);
router.get("/api/orders_chart", getOrdersChart);
router.get("/api/products_chart", getProductsChart);
router.get("/api/getProducts", getProductsApi);
export default router;
