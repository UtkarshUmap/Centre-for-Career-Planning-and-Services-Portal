import apiClient from "../../utils/apiClient.js";


export const getAllCallersStats = async () => {
  const { data } = await apiClient.get("/callers-stats");
  return data;
};
