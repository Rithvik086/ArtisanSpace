import express from 'express'
const router = express.Router();

const astrole = "artisan";

router.get("/", (req, res) => {
    res.json({ message: "Welcome Artisan" });

  
});

router.get("/workshops", (req, res) => {
    res.json({ message: "workshop page coming soon" });

  
});

router.get("/listings", (req, res) => {
    res.render("artisan/artisanlisting",{role: astrole});

  
});

export default router;