import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import authorizerole from "../middleware/roleMiddleware.js";

import {
  // Renamed the page controller and added the new API controller
  getOrdersPageStatic,
  getOrderDetailsAPI,
  addUserHandler,
  deletUser,
  getSupportTickets,
  getSupportTicketsAPI,
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
router.get("/users", getAdminUsers);
router.get("/orders", getAdminOrders);
router.get("/responses", getAdminResponses);

router.get("/orders/:orderId", getOrdersPageStatic);

router.get("/api/orders/:orderId", getOrderDetailsAPI);

router.delete("/orders/:orderId", deleteOrder);
router.put("/orders/:orderId/status", changeStatus);
router.post("/add-user", addUserHandler);
router.delete("/delete-user/:userID", deletUser);
router.get("/content-moderation", getAndHandleContentModerationAdmin);
router.get("/support-ticket/api", getSupportTicketsAPI);
router.get("/support-ticket", getSupportTickets);
router.post("/support-ticket", deleteTicket);

router.get("/settings", getSettingsAdmin);
// Partial route for admin footer (so admin pages can fetch the shared footer)
router.get("/partials/footer", (req, res) => {
  const role = req.user && req.user.role ? req.user.role : "admin";
  res.render("partials/footer", { role });
});
export default router;
