
import { useState } from "react";
import { Search, Bell, User, Settings, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

// Mini Hand Mesh for Logo
const MiniHandMesh = () => {
  return (
    <group scale={[0.15, 0.15, 0.15]} rotation={[0.2, 0.3, 0]}>
      {/* Palm */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.3, 2.5]} />
        <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Thumb */}
      <group position={[-0.8, 0, 0.8]} rotation={[0, 0, 0.3]}>
        <mesh position={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.15, 0.18, 0.8]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.9]}>
          <cylinderGeometry args={[0.12, 0.15, 0.6]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
      
      {/* Index Finger */}
      <group position={[-0.4, 0, 1.5]}>
        <mesh position={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.12, 0.15, 1]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 1.1]}>
          <cylinderGeometry args={[0.1, 0.12, 0.6]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 1.5]}>
          <cylinderGeometry args={[0.08, 0.1, 0.4]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
      
      {/* Middle Finger */}
      <group position={[0, 0, 1.6]}>
        <mesh position={[0, 0, 0.6]}>
          <cylinderGeometry args={[0.12, 0.15, 1.2]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 1.3]}>
          <cylinderGeometry args={[0.1, 0.12, 0.7]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 1.8]}>
          <cylinderGeometry args={[0.08, 0.1, 0.5]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
      
      {/* Ring Finger */}
      <group position={[0.4, 0, 1.5]}>
        <mesh position={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.11, 0.14, 1]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 1.1]}>
          <cylinderGeometry args={[0.09, 0.11, 0.6]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 1.5]}>
          <cylinderGeometry args={[0.07, 0.09, 0.4]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
      
      {/* Pinky Finger */}
      <group position={[0.7, 0, 1.2]} rotation={[0, 0, -0.1]}>
        <mesh position={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.1, 0.12, 0.8]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.9]}>
          <cylinderGeometry args={[0.08, 0.1, 0.5]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 1.2]}>
          <cylinderGeometry args={[0.06, 0.08, 0.3]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
    </group>
  );
};

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
    <header className="bg-white/90 backdrop-blur-lg border-b border-blue-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 p-1">
                <Canvas camera={{ position: [4, 2, 6], fov: 50 }}>
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <MiniHandMesh />
                </Canvas>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">PowerPrint</h1>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-slate-900 hover:text-blue-600 transition-colors font-medium">Workspace</a>
              <a href="#" className="text-slate-700 hover:text-blue-600 transition-colors">Gallery</a>
              <a href="#" className="text-slate-700 hover:text-blue-600 transition-colors">Community</a>
              <a href="#" className="text-slate-700 hover:text-blue-600 transition-colors">Pricing</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search models..."
                className="bg-white/80 border border-blue-200 rounded-lg pl-10 pr-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white w-64"
              />
            </div>
            
            <button className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
