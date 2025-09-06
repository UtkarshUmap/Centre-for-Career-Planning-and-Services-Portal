import clientAPI from "../../utils/apiClient.js";

// fetch caller dashboard data
export const fetchCallerDashboard = async () => {
  try {
    const res = await clientAPI.get("/dashboard");
    return res.data;
  } catch (err) {
    console.error("Error fetching dashboard:", err);
    throw err;
  }
};