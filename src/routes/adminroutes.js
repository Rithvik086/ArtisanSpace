import express from 'express'

const router = express.Router();

const admrole = "admin";
router.get("/", (req, res) => {
    res.render("admin/admindashboard",{role:admrole});

  
});

router.get("/support-ticket", (req, res) => {
   res.render("admin/adminsupportticket",{role:admrole});
  
});

export default router