const HeaderSection = ({ setShowAddHRContactModal }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">HR Contacts</h1>
        <p className="mt-1 text-sm text-gray-600">
          Browse and search all contacts in the central database.
        </p>
      </div>
      <button className="mt-4 sm:mt-0 bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-600 transition"
        onClick={() => setShowAddHRContactModal(true)}
      >
        Add New Contact
      </button>
    </div>
  );
};

export default HeaderSection;
