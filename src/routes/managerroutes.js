import express from "express";
import authorizerole from "../middleware/roleMiddleware.js";
import {
  approveProduct,
  disapproveProduct,
  getApprovedProducts,
  getDisapprovedProducts,
  getPendingProducts,
} from "../models/productmodel.js";
const router = express.Router();
const mngrole = "manager";

router.use(authorizerole("admin", "manager"));

router.get("/", (req, res) => {
  res.render("manager/managerdashboard", { role: mngrole });
});
router.get("/content-moderation", (req, res) => {
  if (req.headers["x-requested-with"] === "XMLHttpRequest") {
    console.log("it came");
    const { action, productId } = req.query;
    let msg;
    if (action === "approve") {
      msg = approveProduct(productId);
    } else if (action === "disapprove") {
      msg = disapproveProduct(productId);
    }
    res.json(msg);
  } else {
    res.render("manager/managercontentmoderation", { role: mngrole });
  }
});

router.get("/load-partial/:section", async (req, res) => {
  const { section } = req.params;
  if (section === "approved") {
    const approvedProducts = await getApprovedProducts();
    res.render("manager/partials/approved", { approvedProducts });
  } else if (section === "disapproved") {
    const disapprovedProducts = await getDisapprovedProducts();
    res.render("manager/partials/disapproved", { disapprovedProducts });
  } else if (section === "pending") {
    const pendingProducts = await getPendingProducts();
    res.render("manager/partials/pending", { pendingProducts });
  }
});

router.get("/listing", (req, res) => {
  res.render("manager/managerlisting", { role: mngrole });
});

export default router;
