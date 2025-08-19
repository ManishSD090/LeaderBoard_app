// controllers/claimController.js
import User from "../models/User.js";
import ClaimHistory from "../models/ClaimHistory.js";

// 🎯 Claim random points (1–10) for a user
export const claimPoints = async (req, res) => {
  try {
    const { userId } = req.params;
    const points = Math.floor(Math.random() * 10) + 1;

    // update user points
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.points += points;
    await user.save();

    // create claim history
    const history = new ClaimHistory({ user: user._id, points });
    await history.save();

    res.json({
      message: "Points claimed successfully",
      userId: user._id,
      name: user.name,
      points: user.points,             // ✅ updated total points
      awardedPoints: points,           // ✅ just awarded
      createdAt: history.createdAt,    // ✅ valid timestamp
    });
  } catch (err) {
    res.status(500).json({ message: "Error claiming points", error: err });
  }
};

// 📜 Get full claim history
export const getHistory = async (req, res) => {
  try {
    const history = await ClaimHistory.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history", error: err });
  }
};
