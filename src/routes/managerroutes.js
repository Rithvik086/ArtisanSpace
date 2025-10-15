import express from "express";
import path from "path";
import authorizerole from "../middleware/roleMiddleware.js";
import {
  getManagerDashboard,
  getAndHandleContentModerationManager,
  loadPartialSection,
  getMangerListings,
  getManagerSettings,
  deleteUserHandler,
  editProductHandler,
} from "../controller/managerController.js";
import { getUsersByRole } from "../services/userServices.js";
import {
  getProductsByRole,
  deleteProduct,
} from "../services/productServices.js";

const router = express.Router();

router.use(authorizerole("admin", "manager"));

router.get("/", getManagerDashboard);
router.delete("/delete-user/:userId", deleteUserHandler);
router.get("/content-moderation", getAndHandleContentModerationManager);
router.get("/load-partial/:section", loadPartialSection);
router.get("/listing", getMangerListings);
router.get("/settings", getManagerSettings);

router.get("/api/users", async (req, res) => {
  try {
    const userlist = await getUsersByRole("manager");
    res.json(userlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/api/products", async (req, res) => {
  try {
    const products = await getProductsByRole("manager");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/edit-product/:productId", editProductHandler);

router.delete("/delete-product/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const result = await deleteProduct(productId);
    if (result.success) {
      res.json({ success: true, message: "Product deleted successfully" });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to delete product" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/partials/navbar2", (req, res) => {
  res.sendFile(
    path.join(process.cwd(), "src/public/partials/navbar2-manager.html")
  );
});

router.get("/partials/footer", (req, res) => {
  res.sendFile(path.join(process.cwd(), "src/public/partials/footer.html"));
});

router.get("/");

export default router;
