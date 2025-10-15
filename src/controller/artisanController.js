import cloudinary from "../config/cloudinary.js";
import path from "path";
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
    // Serve the static HTML file
    res.sendFile(path.join(process.cwd(), 'src', 'public', 'artisan', 'artisandashboard.html'));
  } catch (err) {
    console.error("Error serving dashboard:", err);
    res.status(500).send("error");
  }
};

// New API endpoint for fetching products data
export const getArtisanProductsAPI = async (req, res) => {
  try {
    const products = await getProducts(req.user.id);
    res.status(200).json({ products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
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
  try {
    res.sendFile(path.join(process.cwd(), 'src', 'public', 'artisan', 'artisanlisting.html'));
  } catch (err) {
    console.error('Error serving artisan listings page:', err);
    res.status(500).send('error');
  }
};

export const postListingsController = async (req, res) => {
  try {
    const { productName, type, material, price, description, quantity } =
      req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    await addProduct(
      req.user.id,
      req.user.role,
      productName,
      type,
      material,
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
  try {
    // Serve the static HTML page
    res.sendFile(path.join(process.cwd(), 'src', 'public', 'artisan', 'artisanworkshop.html'));
  } catch (err) {
    console.error('Error serving artisan workshop page:', err);
    res.status(500).send('error');
  }
};

// API endpoint to return workshops data for the current artisan
export const getArtisanWorkshopsAPI = async (req, res) => {
  try {
    const availableWorkshops = await getAvailableWorkshops();
    const acceptedWorkshops = await getAcceptedWorkshops(req.user.id);
    res.status(200).json({ availableWorkshops, acceptedWorkshops });
  } catch (error) {
    console.error('Error fetching workshops:', error);
    res.status(500).json({ error: 'Failed to fetch workshops' });
  }
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

    // Serve the static HTML page (client will fetch data via API)
    res.sendFile(path.join(process.cwd(), 'src', 'public', 'artisan', 'artisancustomorder.html'));
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).render("error", {
      message: "Failed to load dashboard. Please try again later.",
    });
  }
};

// API endpoint to return custom requests for the current artisan
export const getArtisanCustomRequestsAPI = async (req, res) => {
  try {
    const currentArtisanId = req.user.id;
    if (!currentArtisanId) return res.status(401).json({ error: 'Unauthorized' });

    const availableRequests = await getRequests(false);
    const acceptedRequests = await getRequests(true, currentArtisanId);

    // Map requests to include explicit requester info to avoid frontend population issues
    const mapReq = (r) => {
      const obj = r && r.toObject ? r.toObject() : r;
      const requester = (obj.userId && typeof obj.userId === 'object') ? {
        username: obj.userId.username || null,
        email: obj.userId.email || null,
        mobile_no: obj.userId.mobile_no || null,
      } : null;
      return { ...obj, requester };
    };

    const availableMapped = (availableRequests || []).map(mapReq);
    const acceptedMapped = (acceptedRequests || []).map(mapReq);

    res.status(200).json({ availableRequests: availableMapped, acceptedRequests: acceptedMapped, currentArtisanId });
  } catch (error) {
    console.error('Error fetching custom requests:', error);
    res.status(500).json({ error: 'Failed to fetch custom requests' });
  }
};

// API: GET /artisan/api/customrequests/:id -> return a single mapped request
export const getArtisanRequestByIdAPI = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const requests = await getRequests(null); // fetch all then filter (service doesn't have single-get)
    const found = (requests || []).find(r => r && r._id && r._id.toString() === id);
    if (!found) return res.status(404).json({ error: 'Request not found' });

    const obj = found && found.toObject ? found.toObject() : found;
    const requester = (obj.userId && typeof obj.userId === 'object') ? {
      username: obj.userId.username || null,
      email: obj.userId.email || null,
      mobile_no: obj.userId.mobile_no || null,
    } : null;

    return res.status(200).json({ request: { ...obj, requester } });
  } catch (error) {
    console.error('Error fetching request by id:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
};

// Serve the static view details HTML page
export const getViewDetailsController = async (req, res) => {
  try {
    res.sendFile(path.join(process.cwd(), 'src', 'public', 'artisan', 'viewdetails.html'));
  } catch (error) {
    console.error('Error serving viewdetails page:', error);
    res.status(500).send('error');
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
  res.sendFile(path.join(process.cwd(), "src/views/settings.html"));
};
