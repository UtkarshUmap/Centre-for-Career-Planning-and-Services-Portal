// src/components/hrContacts/FilterBar.jsx
import React from "react";

const FilterBar = () => {
  return (
    <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow border">
      <input
        type="text"
        placeholder="Search by name or company..."
        className="px-3 py-2 border rounded-lg w-64"
      />
      <select className="px-3 py-2 border rounded-lg">
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <select className="px-3 py-2 border rounded-lg">
        <option value="">All Assignments</option>
        <option value="me">Assigned to me</option>
        <option value="others">Assigned to others</option>
        <option value="none">Unassigned</option>
      </select>
    </div>
  );
};

export default FilterBar;
