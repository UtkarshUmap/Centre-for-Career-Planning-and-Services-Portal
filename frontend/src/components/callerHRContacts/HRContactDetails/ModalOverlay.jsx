const ModalOverlay = ({ type, message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-2xl p-6 text-center">
      {type === 'loading' && <p>Loading...</p>}
      {type === 'error' && (
        <>
          <p>{message || 'Contact not found.'}</p>
          {onClose && (
            <button onClick={onClose} className="ml-4 text-blue-600 underline">
              Close
            </button>
          )}
        </>
      )}
      {type === 'custom' && <>{message}</>}
    </div>
  </div>
);

export default ModalOverlay;
