import jwt from "jsonwebtoken";
import { userExist } from "../models/usermodel.js";

const verifytoken = async (req, res, next) => {
  if (req.path === "/login" || req.path === "/signup") {
    return next();
  }

  let token = req.cookies.token;
  if (!token) {
    return res.status(401).render("accessdenied");
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    if (await userExist(req.user.id)) {
      next();
    } else {
      res.clearCookie("token");
      return res.redirect("/signup");
    }
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
};

export default verifytoken;
