import express from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createCompany);
router.get("/", protectRoute, getAllCompanies);
router.get("/:id", protectRoute, getCompanyById);
router.put("/:id", protectRoute, updateCompany);
router.delete("/:id", protectRoute, deleteCompany);

export default router;
