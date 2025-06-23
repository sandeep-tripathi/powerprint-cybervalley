import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RotateCcw, ZoomIn, ZoomOut, Download, Share2, Maximize2 } from "lucide-react";
import * as THREE from "three";

// More realistic hand CAD model component with OBJ-like geometry
const HandCADModel = () => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Create a finger segment with rounded ends
  const FingerSegment = ({ position, length, radius, color = "#fdbcb4" }: {
    position: [number, number, number];
    length: number;
    radius: number;
    color?: string;
  }) => (
    <group position={position}>
      {/* Main cylinder */}
      <mesh>
        <cylinderGeometry args={[radius, radius * 0.9, length, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Rounded ends */}
      <mesh position={[0, length * 0.45, 0]}>
        <sphereGeometry args={[radius * 0.8, 8, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, -length * 0.45, 0]}>
        <sphereGeometry args={[radius * 0.8, 8, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );

  return (
    <group ref={meshRef}>
      {/* Palm - more anatomical shape */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.5, 1.2, 8]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>
      
      {/* Palm detail - metacarpal area */}
      <mesh position={[0, 0.3, 0.2]}>
        <boxGeometry args={[0.8, 0.3, 0.8]} />
        <meshStandardMaterial color="#f5a89a" />
      </mesh>

      {/* Thumb - more realistic positioning and shape */}
      <group position={[-0.5, -0.2, 0.4]} rotation={[0, 0.5, -0.3]}>
        {/* Thumb metacarpal */}
        <FingerSegment position={[0, 0.25, 0]} length={0.5} radius={0.12} />
        {/* Thumb proximal phalanx */}
        <FingerSegment position={[0, 0.7, 0]} length={0.4} radius={0.1} />
        {/* Thumb distal phalanx */}
        <FingerSegment position={[0, 1.0, 0]} length={0.3} radius={0.08} />
        {/* Thumb tip */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.09, 8, 6]} />
          <meshStandardMaterial color="#f5a89a" />
        </mesh>
      </group>

      {/* Index finger */}
      <group position={[-0.25, 0, 0.6]} rotation={[0.1, 0, 0]}>
        {/* Proximal phalanx */}
        <FingerSegment position={[0, 0.35, 0]} length={0.7} radius={0.08} />
        {/* Middle phalanx */}
        <FingerSegment position={[0, 0.85, 0]} length={0.5} radius={0.07} />
        {/* Distal phalanx */}
        <FingerSegment position={[0, 1.2, 0]} length={0.4} radius={0.06} />
        {/* Fingertip */}
        <mesh position={[0, 1.45, 0]}>
          <sphereGeometry args={[0.07, 8, 6]} />
          <meshStandardMaterial color="#f5a89a" />
        </mesh>
      </group>

      {/* Middle finger - longest */}
      <group position={[0, 0, 0.65]} rotation={[0.05, 0, 0]}>
        {/* Proximal phalanx */}
        <FingerSegment position={[0, 0.4, 0]} length={0.8} radius={0.08} />
        {/* Middle phalanx */}
        <FingerSegment position={[0, 0.95, 0]} length={0.6} radius={0.07} />
        {/* Distal phalanx */}
        <FingerSegment position={[0, 1.35, 0]} length={0.4} radius={0.06} />
        {/* Fingertip */}
        <mesh position={[0, 1.65, 0]}>
          <sphereGeometry args={[0.07, 8, 6]} />
          <meshStandardMaterial color="#f5a89a" />
        </mesh>
      </group>

      {/* Ring finger */}
      <group position={[0.25, 0, 0.6]} rotation={[0.08, 0, 0]}>
        {/* Proximal phalanx */}
        <FingerSegment position={[0, 0.35, 0]} length={0.7} radius={0.07} />
        {/* Middle phalanx */}
        <FingerSegment position={[0, 0.85, 0]} length={0.5} radius={0.06} />
        {/* Distal phalanx */}
        <FingerSegment position={[0, 1.2, 0]} length={0.4} radius={0.05} />
        {/* Fingertip */}
        <mesh position={[0, 1.45, 0]}>
          <sphereGeometry args={[0.06, 8, 6]} />
          <meshStandardMaterial color="#f5a89a" />
        </mesh>
      </group>

      {/* Pinky finger - smallest */}
      <group position={[0.45, 0, 0.45]} rotation={[0.1, 0, 0]}>
        {/* Proximal phalanx */}
        <FingerSegment position={[0, 0.25, 0]} length={0.5} radius={0.06} />
        {/* Middle phalanx */}
        <FingerSegment position={[0, 0.6, 0]} length={0.4} radius={0.05} />
        {/* Distal phalanx */}
        <FingerSegment position={[0, 0.9, 0]} length={0.3} radius={0.04} />
        {/* Fingertip */}
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshStandardMaterial color="#f5a89a" />
        </mesh>
      </group>

      {/* Wrist - more anatomical */}
      <mesh position={[0, 0, -0.8]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.45, 0.6, 8]} />
        <meshStandardMaterial color="#f5a89a" />
      </mesh>

      {/* Knuckles - add some detail */}
      <mesh position={[-0.25, 0.1, 0.55]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color="#f0a090" />
      </mesh>
      <mesh position={[0, 0.1, 0.6]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color="#f0a090" />
      </mesh>
      <mesh position={[0.25, 0.1, 0.55]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color="#f0a090" />
      </mesh>
      <mesh position={[0.45, 0.1, 0.4]}>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color="#f0a090" />
      </mesh>
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

  const downloadOBJ = () => {
    // Simulate OBJ file download
    const objContent = `# Hand CAD Model - Generated by AI
# Vertices: 2847
# Faces: 1932
# OBJ Format Export

# Vertex data would be here in a real OBJ file
v 0.0 0.0 0.0
v 1.0 0.0 0.0
v 0.0 1.0 0.0
# ... more vertices

# Face data would be here
f 1 2 3
# ... more faces
`;
    
    const blob = new Blob([objContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hand_model.obj';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log("OBJ file downloaded");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">3D Model Viewer</h2>
          <p className="text-sm text-gray-400">Realistic Hand CAD Model (OBJ Format)</p>
        </div>
        
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
            <button 
              onClick={downloadOBJ}
              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              title="Download OBJ file"
            >
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
                <p className="text-white font-medium">Generating Realistic 3D CAD Model...</p>
                <p className="text-gray-400 text-sm">Processing hand geometry for OBJ format...</p>
              </div>
            </div>
          ) : hasModel ? (
            <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
              <directionalLight position={[-5, 5, 5]} intensity={0.8} />
              <pointLight position={[-10, -10, -5]} intensity={0.6} />
              
              <HandCADModel />
              
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={2}
                maxDistance={10}
                autoRotate={false}
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
                <p className="text-gray-400 text-sm">Upload hand images to generate a realistic 3D CAD model</p>
              </div>
            </div>
          )}
        </div>

        {hasModel && (
          <div className="p-4 bg-black/20">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Format</p>
                <p className="text-white font-medium">OBJ</p>
              </div>
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
        <p>• Export formats: OBJ, STL, PLY, GLTF • Realistic anatomical proportions</p>
      </div>
    </div>
  );
};

export default ModelViewer3D;
