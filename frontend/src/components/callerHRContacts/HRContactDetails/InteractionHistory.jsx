import OutcomeBadge from './common/OutcomeBadge';
import { PlusCircle , MessageSquareQuote } from 'lucide-react';
import { useAuthContext } from '../../../context/AuthContext';

const InteractionHistory = ({ selectedContact, interactions, onAddLog }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const { authUser } = useAuthContext();
  const CURRENT_USER_ID = authUser?._id;


  return (
    <div className="lg:col-span-2 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">Interaction History</h3>
        {selectedContact.assigned_to_user_id === CURRENT_USER_ID && (
          <button
          onClick={onAddLog}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
        >
          <PlusCircle size={16} /> Log New Call for {selectedContact.full_name}
        </button>
        )}
      </div>

      <div className="space-y-6">
        {interactions.length > 0 ? (
          interactions.map((log) => (
            <div key={log.id} className="relative pl-8">
              <div className="absolute left-0 top-1.5 h-full border-l-2 border-slate-200"></div>
              <div className="absolute left-[-5px] top-1.5 w-3 h-3 bg-white border-2 border-teal-500 rounded-full"></div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Call by <span className="text-teal-600">{log.caller}</span>
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(log.date)}</p>
                </div>
                <OutcomeBadge outcome={log.outcome} />
              </div>

              <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-md border">{log.summary}</p>
              {log.followUpOn && (
                <p className="mt-2 text-xs text-slate-500 font-medium">
                  Next Follow-up: <span className="font-bold">{formatDate(log.followUpOn)}</span>
                </p>
              )}


              {/* --- NEW: Admin Comment Section --- */}
                            {log.admin_comments && (
                                <div className="mt-3 p-3 bg-teal-50 border-l-4 border-teal-400 rounded-r-md">
                                    <div className="flex items-center gap-2">
                                        <MessageSquareQuote className="h-4 w-4 text-teal-600" />
                                        <h4 className="font-semibold text-sm text-slate-800">
                                            Admin Comment
                                            {log.admin_name && <span className="text-slate-500 font-medium"> ({log.admin_name})</span>}
                                        </h4>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-600 italic pl-6">
                                        {`"${log.admin_comments}"`}
                                    </p>
                                </div>
                            )}


            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 py-10">No interactions have been logged yet.</p>
        )}
      </div>
    </div>
  );
};

export default InteractionHistory;
