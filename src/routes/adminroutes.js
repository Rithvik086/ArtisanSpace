import express from "express";

import bcrypt from "bcryptjs";
import { loadcustData, updateResponse } from "../models/customerresponse.js";
import path from "path";
import { fileURLToPath } from "url";

import { addUser, findUserByName } from "../models/usermodel.js";
import authorizerole from "../middleware/roleMiddleware.js";
// Middleware to parse JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const custrespath = path.resolve(__dirname, "../../customerresponse.json");

const router = express.Router();
const admrole = "admin";

router.use(authorizerole("admin"));

router.get("/", async (req, res) => {
  await updateResponse(custrespath);
  const responses = await loadcustData(custrespath);
  res.render("admin/admindashboard", { role: admrole, responses });
});

router.get("/support-ticket", (req, res) => {
  res.render("admin/adminsupportticket", { role: admrole });
});
router.post("/add-user", async (req, res) => {
  console.log("Received data:", req.body);
  const { name, email, role, pass } = req.body;
  const hashpass = await bcrypt.hash(pass, 9);
  try {
    const result = await addUser(name, email, hashpass, role); // Assuming addUser returns a success status

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "User added successfully",
        userData: result.user, // Send back user data if needed
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || "Failed to add user",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
// router.post("/del-user", async(req,res)=>{
//     const {  email } = req.body;
//     try {
//         const result = await addUser(name, email, "1234", role); // Assuming addUser returns a success status

//         if (result.success) {
//             res.status(200).json({
//                 success: true,
//                 message: "User added successfully",
//                 userData: result.user // Send back user data if needed
//             });
//         } else {
//             res.status(400).json({
//                 success: false,
//                 message: result.message || "Failed to add user"
//             });
//         }
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message
//         });
//     }
// });

export default router;
