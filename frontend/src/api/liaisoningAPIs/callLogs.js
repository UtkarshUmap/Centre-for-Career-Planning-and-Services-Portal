import clientAPI from "../../utils/apiClient.js";

// Fetch all call logs (caller sees their own, admin sees all)
export const getAllCallLogs = async () => {
  const res = await clientAPI.get("/call-logs");
  return res.data;
};

// Fetch single call log by ID
export const getCallLogById = async (id) => {
  const res = await clientAPI.get(`/call-logs/${id}`);
  return res.data;
};

// Create new call log
export const createCallLog = async (data) => {
  const res = await clientAPI.post("/call-logs", data);
  return res.data;
};

// Update call log (caller/admin based on auth)
export const updateCallLog = async (id, data) => {
  const res = await clientAPI.put(`/call-logs/${id}`, data);
  return res.data;
};

// Delete call log (admin only)
export const deleteCallLog = async (id) => {
  const res = await clientAPI.delete(`/call-logs/${id}`);
  return res.data;
};
