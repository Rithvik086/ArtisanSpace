import {
  approveProduct,
  deleteProduct,
  disapproveProduct,
  getApprovedProducts,
  getDisapprovedProducts,
  getPendingProducts,
  getProductsByRole,
  getProductsCount,
  updateProduct,
} from "../services/productServices.js";
import {
  getUserById,
  getUsersByRole,
  removeUser,
} from "../services/userServices.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mngrole = "manager";

export const getManagerDashboard = async (req, res) => {
  res.sendFile(path.join(__dirname, "../public/manager/managerdashboard.html"));
};

export const deleteUserHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }
    const response = await removeUser(userId);

    if (response.success) {
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to delete user" });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const editProductHandler = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, oldPrice, newPrice, quantity, description } = req.body;

    const result = await updateProduct(
      productId,
      name,
      oldPrice,
      newPrice,
      quantity,
      description
    );

    if (result.success) {
      res
        .status(200)
        .json({ success: true, message: "Product updated successfully" });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to update product" });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getAndHandleContentModerationManager = async (req, res) => {
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
      res.sendFile(
        path.join(__dirname, "../public/manager/managerContentModeration.html")
      );
    }
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const loadPartialSection = async (req, res) => {
  const { section } = req.params;
  const counts = await getProductsCount();
  let html = "";

  const tableHeader = `<table>
  <thead>
    <tr>
      <th>Image</th>
      <th>Name</th>
      <th>UploadedBy</th>
      <th>Quantity</th>
      <th>Price</th>
      <th>Type</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>`;

  const tableFooter = `</tbody></table>`;

  if (section === "approved") {
    const approvedProducts = await getApprovedProducts();
    html = tableHeader;
    approvedProducts.forEach((product) => {
      html += `<tr id="product-${product._id.toString()}">
        <td class="product-name">
          <img src="${product.image}" class="product-img" alt="${product.name}">
        </td>
        <td>${product.name}</td>
        <td>${product.userId.username} (${product.uploadedBy})</td>
        <td>${product.quantity}</td>
        <td><s>₹${product.oldPrice}</s> <br><span class="price">₹${
        product.newPrice
      }</span></td>
        <td>${product.category}</td>
        <td><button class="btn remove-btn approve-side" data-id="${product._id.toString()}">Remove</button></td>
      </tr>`;
    });
    html += tableFooter;
    res.json({ success: true, html, counts });
  } else if (section === "disapproved") {
    const disapprovedProducts = await getDisapprovedProducts();
    html = tableHeader;
    disapprovedProducts.forEach((product) => {
      html += `<tr id="product-${product._id.toString()}">
        <td class="product-name">
          <img src="${product.image}" class="product-img" alt="${product.name}">
        </td>
        <td>${product.name}</td>
        <td>${product.userId.username} (${product.uploadedBy})</td>
        <td>${product.quantity}</td>
        <td><s>₹${product.oldPrice}</s> <br><span class="price">₹${
        product.newPrice
      }</span></td>
        <td>${product.category}</td>
        <td><button class="btn remove-btn" data-id="${product._id.toString()}">Remove</button></td>
      </tr>`;
    });
    html += tableFooter;
    res.json({ success: true, html, counts });
  } else if (section === "pending") {
    const pendingProducts = await getPendingProducts();
    html = tableHeader;
    pendingProducts.forEach((product) => {
      html += `<tr id="product-${product._id.toString()}">
        <td class="product-name">
          <img src="${product.image}" class="product-img" alt="${product.name}">
        </td>
        <td class="product-name">${product.name}</td>
        <td>${product.userId.username} (${product.uploadedBy})</td>
        <td>${product.quantity}</td>
        <td><s>₹${product.oldPrice}</s> <br><span class="price">₹${
        product.newPrice
      }</span></td>
        <td>${product.category}</td>
        <td>
          <button class="btn approve-btn" data-id="${product._id.toString()}">Approve</button>
          <button class="btn disapprove-btn" data-id="${product._id.toString()}">Disapprove</button>
        </td>
      </tr>`;
    });
    html += tableFooter;
    res.json({ success: true, html, counts });
  }
};

export const getMangerListings = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/manager/managerlisting.html"));
};

export const getManagerSettings = async (req, res) => {
  res.sendFile(path.join(process.cwd(), "src/views/settings.html"));
};
