import express from "express";
import upload from "../middleware/multer.js";
import authorizerole from "../middleware/roleMiddleware.js";

import {
  getArtisanDashboard,
  getArtisanProductsAPI,
  editProductController,
  deleteProductController,
  getListingsController,
  postListingsController,
  getWorkshopsController,
  getArtisanWorkshopsAPI,
  handleWorksopAction,
  getCustomRequestsController,
  approveCustomRequest,
  deleteCustomRequest,
  getSettingsArtisan,
} from "../controller/artisanController.js";

const router = express.Router();
const astrole = "artisan";

router.use(authorizerole("admin", "manager", "artisan"));

router.get("/", getArtisanDashboard);

// API endpoint for products data
router.get("/api/products", getArtisanProductsAPI);

// API endpoint for workshops data
router.get('/api/workshops', getArtisanWorkshopsAPI);

router.put("/edit-product/:id", editProductController);

router.post("/delete-product/:id", deleteProductController);

router.get("/listings", getListingsController);

router.post("/listings", upload.single("image"), postListingsController);

router.get("/workshops", getWorkshopsController);
router.get("/workshops/:action/:workshopId", handleWorksopAction);

router.get("/customrequests", getCustomRequestsController);

router.post("/customrequests", approveCustomRequest);
router.get("/customrequests/:requestId", deleteCustomRequest);

router.get("/settings", getSettingsArtisan);

export default router;
