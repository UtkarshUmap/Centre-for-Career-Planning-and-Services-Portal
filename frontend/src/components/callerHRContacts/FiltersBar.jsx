import { Search, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/exportCSV';

const FiltersBar = ({ contacts, searchTerm, setSearchTerm, assignmentFilter, setAssignmentFilter }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name, company, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <select
        value={assignmentFilter}
        onChange={(e) => setAssignmentFilter(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500"
      >
        <option value="all">All Contacts</option>
        <option value="me">Assigned to Me</option>
        <option value="assigned">Assigned</option>
        <option value="unassigned">Unassigned</option>
      </select>
      <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
      onClick={()=>exportToCSV(contacts,"Filtered_HR_Contacts.csv")}>
        <Download className="h-4 w-4" /> Export CSV
      </button>
    </div>
  );
};

export default FiltersBar;
