import express from "express";
const router = express.Router();
const mngrole = "manager";
router.get("/", (req, res) => {
    res.render("manager/managerdashboard",{role:mngrole});

  
});
router.get("/content-moderation", (req, res) => {
    res.render("manager/managercontentmoderation",{role:mngrole});

  
});
router.get("/listing", (req, res) => {
    res.render("manager/managerlisting",{role:mngrole});

  
});

export default router;