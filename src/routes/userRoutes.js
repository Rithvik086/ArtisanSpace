import express from "express";

import {verifytoken} from "../middleware/authMiddleware.js";
import adminroutes from "../routes/adminroutes.js";
import managerroutes from "../routes/managerroutes.js";
import customerroutes from "../routes/customerroutes.js";
import artisanroutes from "../routes/artisanroutes.js";
import { addTicket } from "../models/supportticketmodel.js";
import { getUsers , getUserById } from "../models/usermodel.js";
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

router.get("/customorder",(req, res)=>{
  res.render("customorder",{role : req.user.role});
})


router.get("/supportTicket",(req, res)=>{
  res.render("supportTicket", {role: req.user.role})
})

router.post("/submit-ticket", async(req, res)=>{
  const { subject, category, description } = req.body;
  if ( !subject || !description) {
    return res.status(400).json({ success: false, message: 'All required fields must be filled!' });
}

try {
  const user  = await getUserById(req.user.id)
    const newTicket = await addTicket(user.username,user.email, "9090909090", user.role, subject, category, description);
    res.json({ success: true, message: 'Ticket submitted successfully!', ticket: newTicket });
} catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to submit ticket. Please try again later.' });
}
})
export default router;
