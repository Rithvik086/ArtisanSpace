import express from "express";

const router = express.Router();

const custrole = "customer"

router.get("/", (req, res) => {
  res.render("customer/customerhome",{role: custrole })


});
router.get("/workshop", (req, res) => {
  res.render("customer/workshop",{role : custrole});
});
router.get("/settings", (req, res) => {
  res.json({ message: "settings" });
});

router.get("/orders", (req, res) => {
res.render("customer/customerorders",{role:custrole})

});

router.get("/aboutus", (req, res) => {
res.render("customer/Aboutus",{role:custrole})
});
router.get("/contactus", (req, res) => {
  res.render("customer/customercontactus",{role:custrole})
  });
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
  res.render("customer/store", { products , role:custrole });
});
export default router;

