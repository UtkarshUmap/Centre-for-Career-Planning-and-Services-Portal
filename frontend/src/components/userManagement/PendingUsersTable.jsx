import { CheckCircle, XCircle } from 'lucide-react';
import { approveUser } from '../../api/liaisoningAPIs/users';

const PendingUsersTable = ({ users, fetchData }) => {

    const handleApproval = async (userId, isApproved) => {
        if (isApproved) {
            await approveUser(userId);
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

export default PendingUsersTable;
