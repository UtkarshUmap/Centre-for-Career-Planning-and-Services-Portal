import UserActionsDropdown from './UserActionsDropdown';
import { formatDistanceToNow, isToday } from 'date-fns';

const formatLastActive = (ts) => {
    if (!ts) return "Never";
    const date = new Date(ts);
    return isToday(date)
        ? formatDistanceToNow(date, { addSuffix: true })
        : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

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

export default ApprovedUsersTable;
