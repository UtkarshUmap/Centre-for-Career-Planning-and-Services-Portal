import React from 'react';

const RecentActivityList = ({ activities }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
        <ul className="divide-y divide-slate-200">
            {activities.map(activity => (
                <li key={activity.id} className="py-3 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 mr-4">
                        {activity.initials}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-slate-700">
                            <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                            <span className="font-semibold">{activity.subject}</span>{' '}
                            {activity.company && <>from <span className="font-semibold">{activity.company}</span></>}
                        </p>
                        {activity.outcome && <p className="text-xs text-slate-500">Outcome: {activity.outcome}</p>}
                    </div>
                    <span className="text-xs text-slate-400">
                        {new Date(activity.call_timestamp).toLocaleString()}
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

export default RecentActivityList;
