import express from "express";

import authorizerole from "../middleware/roleMiddleware.js";

import {
  getAdminDashboard,
  getOrdersPage,
  addUserHandler,
  deletUser,
  getSupportTickets,
  deleteTicket,
  getSettingsAdmin,
  changeStatus,
  getAndHandleContentModerationAdmin,
} from "../controller/adminController.js";

const router = express.Router();

router.use(authorizerole("admin"));

router.get("/", getAdminDashboard);
router.get("/orders/:orderId", getOrdersPage);
router.put("/orders/:orderId/status", changeStatus);
router.post("/add-user", addUserHandler);
router.delete("/delete-user/:userID", deletUser);
router.get("/content-moderation", getAndHandleContentModerationAdmin);
router.get("/support-ticket", getSupportTickets);
router.post("/support-ticket", deleteTicket);

router.get("/settings", getSettingsAdmin);

export default router;
