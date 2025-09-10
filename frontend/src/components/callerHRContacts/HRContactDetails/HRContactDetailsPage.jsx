import { useState, useEffect } from 'react';
import { getAllCallLogs } from '../../../api/liaisoningAPIs/callLogs';
import LogCallForm from '../../callerDashboard/LogForm'

import ContactDetails from './ContactDetails';
import InteractionHistory from './InteractionHistory';
import ModalOverlay from './ModalOverlay';

const HRContactDetailsPage = ({ selectedContact, onClose }) => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddLogFromDetails, setShowAddLogFromDetails] = useState(false);

  const fetchData = async () => {
    try {
      if (!selectedContact) return;
      const callLogsRes = await getAllCallLogs();
      const filteredLogs = callLogsRes.data.filter(
        (log) => log.contact_id === selectedContact.contact_id
      );

      setInteractions(
        filteredLogs.map((log) => ({
          id: log.log_id,
          date: log.call_timestamp,
          caller: log.caller_name,
          outcome: log.call_outcome.replace('_', ' '),
          summary: log.conversation_summary,
          followUpOn: log.next_follow_up_date,
          admin_comments: log.admin_comments
        }))
      );
    } catch (error) {
      console.error('Error fetching HR contact details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [selectedContact]);

  const addedLog = () => fetchData();

  if (loading) return <ModalOverlay type="loading" />;
  if (!selectedContact) return <ModalOverlay type="error" onClose={onClose} />;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">HR Contact Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100"
          >
            <svg
              className="h-6 w-6 text-slate-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3">
          <ContactDetails selectedContact={selectedContact} />
          <InteractionHistory
            selectedContact={selectedContact}
            interactions={interactions}
            onAddLog={() => setShowAddLogFromDetails(true)}
          />
        </div>
      </div>

      {showAddLogFromDetails && (
        <LogCallForm
          hr={selectedContact}
          setLogForm={setShowAddLogFromDetails}
          onSubmit={addedLog}
        />
      )}
    </div>
  );
};

export default HRContactDetailsPage;
