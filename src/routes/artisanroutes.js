import express from "express";
import upload from "../middleware/multer.js";
import authorizerole from "../middleware/roleMiddleware.js";
import cloudinary from "../config/cloudinary.js";
import { addProduct } from "../models/productmodel.js";

const router = express.Router();
const astrole = "artisan";

router.use(authorizerole("admin", "manager", "artisan"));

router.get("/", (req, res) => {
  res.json({ message: "Welcome Artisan" });
});

router.get("/workshops", (req, res) => {
  res.json({ message: "workshop page coming soon" });
});

router.get("/listings", (req, res) => {
  res.render("artisan/artisanlisting", { role: astrole });
});

router.post("/listings", upload.single("image"), async (req, res) => {
  try {
    const { productName, price, description, quantity } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    await addProduct(
      req.user.id,
      productName,
      result.secure_url,
      price,
      quantity,
      description,
    );

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
