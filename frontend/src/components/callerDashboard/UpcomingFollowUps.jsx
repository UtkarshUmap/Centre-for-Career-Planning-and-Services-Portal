import React from "react";

const UpcomingFollowUps = ({ followUps }) => (
  <div className="bg-white shadow rounded-xl p-4">
    <h2 className="text-lg font-semibold mb-3">Upcoming Follow-Ups</h2>
    {followUps.length === 0 ? (
      <p className="text-gray-500 text-sm">No upcoming follow-ups</p>
    ) : (
      <ul className="divide-y divide-gray-200">
        {followUps.map((fu) => (
          <li key={fu.log_id} className="py-2">
            <p className="font-medium">{fu.contact_name} ({fu.company_name || "N/A"})</p>
            <p className="text-sm text-gray-600">
              {fu.next_follow_up_date} • {fu.remarks || "No remarks"}
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default UpcomingFollowUps;
