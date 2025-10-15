import express from "express";
import upload from "../middleware/multer.js";
import authorizerole from "../middleware/roleMiddleware.js";

import {
  getArtisanDashboard,
  editProductController,
  deleteProductController,
  getListingsController,
  postListingsController,
  getWorkshopsController,
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

router.get("/partials/navbar2", (req, res) => {
  const role = req.user && req.user.role ? req.user.role : "artisan";
  res.render("partials/navbar2", { role });
});

router.get("/partials/footer", (req, res) => {
  const role = req.user && req.user.role ? req.user.role : "artisan";
  res.render("partials/footer", { role });
});

export default router;
