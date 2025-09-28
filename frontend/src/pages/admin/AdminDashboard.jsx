import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Phone, ThumbsUp, Clock, UserPlus } from 'lucide-react';
import { fetchAdminDashboard } from '../../api/liaisoningAPIs/dashboard.js';
import Sidebar from '../../components/Sidebar.jsx';
import StatCard from '../../components/adminDashboard/StatCard.jsx';
import RecentActivityList from '../../components/adminDashboard/RecentActivityList.jsx';
import TopCallersList from '../../components/adminDashboard/TopCallersList.jsx';
import ActionItem from '../../components/adminDashboard/ActionItem.jsx';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboardPage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetchAdminDashboard();
                if (res.success) setData(res.data);
            } catch (err) {
                console.error("Error fetching dashboard:", err);
            }
        };
        loadData();
    }, []);

    if (!data) return <div className="p-8">Loading dashboard...</div>;

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
            <aside className="w-64 bg-white border-r">
                <Sidebar />
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-slate-500 mt-1">Overview of student activity and placement outreach.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    <StatCard title="Total Calls This Week" value={data.stats.totalCalls.toLocaleString()} icon={Phone} color="teal" />
                    <StatCard title="Positive Responses" value={data.stats.positiveResponses} icon={ThumbsUp} color="green" />
                    <StatCard title="Follow-ups Pending" value={data.stats.followUpsPending} icon={Clock} color="yellow" />
                    <StatCard title="New Contacts Added" value={data.stats.newContacts} icon={UserPlus} color="blue" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold text-slate-800">Weekly Call Activity</h3>
                            <div className="mt-4" style={{ height: '300px' }}>
                                <Bar options={chartOptions} data={chartData} />
                            </div>
                        </div>
                        <RecentActivityList activities={data.recentActivity} />
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <TopCallersList callers={data.topCallers} />
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
