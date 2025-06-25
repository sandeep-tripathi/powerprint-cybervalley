
import { Image, Layers, History, Zap } from "lucide-react";

interface WorkflowSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const WorkflowSidebar = ({ activeTab, setActiveTab }: WorkflowSidebarProps) => {
  const tabs = [
    { id: "generate", label: "Generate", icon: Zap },
    { id: "marketplace", label: "Marketplace", icon: Layers },
    { id: "history", label: "History", icon: History },
  ];

  return (
    <aside className="fixed left-0 top-20 h-full w-64 bg-black/20 backdrop-blur-lg border-r border-white/10 p-6">
      <div className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg border border-white/10">
        <h3 className="text-white font-semibold mb-2">Quick Tips</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Upload high-quality images for better results</li>
          <li>• Choose the right AI model for your use case</li>
          <li>• Higher compute instances generate faster</li>
        </ul>
      </div>
    </aside>
  );
};

export default WorkflowSidebar;
