import OutcomeBadge from "../callerHRContacts/HRContactDetails/common/OutcomeBadge.jsx";
import LogActionsDropdown from "./LogActionsDropdown.jsx";

const CallLogTable = ({ logs, selectedLogs, setSelectedLogs, fetchLogs }) => {
  const handleSelectAll = (e) => {
    setSelectedLogs(e.target.checked ? logs.map((log) => log.id) : []);
  };

  const handleSelectOne = (id) => {
    setSelectedLogs((prev) =>
      prev.includes(id) ? prev.filter((logId) => logId !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {selectedLogs.length > 0 && (
        <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
          <p>{selectedLogs.length} item(s) selected</p>
          <button
            onClick={() => alert(`${selectedLogs.length} logs will be deleted.`)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            Delete Selected
          </button>
        </div>
      )}
      <table className="w-full text-sm text-left text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th className="p-4">
              <input type="checkbox" onChange={handleSelectAll} className="rounded" />
            </th>
            <th className="px-6 py-3">Caller</th>
            <th className="px-6 py-3">HR Contact</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Outcome</th>
            <th className="px-6 py-3">Summary Snippet</th>
            <th className="px-6 py-3">Admin Comment</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="bg-white border-b hover:bg-slate-50">
              <td className="p-4">
                <input
                  type="checkbox"
                  checked={selectedLogs.includes(log.id)}
                  onChange={() => handleSelectOne(log.id)}
                  className="rounded"
                />
              </td>
              <td className="px-6 py-4 font-medium text-slate-900">{log.caller}</td>
              <td className="px-6 py-4">{log.hrContact} ({log.company})</td>
              <td className="px-6 py-4">{log.date}</td>
              <td className="px-6 py-4"><OutcomeBadge outcome={log.outcome} /></td>
              <td className="px-6 py-4 text-xs italic">"{log.summary}"</td>
              <td className="px-6 py-4 text-xs">{log.adminComment || <span className="text-slate-400 italic">No comment</span>}</td>
              <td className="px-6 py-4 text-right">
                <LogActionsDropdown logId={log.id} fetchLogs={fetchLogs} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CallLogTable;
