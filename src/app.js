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
const port = process.env.PORT || 3000;

// Middleware that parses incoming requests with JSON payloads(send through postman)
app.use(express.json());

// Middleware that parses incoming requests with urlencoded payloads(sent through forms)
app.use(express.urlencoded({ extended: true }));

// Middleware that parses incoming requests with cookies (just to p)
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", redirectBasedOnRole);

// Public partial routes for homepage
app.get("/partials/navbar", (req, res) => {
  res.sendFile(path.join(__dirname, "public/partials/navbar.html"));
});

app.get("/partials/footer", (req, res) => {
  res.sendFile(path.join(__dirname, "public/partials/footer.html"));
});

app.get("/partials/header", (req, res) => {
  res.sendFile(path.join(__dirname, "public/partials/header.html"));
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/signup", (req, res) => {
  // Serve the static converted auth.html (DHTML) so client-side JS handles form submits
  res.sendFile(path.join(__dirname, "public/auths", "auth.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/auths", "auth.html"));
});

app.use("/", authroutes);
app.use("/", useroutes);

app.all("*", (req, res) => {
  res
    .status(404)
    .sendFile(path.join(process.cwd(), "src", "public", "accessdenied.html"));
});

app.use((err, req, res, next) => {
  console.error(err);
  // If an EJS view lookup failed (old code still calling res.render), fall back to static access denied page
  if (err && err.message && err.message.includes("Failed to lookup view")) {
    return res
      .status(404)
      .sendFile(path.join(process.cwd(), "src", "public", "accessdenied.html"));
  }
  res.status(500).send({
    success: false,
    message: "Internal Server Error",
  });
});

// Starts an Express server locally on port 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
