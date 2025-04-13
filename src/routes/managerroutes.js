import express from "express";
import authorizerole from "../middleware/roleMiddleware.js";
import {
  approveProduct,
  deleteProduct,
  disapproveProduct,
  getApprovedProducts,
  getDisapprovedProducts,
  getPendingProducts,
  getProductsByRole,
  getProductsCount,
} from "../services/productServices.js";
import {
  getUserById,
  getUsersByRole,
  removeUser,
} from "../services/userServices.js";
const router = express.Router();
const mngrole = "manager";

router.use(authorizerole("admin", "manager"));

router.get("/", async (req, res) => {
  const userlist = await getUsersByRole("manager");
  const products = await getProductsByRole(req.user.role);
  res.render("manager/managerdashboard", { role: mngrole, userlist, products });
});

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

router.get("/content-moderation", async (req, res) => {
  try {
    if (req.headers["x-requested-with"] === "XMLHttpRequest") {
      const { action, productId } = req.query;
      let msg = { success: false };

      if (action === "approve") {
        msg = await approveProduct(productId);
      } else if (action === "disapprove") {
        msg = await disapproveProduct(productId);
      } else if (action === "remove") {
        msg = await deleteProduct(productId);
      } else {
        return res
          .status(400)
          .json({ success: false, error: "Invalid action" });
      }
      if (msg.success) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ success: false });
      }
    } else {
      res.render("manager/managerContentModeration", { role: mngrole });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.get("/load-partial/:section", async (req, res) => {
  const { section } = req.params;
  const counts = await getProductsCount();
  let html = "";

  if (section === "approved") {
    const approvedProducts = await getApprovedProducts();
    html = res.render(
      "manager/partials/approved",
      { approvedProducts },
      (err, rendered) => {
        if (err)
          return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, html: rendered, counts });
      }
    );
  } else if (section === "disapproved") {
    const disapprovedProducts = await getDisapprovedProducts();
    html = res.render(
      "manager/partials/disapproved",
      { disapprovedProducts },
      (err, rendered) => {
        if (err)
          return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, html: rendered, counts });
      }
    );
  } else if (section === "pending") {
    const pendingProducts = await getPendingProducts();
    html = res.render(
      "manager/partials/pending",
      { pendingProducts },
      (err, rendered) => {
        if (err)
          return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, html: rendered, counts });
      }
    );
  }
});

router.get("/listing", (req, res) => {
  res.render("manager/managerlisting", { role: mngrole });
});

router.get("/settings", async (req, res) => {
  const user = await getUserById(req.user.id);
  delete user.password;
  delete user.userId;
  delete user.role;
  res.render("settings", { role: mngrole, user });
});

export default router;
