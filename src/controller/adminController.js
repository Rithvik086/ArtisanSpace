import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import {
  approveProduct,
  deleteProduct,
  disapproveProduct,
  getProducts,
} from "../services/productServices.js";
import {
  addUser,
  getUserById,
  getUsers,
  removeUser,
} from "../services/userServices.js";
import { getTickets, removeTicket } from "../services/ticketServices.js";
import { loadcustData, updateResponse } from "../models/customerresponse.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const custrespath = path.resolve(__dirname, "../../customerresponse.json");

const admrole = "admin";

export const getAdminDashboard = async (req, res) => {
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
};

export const addUserHandler = async (req, res) => {
  // console.log("Received data:", req.body);
  const { name, username, mobile_no, email, role, pass } = req.body;
  const hashpass = await bcrypt.hash(pass, 9);
  try {
    const result = await addUser(
      username,
      name,
      email,
      hashpass,
      mobile_no,
      role
    ); // Assuming addUser returns a success status

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
};

export const deletUser = async (req, res) => {
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
};

export const getAndHandleContentModerationAdmin = async (req, res) => {
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
      res.render("manager/managerContentModeration", { role: admrole });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getSupportTickets = async (req, res) => {
  let tickets = await getTickets();
  res.render("admin/adminsupportticket", { role: admrole, tickets });
};

export const deleteTicket = async (req, res) => {
  if (req.body._method === "DELETE") {
    const { ticketId } = req.body;
    await removeTicket(ticketId);
    return res.redirect("/admin/support-ticket"); // Redirect after deletion
  }
};

export const getSettingsAdmin = async (req, res) => {
  const user = await getUserById(req.user.id);
  delete user.password;
  delete user.userId;
  delete user.role;
  res.render("settings", { role: admrole, user });
};
