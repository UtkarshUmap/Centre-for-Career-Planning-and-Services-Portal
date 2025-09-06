import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { getAllHRContacts } from '../../api/liaisoningAPIs/hrContacts.js';
import HeaderSection from '../../components/callerHRContacts/HeaderSection.jsx';
import FiltersBar from '../../components/callerHRContacts/FiltersBar.jsx';
import ContactsTable from '../../components/callerHRContacts/ContactTable.jsx';
import Sidebar from '../../components/Sidebar.jsx';

const HRContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState('all');
  const { authUser } = useAuthContext();
  const CURRENT_USER_ID = authUser?._id;

  const [showAddHRContactModal, setShowAddHRContactModal] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await getAllHRContacts();
        setContacts(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    let result = contacts;
    if (searchTerm) {
      result = result.filter(contact =>
        (contact.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (contact.company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (contact.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }
    switch (assignmentFilter) {
      case 'me':
        result = result.filter(c => c.assigned_to_user_id === CURRENT_USER_ID);
        break;
      case 'assigned':
        result = result.filter(c => c.assigned_to_user_id);
        break;
      case 'unassigned':
        result = result.filter(c => !c.assigned_to_user_id);
        break;
      default:
        break;
    }
    setFilteredContacts(result);
  }, [searchTerm, assignmentFilter, contacts, CURRENT_USER_ID]);

  return (
    <div className="flex min-h-screen bg-gray-50">

    <Sidebar />


    <div className="flex-1 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <HeaderSection setShowAddHRContactModal={setShowAddHRContactModal} />
        <FiltersBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          assignmentFilter={assignmentFilter}
          setAssignmentFilter={setAssignmentFilter}
        />
        <ContactsTable contacts={filteredContacts} currentUser={CURRENT_USER_ID} />
      </div>
    </div>
  </div>
);

};

export default HRContactsPage;
