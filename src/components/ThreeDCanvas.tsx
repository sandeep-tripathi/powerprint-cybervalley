
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SlicedCube from "@/components/SlicedCube";

interface ThreeDCanvasProps {
  isLoading: boolean;
  generationStatus: string;
  uploadedImages: File[];
}

const ThreeDCanvas = ({ isLoading, generationStatus, uploadedImages }: ThreeDCanvasProps) => {
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">Converting Image to 3D Model...</p>
          <p className="text-gray-300 text-sm">{generationStatus}</p>
        </div>
      </div>
    );
  }

  if (uploadedImages.length > 0) {
    return (
      <Canvas camera={{ position: [4, 2, 6], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.6} />
        <spotLight 
          position={[0, 10, 0]} 
          angle={0.3} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        <SlicedCube scale={[2, 2, 2]} animate={true} />
        
        {/* Enhanced 3D Axis Helper - larger and more visible */}
        <axesHelper args={[5]} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={12}
          autoRotate={false}
        />
        
        <gridHelper args={[10, 10, 0x444444, 0x666666]} />
      </Canvas>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 border-2 border-dashed border-gray-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <div className="w-8 h-8 border border-gray-500 rounded"></div>
        </div>
        <p className="text-white font-medium">Ready for 3D Generation</p>
        <p className="text-gray-400 text-sm">Upload an image to convert it to a 3D model using AI</p>
      </div>
    </div>
  );
};

export default ThreeDCanvas;
