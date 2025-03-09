import express from "express";
import verifytoken from "../middleware/authMiddleware.js";

import authorizeroles from "../middleware/roleMiddleware.js";
import customerroles from "../routes/customerroutes.js";

const router = express.Router();

router.use(verifytoken);

// router.get("/store", (req, res) => {
//     res.render("store", { products });
// });

router.use("/customer", customerroles);

router.get("/admin", authorizeroles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get("/manager", authorizeroles("admin", "manager"), (req, res) => {
  res.json({ message: "Welcome Manager" });
});

router.get("/manager", authorizeroles("admin", "manager"), (req, res) => {
  res.json({ message: "Welcome Manager" });
});

router.get(
  "/artisan",
  authorizeroles("admin", "manager", "artisan"),
  (req, res) => {
    res.json({ message: "Welcome Artisan" });
  },
);

router.get(
  "/customer",
  authorizeroles("admin", "manager", "customer"),
  (req, res) => {
    res.json({ message: "Welcome Customer" });
  },
);

export default router;
