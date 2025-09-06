import { useState, useEffect } from "react";
import { getAllHRContacts } from "../../api/liaisoningAPIs/hrContacts.js"
import HRListItem from "./HRListItem.jsx";
import { useAuthContext } from "../../context/AuthContext";


const AddLogOptions = ({setShowHROptionForLogForm, setShowLogForm, setSelectedHR}) => {
    const [search, setSearch] = useState("");
    const [contacts, setContacts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    

    const { authUser } = useAuthContext();
    const userId = authUser?._id;


    useEffect(() => {
        const loadContacts = async () => {
            const res = await getAllHRContacts();
            setContacts(res.data);
            setFiltered(res.data);
        };
        loadContacts();
    }, []);


    useEffect(() => {
    setFiltered(
      contacts.filter(
        (c) =>
          // ✅ only include HRs assigned to the logged-in user
          c.assigned_to_user_id === userId &&
          (
            c.full_name.toLowerCase().includes(search.toLowerCase()) ||
            (c.designation &&
              c.designation.toLowerCase().includes(search.toLowerCase())) ||
            (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
          )
      )
    );
  }, [search, contacts, userId]);


    const handleAddLog = (hr) => {
        console.log("Adding log for:", hr);
        setSelectedHR(hr);
        setShowHROptionForLogForm(false);
        setShowLogForm(true);
        // here you can redirect to a new form page or open another modal
    };

        return (

        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
           
            <div className="bg-white w-[32rem] rounded-lg shadow-xl p-6">
                
                <div className="flex justify-between items-center mb-4">
                    
                    <h2 className="text-xl font-bold text-gray-800">Log a New Call</h2>
                    <button
                        onClick={() => setShowHROptionForLogForm(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                    Step 1: Select the HR contact you communicated with.
                </p>

               
                <input
                    type="text"
                    placeholder="Search by HR name or company..."
                    className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                
                <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                    {Array.isArray(filtered) && filtered.length > 0 ? (
                        filtered.map((hr) => (
                            <HRListItem
                                key={hr.contact_id}
                                hr={hr}
                                onAddLog={handleAddLog}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">
                            No HR contacts found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddLogOptions;
