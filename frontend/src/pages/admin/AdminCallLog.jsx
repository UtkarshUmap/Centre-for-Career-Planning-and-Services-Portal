import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import CallLogTable from "../../components/adminCallLog/CallLogTable.jsx";
import { getAllCallLogs } from "../../api/liaisoningAPIs/callLogs.js";
import { exportToCSV } from "../../utils/exportCSV";

const AdminCallLog = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [filters, setFilters] = useState({ searchTerm: "", caller: "All Callers", startDate: "", endDate: "" });

  const fetchLogs = async () => {
    try {
      const response = await getAllCallLogs();
      const apiLogs = response.data || [];
      const mappedLogs = apiLogs.map((log) => ({
        id: log.log_id,
        caller: log.caller_name || "Unknown",
        hrContact: log.hr_name || "Unknown",
        company: log.company_name || "N/A",
        date: log.call_timestamp ? new Date(log.call_timestamp).toLocaleDateString() : "N/A",
        outcome: log.call_outcome || "N/A",
        summary: log.conversation_summary || "No summary available",
        adminComment: log.admin_comments || "",
      }));
      setLogs(mappedLogs);
    } catch (error) {
      console.error("Error fetching call logs:", error);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  useEffect(() => {
    let result = logs;
    if (filters.searchTerm) {
      result = result.filter(log =>
        log.caller.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        log.summary.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        log.hrContact.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    if (filters.caller !== "All Callers") result = result.filter(log => log.caller === filters.caller);
    if (filters.startDate) result = result.filter(log => new Date(log.date) >= new Date(filters.startDate));
    if (filters.endDate) result = result.filter(log => new Date(log.date) <= new Date(filters.endDate));
    setFilteredLogs(result);
  }, [filters, logs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Master Call Log</h1>
            <p className="text-slate-500 mt-1">View, manage, and analyze all call logs across the team.</p>
          </div>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700 flex items-center gap-2"
            onClick={() => exportToCSV(filteredLogs, "Call_Log.csv")}
          >
            <Download size={18} /> Export CSV
          </button>
        </div>

        <div className="my-6 p-4 bg-white rounded-lg shadow-md flex items-center gap-4 flex-wrap">
          <input type="search" name="searchTerm" value={filters.searchTerm} onChange={handleFilterChange} placeholder="Search summary, HR..." className="flex-grow px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-teal-500 sm:text-sm" style={{ minWidth: "200px" }} />
          <select name="caller" value={filters.caller} onChange={handleFilterChange} className="border border-slate-300 rounded-md p-2 text-sm">
            <option>All Callers</option>
            {[...new Set(logs.map(log => log.caller))].map(caller => <option key={caller}>{caller}</option>)}
          </select>
          <div className="flex items-center gap-2 text-sm">
            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="border border-slate-300 rounded-md p-1.5" />
            <span>to</span>
            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="border border-slate-300 rounded-md p-1.5" />
          </div>
        </div>

        <CallLogTable logs={filteredLogs} selectedLogs={selectedLogs} setSelectedLogs={setSelectedLogs} fetchLogs={fetchLogs} />
      </div>
    </div>
  );
};

export default AdminCallLog;
