import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { getAllCallersStats } from '../../api/liaisoningAPIs/callersStats.js';
import { getAllHRContacts, bulkAssignHRsToCaller, bulkUnassignHRs } from '../../api/liaisoningAPIs/hrContacts.js';
import Sidebar from '../../components/Sidebar.jsx';

// --- Main Page Component ---
const ContactAssignmentPage = () => {
    const [callers, setCallers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [selectedCaller, setSelectedCaller] = useState(null);
    const [selectedContactIds, setSelectedContactIds] = useState([]);
    const [filter, setFilter] = useState('unassigned'); // 'unassigned' | 'assigned' | 'all'
    const [mode, setMode] = useState('assign'); // 'assign' | 'unassign'

    const fetchCallersStats = async () => {
        const response = await getAllCallersStats();
        setCallers(response.data);
    };
    useEffect(() => {
        fetchCallersStats();
    }, []);

    useEffect(() => {
        if (!selectedCaller && callers.length > 0) {
            setSelectedCaller(callers[0]);
        }
    }, [callers, selectedCaller]);

    const fetchContacts = async () => {
        const response = await getAllHRContacts();
        setContacts(response.data);
    };
    useEffect(() => {
        fetchContacts();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [callerSearchTerm, setCallerSearchTerm] = useState('');

    // Filter callers based on the search term
    const filteredCallers = callers.filter(caller =>
        caller.full_name.toLowerCase().includes(callerSearchTerm.toLowerCase())
    );

    // Effect to filter contacts when filter or search term changes
    useEffect(() => {
        let result = contacts;

        if (filter === 'unassigned') {
            result = result.filter(c => !c.assigned_to_user_id);
        } else if (filter === 'assigned') {
            result = result.filter(c => c.assigned_to_user_id);
        }

        if (searchTerm) {
            const lowercasedSearch = searchTerm.toLowerCase();
            result = result.filter(c =>
                c.full_name.toLowerCase().includes(lowercasedSearch) ||
                (c.company_id && c.company_id.toLowerCase().includes(lowercasedSearch))
            );
        }

        setFilteredContacts(result);
    }, [contacts, filter, searchTerm]);

    // Handle selecting/deselecting a single contact
    const handleSelectContact = (contactId) => {
        setSelectedContactIds(prev =>
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    // Handle selecting/deselecting all visible contacts
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedContactIds(filteredContacts.map(c => c.contact_id));
        } else {
            setSelectedContactIds([]);
        }
    };

    // Handle the assignment/unassignment logic
    const handleAssignContacts = async () => {
        if (selectedContactIds.length === 0) return;

        if (mode === "assign") {
            await bulkAssignHRsToCaller(selectedCaller?.caller_id, selectedContactIds);
        } else {
            await bulkUnassignHRs(selectedContactIds);
        }

        console.log({
            mode,
            assignTo: selectedCaller?.caller_id,
            contactIds: selectedContactIds
        });

        setSelectedContactIds([]); // Clear selection after action
        fetchContacts();
        fetchCallersStats();
    };

    const isAllSelected = filteredContacts.length > 0 && selectedContactIds.length === filteredContacts.length;

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Contact Assignment</h1>
                    <p className="text-slate-500 mt-1">Assign and unassign HR contacts to student callers.</p>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel: Callers List */}
                    <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 h-fit">
                        <h3 className="font-bold text-slate-800 px-2 mb-2">Student Callers</h3>
                        <div className="px-2 mb-3">
                            <input
                                type="search"
                                value={callerSearchTerm}
                                onChange={(e) => setCallerSearchTerm(e.target.value)}
                                placeholder="Search callers..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            />
                        </div>
                        <ul className="space-y-1">
                            {filteredCallers.map(caller => {
                                const initials = caller.full_name
                                    .split(" ")
                                    .map(word => word[0])
                                    .join("")
                                    .toUpperCase();
                                return (
                                    <li key={caller.caller_id}>
                                        <a
                                            href="#"
                                            onClick={() => setSelectedCaller(caller)}
                                            className={`flex justify-between items-center p-3 rounded-lg border-l-4 transition-colors ${selectedCaller?.caller_id === caller.caller_id
                                                ? 'bg-teal-50 border-l-teal-500'
                                                : 'border-transparent hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 mr-3">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-800">{caller.full_name}</p>
                                                    <p className="text-xs text-slate-500">{caller.total_contacts_assigned} Contacts Assigned</p>
                                                </div>
                                            </div>
                                            {selectedCaller?.caller_id === caller.caller_id && <ChevronRight className="h-5 w-5 text-teal-500" />}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Mode Toggle */}
                        <div className="mt-4 px-2">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Action Mode</label>
                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                            >
                                <option value="assign">Assign</option>
                                <option value="unassign">Unassign</option>
                            </select>
                        </div>
                    </div>

                    {/* Right Panel: Contacts Table */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4 flex flex-wrap justify-between items-center border-b gap-4">
                                <div className="flex items-center gap-4">
                                    <select
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        className="border border-slate-300 rounded-md p-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option value="unassigned">Show: Unassigned</option>
                                        <option value="assigned">Show: Assigned</option>
                                        <option value="all">Show: All Contacts</option>
                                    </select>
                                    <input
                                        type="search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search HR or company..."
                                        className="w-64 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleAssignContacts}
                                    disabled={selectedContactIds.length === 0}
                                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm flex items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed ${mode === 'assign' ? 'bg-teal-600' : 'bg-orange-600'
                                        }`}
                                >
                                    {mode === 'assign'
                                        ? `Assign (${selectedContactIds.length}) to ${selectedCaller?.full_name}`
                                        : `Unassign (${selectedContactIds.length})`}
                                </button>
                            </div>

                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                    <tr>
                                        <th scope="col" className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={isAllSelected}
                                                onChange={handleSelectAll}
                                                className="rounded"
                                            />
                                        </th>
                                        <th scope="col" className="px-6 py-3">HR Contact</th>
                                        <th scope="col" className="px-6 py-3">Company</th>
                                        <th scope="col" className="px-6 py-3">Assigned To</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredContacts.map(contact => {
                                        const assignee = callers.find(caller => caller.caller_id === contact.assigned_to_user_id);
                                        return (
                                            <tr key={contact.contact_id} className="bg-white border-b hover:bg-slate-50">
                                                <td className="p-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedContactIds.includes(contact.contact_id)}
                                                        onChange={() => handleSelectContact(contact.contact_id)}
                                                        className="rounded"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-900">{contact.full_name}</td>
                                                <td className="px-6 py-4">{contact.company_name || "N/A"}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    {assignee ? (
                                                        <span className="text-slate-900">{assignee.full_name}</span>
                                                    ) : (
                                                        <span className="font-semibold text-orange-600">Unassigned</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {filteredContacts.length === 0 && (
                                <div className="text-center py-12 text-slate-500">
                                    <p>No contacts found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactAssignmentPage;
