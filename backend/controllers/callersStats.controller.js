import CallersStats from "../models/callersStats.model.js";

// Controller for fetching all callers stats
export const getAllCallersStats = async (req, res) => {
  try {
    const stats = await CallersStats.getAllStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error in getAllCallersStats:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
