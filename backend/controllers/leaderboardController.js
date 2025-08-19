// controllers/leaderboardController.js
import User from "../models/User.js";

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard", error: err });
  }
};
