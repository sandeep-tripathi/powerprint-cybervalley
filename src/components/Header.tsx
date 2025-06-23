
import UserProfileDropdown from "@/components/UserProfileDropdown";
import Navigation from "@/components/Navigation";
import SearchBar from "@/components/SearchBar";
import NotificationButton from "@/components/NotificationButton";

const Header = () => {
  return (
    <header className="bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/ed6b11f1-8d40-4c15-8421-e00e55a0f5c7.png" 
                alt="PowerPrint Logo" 
                className="h-12 w-auto"
              />
            </div>
            
            <Navigation />
          </div>

          <div className="flex items-center space-x-4">
            <SearchBar />
            <NotificationButton />
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
