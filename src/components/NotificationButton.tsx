
import { Bell } from "lucide-react";

const NotificationButton = () => {
  return (
    <button className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
      <Bell className="w-5 h-5" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
    </button>
  );
};

export default NotificationButton;
