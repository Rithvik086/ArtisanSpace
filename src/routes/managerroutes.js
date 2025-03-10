import express from "express";
const router = express.Router();
router.get("/", (req, res) => {
    res.json({ message: "Welcome manager" });

  
});
router.get("/content-moderation", (req, res) => {
    res.json({ message: "moderation page coming soon" });

  
});
router.get("/listing", (req, res) => {
    res.json({ message: "listing page coming soon" });

  
});

export default router;