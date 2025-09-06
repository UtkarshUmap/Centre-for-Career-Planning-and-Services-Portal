import React from "react";

const AssignedHRContacts = ({ contacts }) => (
  <div className="bg-white shadow rounded-xl p-4">
    <h2 className="text-lg font-semibold mb-3">Assigned HR Contacts</h2>
    {contacts.length === 0 ? (
      <p className="text-gray-500 text-sm">No assigned contacts</p>
    ) : (
      <ul className="divide-y divide-gray-200">
        {contacts.map((c) => (
          <li key={c.contact_id} className="py-2">
            <p className="font-medium">{c.full_name}</p>
            <p className="text-sm text-gray-600">{c.company_name} • {c.designation}</p>
            <span className={`text-xs px-2 py-1 rounded ${c.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {c.status}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default AssignedHRContacts;
