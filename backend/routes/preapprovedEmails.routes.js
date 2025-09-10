import express from "express";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";
import {
  getPreapprovedEmails,
  addPreapprovedEmails,
  deletePreapprovedEmails,
} from "../controllers/preapprovedEmails.controller.js";

const router = express.Router();

// Get all preapproved emails
router.get("/", protectRoute, authorizeRoles("admin"), getPreapprovedEmails);

// Add multiple preapproved emails
router.post("/", protectRoute, authorizeRoles("admin"), addPreapprovedEmails);

// Delete multiple preapproved emails
router.delete("/", protectRoute, authorizeRoles("admin"), deletePreapprovedEmails);

export default router;
