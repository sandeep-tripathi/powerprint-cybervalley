
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="relative hidden md:block">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
      <input 
        type="text" 
        placeholder="Search models..."
        className="bg-slate-800/80 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-slate-800 w-64"
      />
    </div>
  );
};

export default SearchBar;
