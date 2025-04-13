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

router.get("/");

router.delete("/delete-user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }
    const response = await removeUser(userId);

    if (response.success) {
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to delete user" });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

export default router;
