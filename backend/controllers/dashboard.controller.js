import {
  getCallerStats,
  getRecentCallLogs,
  getUpcomingFollowUps,
  getAssignedHRContacts
} from "../models/dashboard.model.js";

import {
  getStats,
  getWeeklyCallActivity,
  getRecentActivity,
  getTopCallers,
  getActionItems
} from "../models/adminDashboard.model.js";

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




export const getAdminDashboard = async (req, res) => {
  try {
    const stats = await getStats();
    const weeklyData = await getWeeklyCallActivity();
    const recentActivity = await getRecentActivity();
    const topCallers = await getTopCallers();
    const actionItems = await getActionItems();

    const weeklyCallActivity = {
      labels: weeklyData.map(r => r.day),
      positive: weeklyData.map(r => r.positive),
      followUp: weeklyData.map(r => r.follow_up),
      notReachable: weeklyData.map(r => r.not_reachable),
    };

    res.json({
      success: true,
      data: {
        stats: {
          totalCalls: parseInt(stats.total_calls, 10),
          positiveResponses: parseInt(stats.positive_responses, 10),
          followUpsPending: parseInt(stats.followups_pending, 10),
          newContacts: parseInt(stats.new_contacts, 10),
        },
        weeklyCallActivity,
        recentActivity,
        topCallers,
        actionItems: [
          { id: 1, text: "New Users pending approval", count: actionItems.new_users, icon: "UserPlus", color: "yellow" },
          { id: 2, text: "HR Contacts pending approval", count: actionItems.pending_contacts, icon: "ClipboardList", color: "blue" },
          { id: 3, text: "Follow-ups are overdue", count: actionItems.overdue_followups, icon: "Clock", color: "red" },
        ]
      }
    });

  } catch (error) {
    console.error("Error in getAdminDashboard:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

