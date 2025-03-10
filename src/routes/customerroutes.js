import express from "express";

const router = express.Router();

router.get("/", (req, res) => {});
router.get("/workshop", (req, res) => {
  res.render("workshop");
});
router.get("/settings", (req, res) => {});

router.get("/orders", (req, res) => {});
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
router.get("/store", (req, res) => {
  res.render("store", { products });
});
export default router;

