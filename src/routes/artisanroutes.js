import express from 'express'
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "Welcome Artisan" });

  
});

router.get("/workshops", (req, res) => {
    res.json({ message: "workshop page coming soon" });

  
});

router.get("/listings", (req, res) => {
    res.json({ message: "listing page coming soon " });

  
});

export default router;