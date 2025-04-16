import express from "express";

import authorizerole from "../middleware/roleMiddleware.js";

import {
  getAdminDashboard,
  addUserHandler,
  deletUser,
  getSupportTickets,
  deleteTicket,
  getSettingsAdmin,
  getAndHandleContentModerationAdmin,
} from "../controller/adminController.js";

const router = express.Router();

router.use(authorizerole("admin"));

router.get("/", getAdminDashboard);

router.post("/add-user", addUserHandler);
router.delete("/delete-user/:userID", deletUser);
router.get("/content-moderation", getAndHandleContentModerationAdmin);
router.get("/support-ticket", getSupportTickets);
router.post("/support-ticket", deleteTicket);

router.get("/settings", getSettingsAdmin);

export default router;
