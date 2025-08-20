import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/users.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import claimRoutes from "./routes/claims.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/claims", claimRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("LeaderBoard App Backend is running ✅");
});

// DB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not set in environment variables!");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
