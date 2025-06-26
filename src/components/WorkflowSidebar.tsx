
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Upload, 
  Store, 
  CreditCard, 
  History, 
  Cloud,
  Code,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface WorkflowSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const WorkflowSidebar = ({ activeTab, setActiveTab }: WorkflowSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: "generate", label: "Generate", icon: Upload },
    { id: "marketplace", label: "Marketplace", icon: Store },
    { id: "pricing", label: "Pricing", icon: CreditCard },
    { id: "history", label: "History", icon: History },
    { id: "api", label: "REST API", icon: Code },
  ];

  return (
    <div className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-slate-800 border-r border-slate-700 transition-all duration-300 z-40",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Collapse Toggle */}
      <div className="absolute -right-3 top-6 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-6 w-6 rounded-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

      <div className="p-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full justify-start text-white hover:bg-slate-700 transition-all duration-200",
                activeTab === tab.id && "bg-purple-600 hover:bg-purple-700",
                isCollapsed ? "px-2" : "px-4"
              )}
            >
              <Icon className={cn("h-4 w-4", isCollapsed ? "" : "mr-2")} />
              {!isCollapsed && <span>{tab.label}</span>}
            </Button>
          );
        })}
      </div>

      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-slate-700 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Cloud className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 font-medium text-sm">PowerPrint Pipeline</span>
            </div>
            <p className="text-slate-300 text-xs">
              Advanced AI-powered image to 3D model conversion with REST API access
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowSidebar;
