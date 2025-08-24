// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import pool from "../config/postgredb.js";

config();

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token: ", token);

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized. Token not found" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Handle token errors separately
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    console.log("Decoded Token: ", decoded);

    if (!decoded?.userId) {
      return res.status(401).json({ success: false, message: "Not Authorized. Token invalid" });
    }

    // Fetch user from PostgreSQL
    const query = `SELECT user_id, full_name, email, role FROM users WHERE user_id = $1`;
    const { rows } = await pool.query(query, [decoded.userId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = rows[0];
    req.userId = rows[0].user_id; // UUID
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  };
};
