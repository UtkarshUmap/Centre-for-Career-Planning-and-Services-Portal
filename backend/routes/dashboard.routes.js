import express from "express";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";
import { getCallerDashboard } from "../controllers/dashboard.controller.js";
import { getAdminDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", protectRoute, authorizeRoles("admin", "caller"), getCallerDashboard);

router.get("/admin", protectRoute, authorizeRoles("admin"), getAdminDashboard);

export default router;
