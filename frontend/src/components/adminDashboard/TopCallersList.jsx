import React from 'react';

const TopCallersList = ({ callers }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Top Callers (This Week)</h3>
        <ul className="space-y-4">
            {callers.map((caller, index) => (
                <li key={caller.id} className="flex items-center">
                    <span className="font-bold text-slate-700 text-lg">{index + 1}.</span>
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 mx-3">
                        {caller.initials}
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-slate-800">{caller.name}</p>
                        <p className="text-xs text-slate-500">{caller.calls} Calls</p>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

export default TopCallersList;
