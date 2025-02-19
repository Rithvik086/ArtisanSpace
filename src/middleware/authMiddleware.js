import jwt from 'jsonwebtoken';

const verifytoken = (req, res, next) => {
    if (req.path === "/login" || req.path === "/signup") {
        return next();
    }

    let token = req.cookies.token;
     if(!token){
        return res.status(401).render('accessdenied')
     }

     try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded;
        next()

     }catch(err){
        res.clearCookie("token");
        return res.redirect('/login');

     }
    
};

export default verifytoken;
 