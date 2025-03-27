import express from "express";

import bcrypt from "bcryptjs";
import { loadcustData, updateResponse } from "../models/customerresponse.js";
import path from "path";
import { fileURLToPath } from "url";
import { getProducts } from "../models/productmodel.js";
import {
  addUser,
  getUserById,
  getUsers,
  removeUser,
} from "../models/usermodel.js";
import authorizerole from "../middleware/roleMiddleware.js";
import { getTickets, removeTicket } from "../models/supportticketmodel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const custrespath = path.resolve(__dirname, "../../customerresponse.json");

const router = express.Router();
const admrole = "admin";

router.use(authorizerole("admin"));

router.get("/", async (req, res) => {
  await updateResponse(custrespath);
  const responses = await loadcustData(custrespath);
  const userlist = await getUsers();
  const products = await getProducts();
  res.render("admin/admindashboard", {
    role: admrole,
    responses,
    userlist,
    products,
  });
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
router.delete("/delete-user/:userID", async (req, res) => {
  const userId = req.params.userID;

  try {
    const result = await removeUser(userId);
    if (result.success) {
      res.status(200).json({
        success: true,
        message: "User deleted",
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || "Failed to delete user",
      });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
  // return res.redirect("/admin/")
});
router.get("/support-ticket", async (req, res) => {
  let tickets = await getTickets();
  res.render("admin/adminsupportticket", { role: admrole, tickets });
});

router.post("/support-ticket", async (req, res) => {
  if (req.body._method === "DELETE") {
    const { ticketId } = req.body;
    await removeTicket(ticketId);
    return res.redirect("/admin/support-ticket"); // Redirect after deletion
  }
});

router.get("/settings", async (req, res) => {
  const user = await getUserById(req.user.id);
  delete user.password;
  delete user.userId;
  delete user.role;
  res.render("settings", { role: admrole, user });
});

export default router;
