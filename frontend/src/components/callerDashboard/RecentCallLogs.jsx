import React from "react";

const RecentCallLogs = ({ logs }) => (
  <div className="bg-white shadow rounded-xl p-4">
    <h2 className="text-lg font-semibold mb-3">Recent Call Logs</h2>
    {logs.length === 0 ? (
      <p className="text-gray-500 text-sm">No recent calls</p>
    ) : (
      <ul className="divide-y divide-gray-200">
        {logs.map((log) => (
          <li key={log.log_id} className="py-2">
            <p className="font-medium">{log.contact_name} ({log.company_name || "N/A"})</p>
            <p className="text-sm text-gray-600">
              {log.call_outcome} • {new Date(log.call_timestamp).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default RecentCallLogs;
