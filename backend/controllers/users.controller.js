import Users from "../models/users.model.js";
import { sendAdminSMSToCaller } from "../utils/emails.js";
import pool from "../config/postgredb.js"

// Get users (approved, pending, all)
export const getUsers = async (req, res) => {
  try {
    const { status, role } = req.query;
    const users = await Users.getUsers({ status, role });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Approve user
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Users.approveUser(id);

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error approving user:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Revoke user
export const revokeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Users.revokeUser(id);

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error revoking user:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Users.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted", data: deleted });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const sendAdminSMSToCallerController = async (req, res) => {
  try {
    const { callerId } = req.params;
    const { adminMessage } = req.body;

    if (!adminMessage) {
      return res.status(400).json({ error: "Admin message is required" });
    }

    // Query caller from PostgreSQL
    const result = await pool.query(
      "SELECT user_id, full_name, email FROM users WHERE user_id = $1",
      [callerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Caller not found" });
    }

    const caller = result.rows[0];

    // Call the email service
    await sendAdminSMSToCaller(caller.email, caller.full_name, adminMessage);

    res.status(200).json({ message: "Admin SMS (email) sent successfully" });
  } catch (error) {
    console.error("Error in sendAdminSMSToCallerController:", error.message);
    res.status(500).json({ error: "Failed to send Admin SMS" });
  }
};