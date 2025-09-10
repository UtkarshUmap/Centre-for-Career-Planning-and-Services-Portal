import PreapprovedEmail from "../models/preapprovedEmails.model.js";
import { sendCallerApprovedEmail } from "../utils/emails.js";

// Get all preapproved emails
export const getPreapprovedEmails = async (req, res) => {
  try {
    const emails = await PreapprovedEmail.getAll();
    res.json({ success: true, data: emails });
  } catch (error) {
    console.error("Error in getPreapprovedEmails:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Add multiple preapproved emails
export const addPreapprovedEmails = async (req, res) => {
  try {
    const { emails } = req.body;

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ success: false, message: "Emails array is required" });
    }

    const added = await PreapprovedEmail.bulkInsert(emails);

    await Promise.all(
      added.map((row) =>
        sendCallerApprovedEmail(row.email, "https://localhost:5173/signup")
      )
    );

    res.json({ success: true, message: "Emails added successfully & notifications sent", data: added });
  } catch (error) {
    console.error("Error in addPreapprovedEmails:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete multiple preapproved emails
export const deletePreapprovedEmails = async (req, res) => {
  try {
    const { emails } = req.body;

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ success: false, message: "Emails array is required" });
    }

    await PreapprovedEmail.bulkDelete(emails);
    res.json({ success: true, message: "Emails deleted successfully" });
  } catch (error) {
    console.error("Error in deletePreapprovedEmails:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
