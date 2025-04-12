import express from "express";

import { verifytoken } from "../middleware/authMiddleware.js";
import adminroutes from "../routes/adminroutes.js";
import managerroutes from "../routes/managerroutes.js";
import customerroutes from "../routes/customerroutes.js";
import artisanroutes from "../routes/artisanroutes.js";
import { addTicket } from "../services/ticketServices.js";
import { removeUser, updateUser } from "../services/userServices.js";
import { getProducts } from "../services/productServices.js";
const router = express.Router();

router.use(verifytoken);

router.use("/admin", adminroutes);
router.use("/artisan", artisanroutes);
router.use("/customer", customerroutes);
router.use("/manager", managerroutes);

router.get("/aboutus", (req, res) => {
  res.render("Aboutus", { role: req.user.role });
});
router.get("/contactus", (req, res) => {
  res.render("customercontactus", { role: req.user.role });
});

router.get("/supportTicket", (req, res) => {
  res.render("supportTicket", { role: req.user.role });
  console.log(req.user.userId);
});

router.post("/submit-ticket", async (req, res) => {
  const { subject, category, description } = req.body;
  if (!subject || !description) {
    return res
      .status(400)
      .json({ success: false, message: "All required fields must be filled!" });
  }

  try {
    const newTicket = await addTicket(
      req.user.id,
      subject,
      category,
      description
    );
    res.json({
      success: true,
      message: "Ticket submitted successfully!",
      ticket: newTicket,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to submit ticket. Please try again later.",
    });
  }
});

router.post("/update-profile", async (req, res) => {
  try {
    console.log(req.body);
    const { name, mobile_no, address } = req.body;
    if (address) {
      address.toLowerCase();
    }
    const result = await updateUser(
      req.user.id,
      name.toLowerCase(),
      mobile_no,
      address
    );

    if (result.success) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.get("/delete-account", async (req, res) => {
  try {
    const result = await removeUser(req.user.id);

    if (result.success) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});
router.get("/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    let products = await getProducts();
    const product = await products.find((p) => p.productId == productId);

    res.render("productPage", {
      product,
      role: "customer",
      userId: req.user.id,
    });
  } catch (err) {
    console.error("failed to get project", err);
  }
});
export default router;
