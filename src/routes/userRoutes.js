import express from "express";

import { verifytoken } from "../middleware/authMiddleware.js";
import adminroutes from "../routes/adminroutes.js";
import managerroutes from "../routes/managerroutes.js";
import customerroutes from "../routes/customerroutes.js";
import artisanroutes from "../routes/artisanroutes.js";
import { addTicket } from "../models/supportticketmodel.js";
import { addRequest } from "../models/customordermodel.js";
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

router.get("/customorder", (req, res) => {
  res.render("customorder", { role: req.user.role });
});

router.post("/customorder", async (req, res) => {
  const { title, type, description, budget, requiredBy } = req.body;
  if (!title || !type || !description || !budget || !requiredBy) {
    return res
      .status(400)
      .json({ success: false, message: "All required fields must be filled!" });
  }

  try {
    const newrequest = await addRequest(
      req.user.id,
      title,
      type,
      "dummy image",
      description,
      budget,
      requiredBy
    );
    res.json({
      success: true,
      message: "Custom order submitted successfully!",
      request: newrequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to submit request please try again later",
    });
  }

  // Simulating saving data to the database
});

export default router;
