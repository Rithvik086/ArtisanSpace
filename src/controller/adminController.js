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
import {
  changeOrderStatus,
  deleteOrderById,
  getOrderByOrderId,
  getOrders,
} from "../services/orderServices.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const custrespath = path.resolve(__dirname, "../../customerresponse.json");

const admrole = "admin";

export const getAdminDashboard = async (req, res) => {
  await updateResponse(custrespath);
  const responses = await loadcustData(custrespath);
  const userlist = await getUsers();
  const products = await getProducts();
  const orders = await getOrders();
  // Serve the static admin HTML. Client-side JS will fetch the data via JSON endpoints.
  res.sendFile(path.join(__dirname, "../public/admin/admindashboard.html"));
};

export const getOrdersPage = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await getOrderByOrderId(orderId);

    if (!order) {
      return res.status(404).send("Order not found");
    }
    res.render("admin/orderDetails", { role: admrole, order });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const response = await deleteOrderById(orderId);
    if (response.success) {
      return res
        .status(200)
        .json({ success: true, message: "Order deleted successfully" });
    }
    res.status(400).json({
      success: false,
      message: response.message || "Failed to delete order",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const changeStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;
  try {
    const response = await changeOrderStatus(orderId, status);
    if (response.success) {
      return res
        .status(200)
        .json({ success: true, message: "Status updated successfully" });
    }
    res.status(400).json({
      success: false,
      message: res.message || "Failed to update status",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
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
  res.sendFile(path.join(process.cwd(), "src/views/settings.html"));
};

// JSON endpoints for the static admin dashboard (used by client-side rendering)
export const getAdminUsers = async (req, res) => {
  try {
    const users = await getUsers();
    // sanitize users before sending
    const safe = users.map((u) => ({
      _id: u._id,
      username: u.username,
      name: u.name,
      email: u.email,
      role: u.role,
      mobile_no: u.mobile_no,
    }));
    res.json(safe);
  } catch (e) {
    console.error("Error fetching admin users:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (e) {
    console.error("Error fetching orders:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAdminResponses = async (req, res) => {
  try {
    await updateResponse(custrespath);
    const responses = await loadcustData(custrespath);
    res.json(responses);
  } catch (e) {
    console.error("Error fetching responses:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
