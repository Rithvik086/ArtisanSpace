import express from "express";
import authorizerole from "../middleware/roleMiddleware.js";
import {
  getManagerDashboard,
  getAndHandleContentModerationManager,
  loadPartialSection,
  getMangerListings,
  getManagerSettings,
  deleteUserHandler,
} from "../controller/managerController.js";

const router = express.Router();

router.use(authorizerole("admin", "manager"));

router.get("/", getManagerDashboard);
router.delete("/delete-user/:userId", deleteUserHandler);
router.get("/content-moderation", getAndHandleContentModerationManager);
router.get("/load-partial/:section", loadPartialSection);
router.get("/listing", getMangerListings);
router.get("/settings", getManagerSettings);

router.get("/");

export default router;
