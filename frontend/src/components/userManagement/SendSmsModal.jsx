import { useState } from 'react';
import {  MessageSquare } from 'lucide-react';
import { sendAdminSMS } from '../../api/liaisoningAPIs/users';



const SendSmsModal = ({ user, onClose  }) => {
    const [message, setMessage] = useState('');
    const charLimit = 160; // Standard SMS character limit

    const handleSend = async () => {
        if (!message.trim()) {
            alert("Message cannot be empty.");
            return;
        }
        if (message.length > charLimit) {
            alert(`Message exceeds the ${charLimit} character limit.`);
            return;
        }

        await sendAdminSMS(user.user_id, message);

        // In a real app, you would pass the user's ID or phone number
        // onSend({ userId: user.id, message });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col">
                <div className="p-5 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Send Message to {user.full_name}</h2>
                        <p className="text-sm text-slate-500">The message will be sent as an SMS.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                        <svg className="h-6 w-6 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="p-6">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                        maxLength={charLimit}
                        className="w-full border border-slate-300 rounded-md p-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Type your message here..."
                    ></textarea>
                    <div className="text-right text-sm text-slate-500 mt-1">
                        {message.length} / {charLimit} characters
                    </div>
                </div>

                <div className="p-5 border-t bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSend} className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700 flex items-center gap-2">
                        <MessageSquare size={16} /> Send Message
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendSmsModal;