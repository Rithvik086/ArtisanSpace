import express from "express";
import path from "path";
import authorizerole from "../middleware/roleMiddleware.js";
import upload from "../middleware/multer.js";

import {
  getHomePage,
  getStorePage,
  addToCart,
  getCartController,
  editCart,
  getWorkshopPage,
  bookWorkshopPage,
  getCustomOrderPage,
  reqCustomOrder,
  checkout,
  placeOrderController,
  getSettingsCustomer,
  getOrdersPageCustomer,
  checkout1,
} from "../controller/customerController.js";
import { getOrdersById, getOrderByOrderId } from "../services/orderServices.js";
import { getRequestById } from "../services/requestServices.js";
import { getWorkshopByUserId } from "../services/workshopServices.js";
import { getCart } from "../services/cartServices.js";
import {
  getProducts,
  getApprovedProducts,
} from "../services/productServices.js";
import {
  getUserById,
  updateUser,
  removeUser,
} from "../services/userServices.js";

const router = express.Router();

router.use(authorizerole("admin", "manager", "artisan", "customer"));

router.get("/", getHomePage);

// API endpoint for homepage products (first 10)
router.get("/api/products", async (req, res) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    const products = await getApprovedProducts(category);
    if (limit === "all") {
      res.json({
        products,
        currentPage: 1,
        totalPages: 1,
        totalProducts: products.length,
      });
    } else {
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const endIndex = parseInt(page) * parseInt(limit);
      const paginatedProducts = products.slice(startIndex, endIndex);
      res.json({
        products: paginatedProducts,
        currentPage: parseInt(page),
        totalPages: Math.ceil(products.length / parseInt(limit)),
        totalProducts: products.length,
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// API endpoints for customer data
router.get("/api/orders", async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await getOrdersById(userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// API for individual order details
router.get("/api/orders/:orderId", async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.orderId;
    console.log("Fetching order:", orderId, "for user:", userId);

    const order = await getOrderByOrderId(orderId);

    if (!order) {
      console.log("Order not found:", orderId);
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if the order belongs to the user
    if (order.userId._id.toString() !== userId) {
      console.log(
        "Access denied for order:",
        orderId,
        "user:",
        userId,
        "order user:",
        order.userId._id.toString()
      );
      return res.status(403).json({ error: "Access denied" });
    }

    console.log("Order found and accessible");
    res.json(order);
  } catch (err) {
    console.error("Error fetching order details:", err);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

router.get("/api/requests", async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await getRequestById(userId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

router.get("/api/workshops", async (req, res) => {
  try {
    const userId = req.user.id;
    const workshops = await getWorkshopByUserId(userId);
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch workshops" });
  }
});

router.get("/api/user", async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    // convert mongoose document to plain object so properties are enumerable
    const userObj =
      typeof user.toObject === "function"
        ? user.toObject()
        : JSON.parse(JSON.stringify(user));
    delete userObj.password;
    delete userObj.role;
    delete userObj.userId;
    console.log("[API] GET /customer/api/user ->", Object.keys(userObj));
    res.json(userObj);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Update user data
router.put("/api/user", async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = { ...req.body };

    // Prevent sensitive fields from being updated via this endpoint
    delete updateData.password;
    delete updateData.role;
    delete updateData.userId;

    // call service with positional args (name, mobile_no, address)
    const updated = await updateUser(
      userId,
      updateData.name,
      updateData.mobile_no,
      updateData.address
    );

    if (updated && updated.success) {
      res.json({ success: true, message: "User updated successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Failed to update user" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
});

// Delete user account
router.delete("/api/user", async (req, res) => {
  try {
    const userId = req.user.id;
    const deleted = await removeUser(userId);
    if (deleted && deleted.success) {
      res.json({ success: true, message: "Account deleted successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Failed to delete account" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete account" });
  }
});

// API for cart
router.get("/api/cart", async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await getCart(userId);
    let amount = 0;
    for (const item of cart) {
      amount += item.quantity * item.productId.newPrice;
    }
    res.json({ cart, amount, userId });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// API for checkout
router.get("/api/checkout", async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await getCart(userId);

    if (!cart || cart.length === 0) {
      return res.json({ error: "Cart is empty" });
    }

    const products = await getProducts();

    // Calculate total amount
    let amount = 0;
    cart.forEach((item) => {
      if (item) {
        amount += item.productId.newPrice * item.quantity;
      }
    });

    // Calculate shipping and tax
    const shipping = 50; // Fixed shipping fee
    const tax = Math.round(amount * 0.05 * 100) / 100; // 5% tax
    let user = await getUserById(userId);

    res.json({
      cart,
      products,
      amount: amount.toFixed(2),
      shipping,
      tax,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch checkout data" });
  }
});

router.get("/orders/:orderId", getOrdersPageCustomer);
router.get("/store", getStorePage);
router.post("/store", addToCart);
router.get("/cart", getCartController);
router.post("/cart", editCart);
router.get("/workshop", getWorkshopPage);
router.post("/requestWorkshop", bookWorkshopPage);
router.get("/customorder", getCustomOrderPage);
router.post("/customorder", upload.single("image"), reqCustomOrder);
router.get("/checkout", checkout);
router.get("/checkout-products", checkout1);
router.post("/place-order", placeOrderController);
router.get("/settings", getSettingsCustomer);

// Partial routes for HTML
router.get("/partials/navbar2", (req, res) => {
  const role = req.user && req.user.role ? req.user.role : "customer";
  const navbarFile = `navbar2-${role}.html`;
  res.sendFile(path.join(process.cwd(), "src/public/partials", navbarFile));
});

router.get("/partials/footer", (req, res) => {
  res.sendFile(path.join(process.cwd(), "src/public/partials/footer.html"));
});

export default router;
