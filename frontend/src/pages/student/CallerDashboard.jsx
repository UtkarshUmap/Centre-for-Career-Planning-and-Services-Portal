import { useEffect, useState } from "react";
import StatsCard from "../../components/callerDashboard/StatsCards";
import RecentCallLogs from "../../components/callerDashboard/RecentCallLogs";
import UpcomingFollowUps from "../../components/callerDashboard/UpcomingFollowUps";
import AssignedHRContacts from "../../components/callerDashboard/AssignedHRList";
import { fetchCallerDashboard } from "../../api/liaisoningAPIs/dashboard";
import Sidebar from "../../components/Sidebar";
import AddLogOptions from '../../components/callerDashboard/AddLogOptions.jsx';
import LogForm from '../../components/callerDashboard/LogForm.jsx';

const CallerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedHR, setSelectedHR] = useState(null);

  

  const [ showHROptionForLogForm , setShowHROptionForLogForm ] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
 

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchCallerDashboard();
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!dashboardData) {
    return <div className="flex justify-center items-center h-screen">Failed to load dashboard</div>;
  }

  const onSubmit = () => {
    fetchCallerDashboard().then(res => setDashboardData(res.data));
  }

  const { stats, recent_call_logs, upcoming_follow_ups, assigned_hr_contacts } = dashboardData;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#0c4a42]">Caller Dashboard</h1>
          <button className="bg-[#0c4a42] text-white px-4 py-2 rounded-lg shadow hover:bg-[#106d60] transition" onClick={() => setShowHROptionForLogForm(!showHROptionForLogForm)} >
            + Log New Interaction
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatsCard title="Total Contacts" value={stats.total_contacts} color="#0c4a42" />
          {/* <StatsCard title="Approved Contacts" value={stats.approved_contacts} color="#047857" />
          <StatsCard title="Unapproved Contacts" value={stats.unapproved_contacts} color="#b91c1c" /> */}
          <StatsCard title="Total Call Logs" value={stats.total_call_logs} color="#2563eb" />
          <StatsCard title="Connected Calls" value={stats.connected_calls} color="#059669" />
          <StatsCard title="Follow Up Calls" value={stats.follow_up_calls} color="#d97706" />
        </div>

        {/* Logs + Follow-ups */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left section: Call logs */}
          <div className="lg:col-span-2 space-y-6">
            <RecentCallLogs logs={recent_call_logs} />
          </div>

          {/* Right section: Follow-ups */}
          <div className="space-y-6">
            <UpcomingFollowUps followUps={upcoming_follow_ups} />
          </div>
        </div>

        {/* HR Contacts (full width) */}
        <AssignedHRContacts contacts={assigned_hr_contacts} />
      </main>

       {showHROptionForLogForm && (
      <AddLogOptions setShowHROptionForLogForm={setShowHROptionForLogForm} setShowLogForm={setShowLogForm} setSelectedHR={setSelectedHR} />
    )}

        
        {showLogForm && (
          <LogForm hr={selectedHR} setLogForm={setShowLogForm} onSubmit={onSubmit} />
        )}
      
    </div>
  );
};

export default CallerDashboard;
