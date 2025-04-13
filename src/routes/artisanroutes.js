import express from "express";
import upload from "../middleware/multer.js";
import authorizerole from "../middleware/roleMiddleware.js";
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

const router = express.Router();
const astrole = "artisan";

router.use(authorizerole("admin", "manager", "artisan"));

router.get("/", async (req, res) => {
  try {
    const products = await getProducts(req.user.id);

    res.render("artisan/artisandashboard", { role: astrole, products });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).send("error");
  }
});

router.put("/edit-product/:id", async (req, res) => {
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
});

router.post("/delete-product/:id", async (req, res) => {
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
});

router.get("/listings", (req, res) => {
  res.render("artisan/artisanlisting", { role: astrole });
});

router.post("/listings", upload.single("image"), async (req, res) => {
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
});

router.get("/workshops", async (req, res) => {
  let availableWorkshops = await getAvailableWorkshops();
  let acceptedWorkshops = await getAcceptedWorkshops(req.user.id);

  res.render("artisan/artisanworkshop", {
    role: astrole,
    availableWorkshops,
    acceptedWorkshops,
  });
});

router.get("/workshops/:action/:workshopId", async (req, res) => {
  try {
    if (req.params.action === "accept") {
      const result = await acceptWorkshop(req.params.workshopId, req.user.id);
      if (result.success) {
        const artisanUser = await getUserById(req.user.id);
        const customerUser = await getWorkshopById(req.params.workshopId);
        sendMail(
          customerUser.userId.email,
          "Workshop Accepted - ArtisanSpace",
          `Dear ${customerUser.userId.username},
        
        We are excited to inform you that your workshop request, **"${
          customerUser.workshopTitle
        }"**, has been accepted by **${artisanUser.username}** on **${new Date(
            customerUser.acceptedAt
          ).toLocaleString()}**.
        
        You can now connect with the artisan to finalize the details.
        
        **Artisan Contact Information:**
        📧 Email: ${artisanUser.email}  
        📞 Mobile: ${artisanUser.mobile_no}  
        
        If you have any questions, feel free to reach out. We hope this workshop is a great success!
        
        Best regards,  
        **The ArtisanSpace Team**`
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
});

router.get("/customrequests", async (req, res) => {
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
});

router.post("/customrequests", async (req, res) => {
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
});
router.get("/customrequests/:requestId", async (req, res) => {
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
});

router.get("/settings", async (req, res) => {
  const user = await getUserById(req.user.id);
  delete user.password;
  delete user.userId;
  delete user.role;
  res.render("settings", { role: astrole, user });
});
export default router;
