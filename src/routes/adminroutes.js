import express from 'express'

const router = express.Router();
router.get("/", (req, res) => {
    res.json({ message: "Welcome admin" });

  
});

router.get("/suppport-ticket", (req, res) => {
    res.json({ message: "support page coming soon" });
  
});

export default router