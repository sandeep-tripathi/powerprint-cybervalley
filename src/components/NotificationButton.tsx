
import { Bell } from "lucide-react";

const NotificationButton = () => {
  return (
    <button className="relative p-2 text-slate-400 hover:text-purple-400 transition-colors">
      <Bell className="w-5 h-5" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></span>
    </button>
  );
};

export default NotificationButton;
