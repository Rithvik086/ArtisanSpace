import jwt from "jsonwebtoken";
import path from 'path';
import { userExists } from "../services/userServices.js";

export const verifytoken = async (req, res, next) => {
  if (req.path === "/login" || req.path === "/signup") {
    return next();
  }

  let token = req.cookies.token;
  if (!token) {
    return res.status(401).sendFile(path.join(process.cwd(), 'src', 'public', 'accessdenied.html'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (await userExists(req.user.id)) {
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

export const redirectBasedOnRole = async (req, res, next) => {
  // If no token exists, just show the homepage
  let token = req.cookies.token;
  if (!token) {
    return res.render("HomePage", { role: null });
  }

  try {
    // Decode the token
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    // Check if user exists in the database
    if (await userExists(user.id)) {
      // Extract role from the token
      const role = user.role;

      // Redirect based on role
      switch (role) {
        case "admin":
          res.redirect("/admin/");
          break;
        case "manager":
          res.redirect("/manager/");
          break;
        case "customer":
          res.redirect("/customer/");
          break;
        case "artisan":
          res.redirect("/artisan/");
          break;
        default:
          // If no recognized role, just proceed
          next();
          break;
      }
    } else {
      // User doesn't exist anymore, clear cookie and continue
      res.clearCookie("token");
      next();
    }
  } catch (err) {
    // Invalid token, clear cookie and continue
    res.clearCookie("token");
    next();
  }
};
