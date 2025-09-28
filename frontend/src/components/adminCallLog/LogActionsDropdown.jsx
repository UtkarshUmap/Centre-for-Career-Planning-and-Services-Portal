import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { deleteCallLog, updateCallLog } from "../../api/liaisoningAPIs/callLogs";

const LogActionsDropdown = ({ logId, fetchLogs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState("");
  const dropdownRef = useRef(null);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;
    await deleteCallLog(logId);
    alert("Deleted The Log");
    fetchLogs();
  };

  const handleSaveComment = async () => {
    if (!comment.trim()) {
      alert("Please enter a comment before saving.");
      return;
    }
    try {
      await updateCallLog(logId, { admin_comments: comment });
      alert("Comment added successfully!");
      setShowCommentModal(false);
      setComment("");
      fetchLogs();
    } catch (error) {
      console.error("Error saving comment:", error);
      alert("Failed to save comment");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-500 hover:text-slate-800 rounded-full"
      >
        <MoreVertical size={20} />
      </button>

      {isOpen && (
        <div className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
          <button
            onClick={() => setShowCommentModal(true)}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Add Comment
          </button>
          <button
            onClick={handleDelete}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Delete Log
          </button>
        </div>
      )}

      {showCommentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-20">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Add Admin Comment</h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              className="w-full border border-slate-300 rounded-md p-2 mb-4"
              placeholder="Write your comment..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCommentModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveComment}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogActionsDropdown;
