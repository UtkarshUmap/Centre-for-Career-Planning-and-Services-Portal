import express from "express";
import { getUsers, approveUser, deleteUser , revokeUser, sendAdminSMSToCallerController  } from "../controllers/users.controller.js";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin-only access
router.get("/", protectRoute, authorizeRoles("admin"), getUsers);
router.patch("/:id/approve", protectRoute, authorizeRoles("admin"), approveUser);
router.delete("/:id", protectRoute, authorizeRoles("admin"), deleteUser);
router.patch("/:id/revoke", protectRoute, authorizeRoles("admin"), revokeUser);

router.post("/:callerId/send-sms", sendAdminSMSToCallerController);

export default router;
