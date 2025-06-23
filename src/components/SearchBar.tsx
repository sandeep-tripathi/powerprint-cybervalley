
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="relative hidden md:block">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
      <input 
        type="text" 
        placeholder="Search models..."
        className="bg-white/80 border border-blue-200 rounded-lg pl-10 pr-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white w-64"
      />
    </div>
  );
};

export default SearchBar;
