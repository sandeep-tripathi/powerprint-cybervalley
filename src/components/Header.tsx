
import { useState } from "react";
import { Search, Bell, User, Settings, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SlicedCubeLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" className="w-10 h-10">
    {/* Top face of cube */}
    <path 
      d="M20 5 L35 12 L20 19 L5 12 Z" 
      fill="url(#gradient1)" 
      stroke="rgba(255,255,255,0.3)" 
      strokeWidth="0.5"
    />
    {/* Left face */}
    <path 
      d="M5 12 L5 28 L20 35 L20 19 Z" 
      fill="url(#gradient2)" 
      stroke="rgba(255,255,255,0.3)" 
      strokeWidth="0.5"
    />
    {/* Right face */}
    <path 
      d="M20 19 L20 35 L35 28 L35 12 Z" 
      fill="url(#gradient3)" 
      stroke="rgba(255,255,255,0.3)" 
      strokeWidth="0.5"
    />
    {/* Slice lines */}
    <line x1="20" y1="5" x2="20" y2="35" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
    <line x1="12.5" y1="8.5" x2="12.5" y2="31.5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
    <line x1="27.5" y1="8.5" x2="27.5" y2="31.5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
    
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
  </svg>
);

const Header = () => {
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
    <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <SlicedCubeLogo />
              <h1 className="text-2xl font-bold text-white">PowerPrint</h1>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-white hover:text-purple-400 transition-colors">Workspace</a>
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Gallery</a>
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Community</a>
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Pricing</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search models..."
                className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 w-64"
              />
            </div>
            
            <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-white hidden md:block">John Doe</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-black/80 backdrop-blur-lg border border-white/20 rounded-lg py-2">
                  <button 
                    onClick={generateApiKey}
                    className="flex items-center space-x-2 px-4 py-2 text-purple-400 hover:text-purple-300 hover:bg-white/10 w-full text-left"
                  >
                    <Key className="w-4 h-4" />
                    <span>Generate API Key</span>
                  </button>
                  <hr className="my-2 border-white/20" />
                  <a href="#" className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </a>
                  <hr className="my-2 border-white/20" />
                  <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10">
                    Sign Out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
