import cloudinary from "../config/cloudinary.js";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/productServices.js";
import {
  getAvailableWorkshops,
  getAcceptedWorkshops,
  acceptWorkshop,
  removeWorkshop,
  getWorkshopById,
} from "../services/workshopServices.js";
import {
  approveRequest,
  deleteRequest,
  getRequests,
} from "../services/requestServices.js";
import { sendMail } from "../utils/emailService.js";
import { getUserById } from "../services/userServices.js";

const astrole = "artisan";

export const getArtisanDashboard = async (req, res) => {
  try {
    const products = await getProducts(req.user.id);

    res.render("artisan/artisandashboard", { role: astrole, products });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).send("error");
  }
};

export const editProductController = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, oldPrice, newPrice, quantity, description } = req.body;

    const result = await updateProduct(
      productId,
      name,
      oldPrice,
      newPrice,
      parseInt(quantity),
      description
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ success: false });
    }
  } catch (e) {
    console.log(e);
    res.send(500).send("Server Error");
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await deleteProduct(productId);
    if (result.success) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

//LIstings

export const getListingsController = (req, res) => {
  res.render("artisan/artisanlisting", { role: astrole });
};

export const postListingsController = async (req, res) => {
  try {
    const { productName, type, price, description, quantity } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    await addProduct(
      req.user.id,
      req.user.role,
      productName,
      type,
      result.secure_url,
      price,
      quantity,
      description
    );

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Workshops

export const getWorkshopsController = async (req, res) => {
  let availableWorkshops = await getAvailableWorkshops();
  let acceptedWorkshops = await getAcceptedWorkshops(req.user.id);

  res.render("artisan/artisanworkshop", {
    role: astrole,
    availableWorkshops,
    acceptedWorkshops,
  });
};

export const handleWorksopAction = async (req, res) => {
  try {
    if (req.params.action === "accept") {
      const result = await acceptWorkshop(req.params.workshopId, req.user.id);
      if (result.success) {
        const artisanUser = await getUserById(req.user.id);
        const customerUser = await getWorkshopById(req.params.workshopId);
        sendMail(
          customerUser.userId.email,
          "Workshop Accepted - ArtisanSpace",
          `Hello ${customerUser.userId.username},<br><br>

          Great news! Your workshop request, <b>"${
            customerUser.workshopTitle
          }"</b>, has been accepted by <b>${
            artisanUser.username
          }</b> on <b>${new Date(
            customerUser.acceptedAt
          ).toLocaleString()}</b>.<br><br>

          You can now connect with the artisan to finalize the details and make your workshop a success.<br><br>

          <b>Artisan Contact Information:</b><br>
          - 📧 Email: ${artisanUser.email}<br>
          - 📞 Mobile: ${artisanUser.mobile_no}<br><br>

          If you have any questions or need assistance, feel free to reach out to us. We're here to help!<br><br>

          Best regards,<br>  
          <b>The ArtisanSpace Team</b>`
        );

        res.status(200).json({ success: true });
      }
    } else if (req.params.action === "remove") {
      const result = await removeWorkshop(req.params.workshopId);
      if (result.success) {
        res.status(200).json({ success: true });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

// Custom Requests

export const getCustomRequestsController = async (req, res) => {
  try {
    // Get the current artisan's ID from the session
    const currentArtisanId = req.user.id; // Adjust based on your auth system

    if (!currentArtisanId) {
      return res.redirect("/login"); // Redirect if not logged in
    }

    const availableRequests = await getRequests(false);

    const acceptedRequests = await getRequests(true, currentArtisanId);

    // Render the dashboard with both sets of requests
    res.render("artisan/artisancustomorder", {
      role: astrole,
      availableRequests,
      acceptedRequests,
      currentArtisanId,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).render("error", {
      message: "Failed to load dashboard. Please try again later.",
    });
  }
};

export const approveCustomRequest = async (req, res) => {
  try {
    const approvingartisanid = req.user.id;
    await approveRequest(req.body.requestId, approvingartisanid);

    // Send a proper response
    res
      .status(200)
      .json({ success: true, message: "Request approved successfully" });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ error: "Failed to approve request" });
  }
};

export const deleteCustomRequest = async (req, res) => {
  try {
    // console.log(req.params.requestId)
    await deleteRequest(req.params.requestId);
    res
      .status(200)
      .json({ success: true, message: "Request approved successfully" });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ error: "Failed to approve request" });
  }
};

export const getSettingsArtisan = async (req, res) => {
  const user = await getUserById(req.user.id);
  delete user.password;
  delete user.userId;
  delete user.role;
  res.render("settings", { role: astrole, user });
};
