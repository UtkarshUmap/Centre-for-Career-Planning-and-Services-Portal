import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Phone, ThumbsUp, Clock, UserPlus, ClipboardList } from 'lucide-react';
import { fetchAdminDashboard } from '../../api/liaisoningAPIs/dashboard.js';
import { Link } from "react-router-dom";
import Sidebar from '../../components/Sidebar.jsx';


// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Reusable Components ---

const StatCard = ({ title, value, icon: Icon, color }) => {
    const colors = {
        teal: 'bg-teal-100 text-teal-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        blue: 'bg-blue-100 text-blue-600',
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-3xl font-bold text-slate-800">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${colors[color]}`}>
                <Icon className="h-6 w-6" />
            </div>
        </div>
    );
};

const ActionItem = ({ item }) => {
    const colors = {
        yellow: 'bg-yellow-50 text-yellow-800 border-yellow-200',
        red: 'bg-red-50 text-red-800 border-red-200',
        blue: 'bg-blue-50 text-blue-800 border-blue-200',
    };
    const iconColors = {
        yellow: 'text-yellow-500',
        red: 'text-red-500',
        blue: 'text-blue-500',
    };
    const iconsMap = { UserPlus, ClipboardList, Clock };
    const Icon = iconsMap[item.icon] || Clock;

    return (
        <li className={`flex items-center p-3 rounded-md border ${colors[item.color]}`}>
            <Icon className={`h-5 w-5 mr-3 ${iconColors[item.color]}`} />
            <p className="text-sm flex-1">
                <span className="font-semibold">{item.count}</span> {item.text}
            </p>
            {item.id === 1 && (
                <Link to="/admin/user-management" className="text-sm font-semibold text-teal-600 hover:underline">View</Link>
            )}
        </li>
    );
};

// --- Main Dashboard Component ---
const AdminDashboardPage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetchAdminDashboard();
                if (res.success) {
                    setData(res.data);
                    console.log("Admin Dashboard Data:", res.data);
                }
            } catch (err) {
                console.error("Error fetching dashboard:", err);
            }
        };
        loadData();
    }, []);

    if (!data) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    // Chart Data from backend
    const chartData = {
        labels: data.weeklyCallActivity.labels,
        datasets: [
            { label: 'Positive', data: data.weeklyCallActivity.positive.map(Number), backgroundColor: '#34D399' },
            { label: 'Follow-up', data: data.weeklyCallActivity.followUp.map(Number), backgroundColor: '#60A5FA' },
            { label: 'Not Reachable', data: data.weeklyCallActivity.notReachable.map(Number), backgroundColor: '#FBBF24' },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: { x: { stacked: true }, y: { stacked: true } },
        plugins: { legend: { position: 'top' } },
    };

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r">
                <Sidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-slate-500 mt-1">Overview of student activity and placement outreach.</p>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    <StatCard title="Total Calls This Week" value={data.stats.totalCalls.toLocaleString()} icon={Phone} color="teal" />
                    <StatCard title="Positive Responses" value={data.stats.positiveResponses} icon={ThumbsUp} color="green" />
                    <StatCard title="Follow-ups Pending" value={data.stats.followUpsPending} icon={Clock} color="yellow" />
                    <StatCard title="New Contacts Added" value={data.stats.newContacts} icon={UserPlus} color="blue" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Weekly Call Activity */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold text-slate-800">Weekly Call Activity</h3>
                            <div className="mt-4" style={{ height: '300px' }}>
                                <Bar options={chartOptions} data={chartData} />
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
                            <ul className="divide-y divide-slate-200">
                                {data.recentActivity.map(activity => (
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
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        {/* Top Callers */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Top Callers (This Week)</h3>
                            <ul className="space-y-4">
                                {data.topCallers.map((caller, index) => (
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

                        {/* Action Items */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Action Items</h3>
                            <ul className="space-y-3">
                                {data.actionItems.map(item => (
                                    <ActionItem key={item.id} item={item} />
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardPage;
``