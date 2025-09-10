import { useState, useEffect, useRef } from 'react';
import { UserPlus, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import { getAllUsers } from '../../api/liaisoningAPIs/users';
import { getAllCallersStats } from '../../api/liaisoningAPIs/callersStats';
import { approveUser, revokeUser } from '../../api/liaisoningAPIs/users';
import { formatDistanceToNow, isToday } from 'date-fns';
import Sidebar from '../../components/Sidebar';
import PreapprovedEmailsModal from '../../components/userManagement/PreapprovedEmails.jsx';
import SendSmsModal from '../../components/userManagement/SendSmsModal.jsx';


const formatLastActive = (ts) => {
    if (!ts) return "Never";
    const date = new Date(ts);
    return isToday(date)
        ? formatDistanceToNow(date, { addSuffix: true }) // "3 hours ago"
        : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};


// Action Dropdown for Approved Users
const UserActionsDropdown = ({ user, fetchData, setSelectedContactToSms }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRevoke = async (userId) => {
        await revokeUser(userId);
        fetchData();

    }





    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-500 hover:text-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500">
                <MoreVertical size={20} />
            </button>
            {isOpen && (
                <div className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <a onClick={() => setSelectedContactToSms(user)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Send Message</a>
                    <a onClick={() => handleRevoke(user.user_id)} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Revoke Access</a>
                </div>
            )}
        </div>
    );
};




// Table for Approved Users
const ApprovedUsersTable = ({ users, fetchData, setSelectedContactToSms }) => (


    <div className="mt-4 bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Role</th>
                    <th scope="col" className="px-6 py-3 text-center">Contacts Assigned</th>
                    <th scope="col" className="px-6 py-3">Last Active</th>
                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.user_id} className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 mr-3">{user.initials}</div>
                                <div>
                                    <p>{user.full_name}</p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">{user.role}</td>
                        <td className="px-6 py-4 font-medium text-center">{user.contactsAssigned}</td>
                        <td className="px-6 py-4">{formatLastActive(user.last_active_at)}</td>
                        <td className="px-6 py-4 text-right">
                            <UserActionsDropdown user={user} fetchData={fetchData} setSelectedContactToSms={setSelectedContactToSms} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// Table for Pending Users
const PendingUsersTable = ({ users, fetchData }) => {
    const handleApproval = async (userId, isApproved) => {

        if (isApproved === true) {
            await approveUser(userId);
            console.log(`User ${userId} approved`);
            fetchData();

        }

        alert(`User ${userId} has been ${isApproved ? 'approved' : 'denied'}.`);
    };

    return (
        <div className="mt-4 bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Requested Role</th>
                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.user_id} className="bg-white border-b hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 mr-3">{user.initials}</div>
                                    <div>
                                        <p>{user.full_name}</p>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => handleApproval(user.user_id, false)} className="p-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center gap-1.5">
                                        <XCircle size={16} /> Deny
                                    </button>
                                    <button onClick={() => handleApproval(user.user_id, true)} className="p-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 flex items-center gap-1.5">
                                        <CheckCircle size={16} /> Approve
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


// --- Main Page Component ---
const UserManagementPage = () => {
    const [activeTab, setActiveTab] = useState('approved');
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [showPreapprovedModal, setShowPreapprovedModal] = useState(false);
    const [selectedContactToSms, setSelectedContactToSms] = useState(null);


    const fetchData = async () => {
        try {
            const [usersResponse, statsResponse] = await Promise.all([
                getAllUsers(),
                getAllCallersStats(),
            ]);

            const users = usersResponse.data;
            const stats = statsResponse.data;

            // Create a map for quick lookup
            const statsMap = {};
            stats.forEach(stat => {
                statsMap[stat.caller_id] = stat.total_contacts_assigned;
            });

            // Merge stats into users
            const usersWithStats = users.map(user => ({
                ...user,
                contactsAssigned: statsMap[user.user_id] || 0, // default 0 if no stats found
            }));

            setApprovedUsers(usersWithStats.filter(user => user.is_approved));
            setPendingUsers(users.filter(user => !user.is_approved));

        } catch (error) {
            console.error("Error fetching users or stats:", error);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);



    const TabButton = ({ name, label, count, onClick }) => {
        const isActive = activeTab === name;
        return (
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); onClick(name); }}
                className={`shrink-0 border-b-2 py-3 px-1 text-sm font-semibold ${isActive ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
            >
                {label}
                {count > 0 && (
                    <span className={`ml-2 inline-block py-0.5 px-2 rounded-full text-xs font-bold ${isActive ? 'bg-teal-100 text-teal-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {count}
                    </span>
                )}
            </a>
        );
    };

    return (
        <div className="bg-slate-100 min-h-screen flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
                        <p className="text-slate-500 mt-1">
                            Add, manage, and revoke user access to the portal.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700 flex items-center gap-2"
                            onClick={() => setShowPreapprovedModal(true)}
                        >
                            <UserPlus size={18} /> Add Callers
                        </button>
                    </div>
                </div>

                <div className="mt-6 border-b border-slate-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <TabButton
                            name="approved"
                            label="Approved Users"
                            count={null}
                            onClick={setActiveTab}
                        />
                        <TabButton
                            name="pending"
                            label="Pending Approval"
                            count={pendingUsers.length}
                            onClick={setActiveTab}
                        />
                    </nav>
                </div>

                {/* Conditionally render the correct table based on the active tab */}
                {activeTab === "approved" && (
                    <ApprovedUsersTable users={approvedUsers} fetchData={fetchData} setSelectedContactToSms={setSelectedContactToSms} />
                )}
                {activeTab === "pending" && (
                    <PendingUsersTable users={pendingUsers} fetchData={fetchData} />
                )}
            </div>

            {showPreapprovedModal && (
                <PreapprovedEmailsModal onClose={() => setShowPreapprovedModal(false)} />
            )}

            {selectedContactToSms && (
                <SendSmsModal user={selectedContactToSms} onClose={() => setSelectedContactToSms(false)} />
            )}
        </div>
    );

};

export default UserManagementPage;
