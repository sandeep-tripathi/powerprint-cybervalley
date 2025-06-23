
import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Sphere } from "@react-three/drei";
import { RotateCcw, ZoomIn, ZoomOut, Download, Share2, Maximize2 } from "lucide-react";
import * as THREE from "three";

// Simple hand-like CAD model component
const HandCADModel = () => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Palm */}
      <Box args={[1, 0.3, 1.5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#fdbcb4" />
      </Box>
      
      {/* Thumb */}
      <group position={[-0.7, 0, 0.3]}>
        <Box args={[0.2, 0.2, 0.8]} position={[0, 0, 0.4]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>
        <Box args={[0.15, 0.15, 0.6]} position={[0, 0, 0.9]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>
      </group>
      
      {/* Index finger */}
      <group position={[-0.3, 0, 0.8]}>
        <Box args={[0.15, 0.15, 0.7]} position={[0, 0, 0.35]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>
        <Box args={[0.12, 0.12, 0.5]} position={[0, 0, 0.75]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>
      </group>
      
      {/* Middle finger */}
      <group position={[0, 0, 0.85]}>
        <Box args={[0.15, 0.15, 0.8]} position={[0, 0, 0.4]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>
        <Box args={[0.12, 0.12, 0.6]} position={[0, 0, 0.85]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>
      </group>
      
      {/* Ring finger */}
      <group position={[0.3, 0, 0.8]}>
        <Box args={[0.15, 0.15, 0.7]} position={[0, 0, 0.35]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>
        <Box args={[0.12, 0.12, 0.5]} position={[0, 0, 0.75]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>
      </group>
      
      {/* Pinky finger */}
      <group position={[0.5, 0, 0.6]}>
        <Box args={[0.12, 0.12, 0.6]} position={[0, 0, 0.3]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>
        <Box args={[0.1, 0.1, 0.4]} position={[0, 0, 0.65]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>
      </group>
      
      {/* Wrist */}
      <Box args={[0.8, 0.25, 0.8]} position={[0, 0, -0.9]}>
        <meshStandardMaterial color="#fdbcb4" />
      </Box>
    </group>
  );
};

interface ModelViewer3DProps {
  uploadedImages?: File[];
}

const ModelViewer3D = ({ uploadedImages = [] }: ModelViewer3DProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasModel, setHasModel] = useState(false);

  // Show model when images are uploaded
  useEffect(() => {
    if (uploadedImages.length > 0) {
      setIsLoading(true);
      // Simulate model generation
      setTimeout(() => {
        setIsLoading(false);
        setHasModel(true);
      }, 2000);
    } else {
      setHasModel(false);
    }
  }, [uploadedImages]);

  const resetView = () => {
    // Reset camera position would go here
    console.log("Reset view");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">3D Model Viewer</h2>
        
        {hasModel && (
          <div className="flex space-x-2">
            <button 
              onClick={resetView}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <ZoomOut className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <Maximize2 className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              <Download className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>

      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white font-medium">Generating 3D CAD Model...</p>
                <p className="text-gray-400 text-sm">Processing hand image...</p>
              </div>
            </div>
          ) : hasModel ? (
            <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} />
              
              <HandCADModel />
              
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={2}
                maxDistance={10}
              />
              
              <gridHelper args={[10, 10, 0x444444, 0x222222]} />
            </Canvas>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 border-2 border-dashed border-white/30 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 border border-white/30 rounded"></div>
                </div>
                <p className="text-white font-medium">No Model Generated</p>
                <p className="text-gray-400 text-sm">Upload hand images to generate a 3D CAD model</p>
              </div>
            </div>
          )}
        </div>

        {hasModel && (
          <div className="p-4 bg-black/20">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Vertices</p>
                <p className="text-white font-medium">2,847</p>
              </div>
              <div>
                <p className="text-gray-400">Faces</p>
                <p className="text-white font-medium">1,932</p>
              </div>
              <div>
                <p className="text-gray-400">File Size</p>
                <p className="text-white font-medium">1.2 MB</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 space-y-1">
        <p>• Drag to rotate • Scroll to zoom • Right-click to pan</p>
        <p>• Supported formats: OBJ, STL, PLY, GLTF</p>
      </div>
    </div>
  );
};

export default ModelViewer3D;
