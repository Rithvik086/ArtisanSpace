import express from "express";
import verifytoken from "../middleware/authMiddleware.js";

import authorizeroles from "../middleware/roleMiddleware.js";

const products = [
  {
    name: "Brass Buddha Door Knocker",
    image: "../public/images/logo.png",
    oldPrice: "₹1,999.00",
    newPrice: "₹1,499.00",
  },
  {
    name: "Brass Dancing Lord Ganesha Idol",
    image: "/images/ganesha-idol1.jpg",
    oldPrice: "₹3,999.00",
    newPrice: "₹2,999.00",
  },
  {
    name: "Brass Dancing Lord Ganesha Idol",
    image: "/images/ganesha-idol2.jpg",
    oldPrice: "₹999.00",
    newPrice: "₹499.00",
  },
  {
    name: "Brass Dancing Lord Ganesha Idol",
    image: "/images/ganesha-idol3.jpg",
    oldPrice: "₹2,999.00",
    newPrice: "₹1,999.00",
  },
  {
    name: "Brass Buddha Door Knocker",
    image: "/images/buddha-knocker.jpg",
    oldPrice: "₹1,999.00",
    newPrice: "₹1,499.00",
  },
  {
    name: "Brass Dancing Lord Ganesha Idol",
    image: "/images/ganesha-idol1.jpg",
    oldPrice: "₹3,999.00",
    newPrice: "₹2,999.00",
  },
  {
    name: "Brass Dancing Lord Ganesha Idol",
    image: "/images/ganesha-idol2.jpg",
    oldPrice: "₹999.00",
    newPrice: "₹499.00",
  },
  {
    name: "Brass Dancing Lord Ganesha Idol",
    image: "/images/ganesha-idol3.jpg",
    oldPrice: "₹2,999.00",
    newPrice: "₹1,999.00",
  },
  {
    name: "Brass Dancing Lord Ganesha Idol",
    image: "/images/ganesha-idol3.jpg",
    oldPrice: "₹2,999.00",
    newPrice: "₹1,999.00",
  },
  {
    name: "Brass Buddha Door Knocker",
    image: "../public/images/logo.png",
    oldPrice: "₹1,999.00",
    newPrice: "₹1,499.00",
  },
  {
    name: "Brass Dancing Lord Ganesha Idol",
    image: "/images/ganesha-idol1.jpg",
    oldPrice: "₹3,999.00",
    newPrice: "₹2,999.00",
  },
  {
    name: "Brass Dancing Lord Ganesha Idol",
    image: "/images/ganesha-idol2.jpg",
    oldPrice: "₹999.00",
    newPrice: "₹499.00",
  },
  {
    name: "Brass Dancing Lord Ganesha Idol",
    image: "/images/ganesha-idol3.jpg",
    oldPrice: "₹2,999.00",
    newPrice: "₹1,999.00",
  },
  {
    name: "Brass Buddha Door Knocker",
    image: "/images/buddha-knocker.jpg",
    oldPrice: "₹1,999.00",
    newPrice: "₹1,499.00",
  },
  {
    name: "Brass Dancing Lord Ganesha Idol",
    image: "/images/ganesha-idol1.jpg",
    oldPrice: "₹3,999.00",
    newPrice: "₹2,999.00",
  },
  {
    name: "Brass Dancing Lord Ganesha Idol",
    image: "/images/ganesha-idol2.jpg",
    oldPrice: "₹999.00",
    newPrice: "₹499.00",
  },
  {
    name: "Brass Dancing Lord Ganesha Idol",
    image: "/images/ganesha-idol3.jpg",
    oldPrice: "₹2,999.00",
    newPrice: "₹1,999.00",
  },
  {
    name: "Brass Dancing Lord Ganesha Idol",
    image: "/images/ganesha-idol3.jpg",
    oldPrice: "₹2,999.00",
    newPrice: "₹1,999.00",
  },
];

const router = express.Router();

router.use(verifytoken);

router.get("/store", (req, res) => {
  res.render("store", { products });
});

router.get("/admin", authorizeroles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get(
  "/artisan",
  authorizeroles("admin", "manager", "artisan"),
  (req, res) => {
    res.json({ message: "Welcome Artisan" });
  },
);

router.get("/manager", authorizeroles("admin", "manager"), (req, res) => {
  res.json({ message: "Welcome Manager" });
});

router.get(
  "/customer",
  authorizeroles("admin", "manager", "user"),
  (req, res) => {
    res.json({ message: "Welcome Customer" });
  },
);

export default router;
