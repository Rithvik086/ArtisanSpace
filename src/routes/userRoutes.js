import express from 'express'
const router = express.Router();

router.get("/admin",(req,res)=>{
    res.json({message:"welcome admin"})
    
})
router.get("/artisan",(req,res)=>{
    res.json({message:"welcome artisan"})

})
router.get("/manager",(req,res)=>{
    res.json({message:"welcome manager"})

})
router.get("/customer",(req,res)=>{
    res.json({message:"welcome customer"})

})

export default router;
