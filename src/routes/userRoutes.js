import express from "express";
import verifytoken from "../middleware/authMiddleware.js";
import authorizeroles from "../middleware/roleMiddleware.js";
import adminroutes from "../routes/adminroutes.js";
import managerroutes from "../routes/managerroutes.js";
import customerroutes from "../routes/customerroutes.js";
import artisanroutes from "../routes/artisanroutes.js";
const router = express.Router();

// router.use(verifytoken);

// router.get("/store", (req, res) => {
//     res.render("store", { products });
// });

// router.use("/admin", customerroutes);
//  router.use("/manager", customerroutes);
// router.use("/artisan", customerroutes);
router.use("/admin", adminroutes);
router.use("/artisan", artisanroutes);
router.use("/customer", customerroutes);
router.use("/manager", managerroutes);

router.get("/admin", authorizeroles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get("/manager", authorizeroles("admin", "manager"), (req, res) => {
  res.json({ message: "Welcome Manager" });
});

router.get(
  "/artisan",
  authorizeroles("admin", "manager", "artisan"),
  (req, res) => {
    res.json({ message: "Welcome Artisan" });
  }
);

router.get(
  "/customer",
  authorizeroles("admin", "manager", "customer"),
  (req, res) => {
    res.json({ message: "Welcome Customer" });
  }
);

export default router;
