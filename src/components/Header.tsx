
import { Canvas } from "@react-three/fiber";
import MiniHandMesh from "@/components/MiniHandMesh";
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
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-violet-700 p-1">
                <Canvas camera={{ position: [4, 2, 6], fov: 50 }}>
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <MiniHandMesh />
                </Canvas>
              </div>
              <h1 className="text-2xl font-bold text-white">PowerPrint</h1>
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
