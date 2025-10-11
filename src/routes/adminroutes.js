import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import authorizerole from "../middleware/roleMiddleware.js";

import {
  getOrdersPage,
  addUserHandler,
  deletUser,
  getSupportTickets,
  deleteTicket,
  getSettingsAdmin,
  changeStatus,
  getAndHandleContentModerationAdmin,
  deleteOrder,
  getAdminUsers,
  getAdminOrders,
  getAdminResponses,
} from "../controller/adminController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.use(authorizerole("admin"));

// Serve the static admin dashboard HTML from the public folder.
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/admindashboard.html"));
});

// JSON endpoints used by the static dashboard
router.get('/users', getAdminUsers);
router.get('/orders', getAdminOrders);
router.get('/responses', getAdminResponses);
router.get("/orders/:orderId", getOrdersPage);
router.delete("/orders/:orderId", deleteOrder);
router.put("/orders/:orderId/status", changeStatus);
router.post("/add-user", addUserHandler);
router.delete("/delete-user/:userID", deletUser);
router.get("/content-moderation", getAndHandleContentModerationAdmin);
router.get("/support-ticket", getSupportTickets);
router.post("/support-ticket", deleteTicket);

router.get("/settings", getSettingsAdmin);

export default router;
