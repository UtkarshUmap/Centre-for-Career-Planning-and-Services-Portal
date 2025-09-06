const HRListItem = ({ hr, onAddLog }) => {
    return (
        
        <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
           
            <div>
                <p className="font-semibold text-gray-900">{hr.full_name}</p>
                <p className="text-sm text-gray-500">
                    {hr.designation ? hr.designation : "N/A"}
                </p>
            </div>

            <button
                onClick={() => onAddLog(hr)}
                className="bg-teal-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
                Add Log
            </button>
        </div>
    );
};

export default HRListItem;