import express from "express";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";
import { getCallerDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", protectRoute, authorizeRoles("admin", "caller"), getCallerDashboard);

export default router;
