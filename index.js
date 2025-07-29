import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "./server.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import donationsRoutes from "./routes/donationsRoutes.js";
// import { protect, authorizeRoles } from "./middleware/authMiddleware.js";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// const db = require("./server");
const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/donations", donationsRoutes);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Views/index.html");
});

app.get("/volunteer", (req, res) => {
  res.redirect("/login?form=volunteer");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/Views/login.html");
});

app.get("/register", (req, res) => {
  res.redirect("/login?form=register");
});

app.get("/vol-dashboard", (req, res) => {
  res.sendFile(__dirname + "/Views/volunteer.html");
});

app.get("/Donor-dashboard", (req, res) => {
  res.sendFile(__dirname + "/Views/donor.html");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
