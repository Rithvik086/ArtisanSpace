import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authroutes from "./routes/authroutes.js";
import useroutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import dbConnect from "./config/dbconnect.js";
import { removeUser } from "./models/usermodel.js";

dbConnect();

const app = express();
const port = 3000;
const hostname = "0.0.0.0";
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const role = req.user ? req.user.role : null;
  res.render("HomePage", {role});
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/signup", (req, res) => {
  res.render("auth", { page: "signup" });
});

app.get("/login", (req, res) => {
  res.render("auth", { page: "login" });
});

app.use("/", authroutes);
app.use("/", useroutes);

app.all("*", (req, res) => {
  // res.send("This route is accessible");
  res.render("accessdenied");
});

// Starts an Express server locally on port 3000
app.listen(port, hostname, () => {
  console.log(`Listening on http://${hostname}:${port}/`);
});
