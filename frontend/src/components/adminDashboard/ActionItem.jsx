import { Link } from "react-router-dom";
import { UserPlus, ClipboardList, Clock } from 'lucide-react';

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

export default ActionItem;
