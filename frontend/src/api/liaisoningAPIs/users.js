import apiClient from "../../utils/apiClient.js";

// Get all users (optionally filter by status or role)
export const getAllUsers = async (params = {}) => {
  const { data } = await apiClient.get("/users", { params });
  return data;
};

// Approve a user
export const approveUser = async (id) => {
  const { data } = await apiClient.patch(`/users/${id}/approve`);
  return data;
};

// Delete a user
export const deleteUser = async (id) => {
  const { data } = await apiClient.delete(`/users/${id}`);
  return data;
};


// Revoke a user
export const revokeUser = async (id) => {
  const { data } = await apiClient.patch(`/users/${id}/revoke`);
  return data;
};

// Send Admin SMS to caller
export const sendAdminSMS = async (callerId, adminMessage) => {
  const { data } = await apiClient.post(`/users/${callerId}/send-sms`, {
    adminMessage,
  });
  return data;
};