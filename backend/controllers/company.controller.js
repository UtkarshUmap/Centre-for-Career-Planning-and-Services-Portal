import Company from "../models/company.model.js";

// Create
export const createCompany = async (req, res) => {
  try {
    const newCompany = await Company.createCompany(req.body);
    res.status(201).json({ success: true, data: newCompany });
  } catch (error) {
    console.error("Error in createCompany:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.getAllCompanies();
    res.json({ success: true, data: companies });
  } catch (error) {
    console.error("Error in getAllCompanies:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get one
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.getCompanyById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    res.json({ success: true, data: company });
  } catch (error) {
    console.error("Error in getCompanyById:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update
export const updateCompany = async (req, res) => {
  try {
    const updatedCompany = await Company.updateCompany(req.params.id, req.body);
    if (!updatedCompany) return res.status(404).json({ success: false, message: "Company not found or no changes" });
    res.json({ success: true, data: updatedCompany });
  } catch (error) {
    console.error("Error in updateCompany:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete
export const deleteCompany = async (req, res) => {
  try {
    const deleted = await Company.deleteCompany(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Company not found" });
    res.json({ success: true, message: "Company deleted successfully", data: deleted });
  } catch (error) {
    console.error("Error in deleteCompany:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
