// src/api/companies.js
import apiClient from "../../utils/apiClient.js";

// Get all companies (with optional filters or pagination)
export const getAllCompanies = async (params = {}) => {
  const { data } = await apiClient.get("/companies", { params });
  return data;
};

// Get a single company by ID
export const getCompanyById = async (id) => {
  const { data } = await apiClient.get(`/companies/${id}`);
  return data;
};

// Create a new company
export const createCompany = async (company) => {
  const { data } = await apiClient.post("/companies", company);
  return data;
};

// Update an existing company
export const updateCompany = async (id, updates) => {
  const { data } = await apiClient.put(`/companies/${id}`, updates);
  return data;
};

// Delete a company
export const deleteCompany = async (id) => {
  const { data } = await apiClient.delete(`/companies/${id}`);
  return data;
};
