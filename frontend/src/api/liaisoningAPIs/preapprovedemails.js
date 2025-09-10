import apiClient from "../../utils/apiClient";

// Fetch all preapproved emails
export const getAllPreapprovedEmails = async () => {
  const res = await apiClient.get("/preapproved-emails");
  return res.data;
};

// Add multiple preapproved emails
export const addPreapprovedEmails = async (emails) => {
  const res = await apiClient.post("/preapproved-emails", { emails });
  return res.data;
};

// Delete multiple preapproved emails
export const deletePreapprovedEmails = async (emails) => {
  const res = await apiClient.delete("/preapproved-emails", { data: { emails } });
  return res.data;
};
