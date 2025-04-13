import express from "express";
import authorizerole from "../middleware/roleMiddleware.js";
import {
  getManagerDashboard,
  getAndHandleContentModeration,
  loadPartialSection,
  getMangerListings,
  getManagerSettings,
} from "../controller/managerController.js";
const router = express.Router();


router.use(authorizerole("admin", "manager"));
router.get("/", getManagerDashboard);
router.get("/content-moderation", getAndHandleContentModeration);
router.get("/load-partial/:section", loadPartialSection);
router.get("/listing", getMangerListings);
router.get("/settings", getManagerSettings);

export default router;
