
import { useState } from "react";
import { Menu, X, Settings, User, Bell, Box } from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";
import NotificationButton from "./NotificationButton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-gray-500 rounded flex items-center justify-center">
                <Box className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">PowerPrint</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-300 hover:text-white transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">
              Models
            </a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">
              Marketplace
            </a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">
              Documentation
            </a>
          </nav>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            <NotificationButton />
            <UserProfileDropdown />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <nav className="flex flex-col space-y-2">
              <a href="#" className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                Dashboard
              </a>
              <a href="#" className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                Models
              </a>
              <a href="#" className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                Marketplace
              </a>
              <a href="#" className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                Documentation
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
