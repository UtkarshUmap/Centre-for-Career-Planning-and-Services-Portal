import { useState, useEffect, useRef } from 'react';
import { MoreVertical, Eye, Edit } from 'lucide-react';

const ContactActionsDropdown = ({ contact, currentUser, setSelectedContact }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isAssignedToCurrentUser = contact.assigned_to_user_id === currentUser;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShowDetails = () => {
    console.log("Showing details for:", contact.full_name);
    console.log("Contact:", contact);
    setSelectedContact(contact);
    setIsOpen(false);
  };

  const handleEdit = () => {
    console.log("Editing contact:", contact.full_name);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <MoreVertical size={20} />
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 w-48 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={handleShowDetails}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Eye size={16} /> Show Details
            </button>
            {isAssignedToCurrentUser && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit size={16} /> Edit Contact
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactActionsDropdown;
