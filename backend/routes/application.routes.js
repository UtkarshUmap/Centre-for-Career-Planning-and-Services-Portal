import express from "express";
import {
  getStudentApplications,
  applyToJob,
  cancelApplication,
  getJobApplications,
  getAppliedJobs, 
} from "../controllers/applications.controller.js";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/student-applications", protectRoute, getStudentApplications);
// FIX: Changed the route path from "/apply" to "/" to match the frontend request: POST /api/applications
router.post("/", protectRoute, applyToJob);
router.delete("/cancel/:jobId", protectRoute, authorizeRoles("admin"), cancelApplication);
router.get("/job/:jobId/applicants", protectRoute, authorizeRoles("admin"), getJobApplications);
router.get("/applied-jobs", protectRoute, getAppliedJobs);
// Removed the redundant/incorrect router.post('/', applicationsController.createApplication);

export default router;
