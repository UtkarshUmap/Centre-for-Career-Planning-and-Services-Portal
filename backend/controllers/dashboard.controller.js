import {
  getCallerStats,
  getRecentCallLogs,
  getUpcomingFollowUps,
  getAssignedHRContacts
} from "../models/dashboard.model.js";

export const getCallerDashboard = async (req, res) => {
  try {
    const callerId = req.user.user_id; // from auth middleware
    // console.log("Caller ID:", callerId);

    // Fetch data in parallel
    const [stats, recentLogs, followUps, assignedHR] = await Promise.all([
      getCallerStats(callerId),
      getRecentCallLogs(callerId),
      getUpcomingFollowUps(callerId),
      getAssignedHRContacts(callerId),
    ]);

    res.json({
      success: true,
      data: {
        stats,
        recent_call_logs: recentLogs,
        upcoming_follow_ups: followUps,
        assigned_hr_contacts: assignedHR,
      },
    });
  } catch (err) {
    console.error("Error in getCallerDashboard:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
