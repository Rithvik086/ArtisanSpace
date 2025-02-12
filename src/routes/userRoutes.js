import express from 'express';
import verifytoken from '../middleware/authMiddleware.js';

import  authorizeroles from '../middleware/roleMiddleware.js'

const router = express.Router();

router.get("/admin", verifytoken, authorizeroles("admin"),(req, res) => {
    res.json({ message: "Welcome Admin" });
});

router.get("/artisan", verifytoken, authorizeroles("admin","manager","artisan"),(req, res) => {
    res.json({ message: "Welcome Artisan" });
});

router.get("/manager", verifytoken,authorizeroles("admin","manager"), (req, res) => {
    res.json({ message: "Welcome Manager" });
});

router.get("/customer", verifytoken, authorizeroles("admin","manager","user"),(req, res) => {
    res.json({ message: "Welcome Customer" });
});

export default router;
