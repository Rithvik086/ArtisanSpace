import { addTicket } from "../services/ticketServices.js";
import { removeUser, updateUser, getUsers } from "../services/userServices.js";
import {
  getApprovedProducts,
  getProduct,
  getProducts,
} from "../services/productServices.js";
import { totalOrders, getOrders } from "../services/orderServices.js";
import path from "path";

export const renderAboutUs = (req, res) => {
  res.sendFile(path.join(process.cwd(), "src", "public", "aboutus.html"));
};

// API endpoint to get user role
export const getUserRole = (req, res) => {
  res.json({ role: req.user.role });
};

export const renderContactUs = (req, res) => {
  res.render("customercontactus", { role: req.user.role });
};

export const renderSupportTicket = (req, res) => {
  res.sendFile(path.join(process.cwd(), "src/views/supportTicket.html"));
  console.log(req.user.userId);
};

export const submitSuppotTicket = async (req, res) => {
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
};

export const updatProfile = async (req, res) => {
  try {
    // console.log(req.body);
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
};

export const deleteAccount = async (req, res) => {
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
};

export const productPage = async (req, res) => {
  try {
    const productId = req.params.productId;
    let product = await getProduct(productId);

    res.render("productPage", {
      product,
      role: "customer",
      userId: req.user.id,
    });
  } catch (err) {
    console.error("failed to get project", err);
  }
};

export const getCustomerChart = async (req, res) => {
  try {
    const customers = await getUsers();
    const formatted = customers.map((c) => ({
      registeredAt: c._id.getTimestamp(),
    }));
    res.json(formatted);
  } catch (error) {
    console.error("Error fetching customer chart data:", error);
    res.status(500).json({
      success: false,
      message:
        "Failed to retrieve customer chart data. Please try again later.",
    });
  }
};

export const getOrdersChart = async (req, res) => {
  try {
    const orders = await getOrders();

    const formatted = orders.map((order) => ({
      purchasedAt: order.purchasedAt,
      amount: order.money,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching orders chart data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders chart data. Please try again later.",
    });
  }
};

export const getProductsChart = async (req, res) => {
  try {
    const products = await getProducts();

    const formatted = products.map((product) => ({
      createdAt: product._id.getTimestamp(),
      name: product.name,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching products chart data:", error);
    res.status(500).json({
      success: false,
      message:
        "Failed to retrieve products chart data. Please try again later.",
    });
  }
};

export const getOrderDetails = async (req, res) => {
  const value = req.params.value;
  let orders = await totalOrders();
  if (value === "totalsales") {
  }
};

export const getProductsApi = async (req, res) => {
  try {
    const products = await getApprovedProducts();

    return res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
};
