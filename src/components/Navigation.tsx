
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Welcome", path: "/welcome" },
    { name: "Generate", path: "/" },
  ];

  return (
    <nav className="flex space-x-8">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`text-sm font-medium transition-colors hover:text-purple-400 ${
            location.pathname === item.path
              ? "text-purple-400"
              : "text-slate-300"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
