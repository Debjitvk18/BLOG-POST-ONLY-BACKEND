import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { createTableUsers } from "./models/userModel.js";
import { createTablePosts } from "./models/postModel.js";
import pool from "./config/db.js"; // for the test route

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Make uploads folder public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Database table setup
try {
  await createTableUsers();
  await createTablePosts();
  console.log("✅ Tables checked/created successfully");
} catch (err) {
  console.error("❌ Table creation failed:", err.message);
}

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// ✅ Test DB connection route
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
