import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Sidebar from '../../components/Sidebar.jsx';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { getAllCallLogs } from '../../api/liaisoningAPIs/callLogs.js';

import AddLogOptions from '../../components/callerDashboard/AddLogOptions.jsx';
import LogForm from '../../components/callerDashboard/LogForm.jsx';

// --- Outcome Badge ---
const OutcomeBadge = ({ outcome }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full capitalize";
  const styles = {
    connected: 'bg-green-100 text-green-800',
    follow_up: 'bg-yellow-100 text-yellow-800',
    not_reachable: 'bg-red-100 text-red-800',
    other: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`${baseClasses} ${styles[outcome] || 'bg-gray-100 text-gray-800'}`}>
      {outcome.replace('_', ' ')}
    </span>
  );
};

const CallLogsPage = () => {
  const [allLogs, setAllLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [view, setView] = useState('all');
  const [filters, setFilters] = useState({
    search: '',
    outcome: 'all',
    startDate: '',
    endDate: '',
  });

  const { authUser } = useAuthContext();
  const CURRENT_USER_ID = authUser?._id;

  const [ showHROptionForLogForm , setShowHROptionForLogForm ] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedHR, setSelectedHR] = useState(null);
 

  // Fetch logs
  const fetchLogs = async () => {
      try {
        const response = await getAllCallLogs();
        setAllLogs(response.data);
      } catch (error) {
        console.error("Error fetching call logs:", error);
      }
    };
  useEffect(() => {
    
    fetchLogs();
  }, []);

  const onSubmit = () => {
      fetchLogs().then(res => setAllLogs(res.data));
    }

  // Filter logic
  useEffect(() => {
    let result = allLogs;

    if (view === 'my') {
      result = result.filter(log => log.caller_id === CURRENT_USER_ID);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(log =>
        log.hr_name?.toLowerCase().includes(searchTerm) ||
        log.company_name?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.outcome !== 'all') {
      result = result.filter(log => log.call_outcome === filters.outcome);
    }

    if (filters.startDate) {
      result = result.filter(log => new Date(log.call_timestamp) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setDate(endDate.getDate() + 1);
      result = result.filter(log => new Date(log.call_timestamp) < endDate);
    }

    setFilteredLogs(result);
  }, [filters, view, allLogs, CURRENT_USER_ID]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {view === 'all' ? 'All Call Logs' : 'My Call Logs'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Review and search through call interaction records.
              </p>
            </div>
            <button className="mt-4 sm:mt-0 bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-600 transition"
              onClick={() => setShowHROptionForLogForm(true)}>
              Log a New Call
            </button>
          </div>

          {/* View Toggle */}
          <div className="mb-6 flex border-b border-gray-200">
            <button
              onClick={() => setView('all')}
              className={`py-2 px-4 text-sm font-medium ${view === 'all'
                ? 'border-b-2 border-teal-500 text-teal-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              All Call Logs
            </button>
            <button
              onClick={() => setView('my')}
              className={`py-2 px-4 text-sm font-medium ${view === 'my'
                ? 'border-b-2 border-teal-500 text-teal-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              My Call Logs
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search HR or Company..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Outcome */}
              <select
                name="outcome"
                value={filters.outcome}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="all">Filter by Outcome</option>
                <option value="connected">Connected</option>
                <option value="follow_up">Follow-up</option>
                <option value="not_reachable">Not Reachable</option>
                <option value="other">Other</option>
              </select>

              {/* Start Date */}
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />

              {/* End Date */}
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">HR Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Caller</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Outcome</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Summary</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Follow-Up On</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map(log => (
                      <tr key={log.log_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(log.call_timestamp)}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{log.hr_name}</div>
                          <div className="text-sm text-gray-500">{log.company_name || '—'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">{log.caller_name}</td>
                        <td className="px-6 py-4"><OutcomeBadge outcome={log.call_outcome} /></td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{log.conversation_summary}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(log.next_follow_up_date)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-500">
                        No call logs found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


       {showHROptionForLogForm && (
      <AddLogOptions setShowHROptionForLogForm={setShowHROptionForLogForm} setShowLogForm={setShowLogForm} setSelectedHR={setSelectedHR} />
    )}

        
        {showLogForm && (
          <LogForm hr={selectedHR} setLogForm={setShowLogForm} onSubmit={onSubmit} />
        )}


    </div>
  );
};

export default CallLogsPage;
