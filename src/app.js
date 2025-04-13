import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authroutes from "./routes/authroutes.js";
import useroutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbconnect.js";
import { redirectBasedOnRole } from "./middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

await dbConnect();

const app = express();
const port = 3000;

// Middleware that parses incoming requests with JSON payloads(send through postman)
app.use(express.json());

// Middleware that parses incoming requests with urlencoded payloads(sent through forms)
app.use(express.urlencoded({ extended: true }));

// Middleware that parses incoming requests with cookies (just to p)
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", redirectBasedOnRole);

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
  res.status(404).render("accessdenied");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Starts an Express server locally on port 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
