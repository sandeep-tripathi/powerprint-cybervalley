
import { useState } from "react";
import { User, Settings, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserProfileDropdown = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { toast } = useToast();

  const generateApiKey = () => {
    // Generate a random API key
    const prefix = "pp_"; // PowerPrint prefix
    const randomString = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);
    const apiKey = prefix + randomString;
    
    // Copy to clipboard
    navigator.clipboard.writeText(apiKey).then(() => {
      toast({
        title: "API Key Generated!",
        description: `New PowerPrint API key copied to clipboard: ${apiKey.substring(0, 20)}...`,
      });
    }).catch(() => {
      toast({
        title: "API Key Generated",
        description: `Your new PowerPrint API key: ${apiKey}`,
      });
    });
    
    setIsProfileOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="text-slate-900 hidden md:block font-medium">John Doe</span>
      </button>
      
      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-lg border border-blue-200 rounded-lg py-2 shadow-lg">
          <button 
            onClick={generateApiKey}
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 w-full text-left"
          >
            <Key className="w-4 h-4" />
            <span>Generate API Key</span>
          </button>
          <hr className="my-2 border-blue-200" />
          <a href="#" className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </a>
          <a href="#" className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </a>
          <hr className="my-2 border-blue-200" />
          <a href="#" className="block px-4 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50">
            Sign Out
          </a>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
