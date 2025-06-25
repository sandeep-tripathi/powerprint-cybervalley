
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment } from "@react-three/drei";
import PowerPrintModel from "./PowerPrintModel";

interface ThreeDCanvasProps {
  isLoading: boolean;
  generationStatus: string;
  uploadedImages: File[];
  generatedModel?: {
    meshData: any;
    textureUrl: string;
    complexity: number;
    vertices: number;
    faces: number;
  } | null;
}

const ThreeDCanvas = ({ isLoading, generationStatus, uploadedImages, generatedModel }: ThreeDCanvasProps) => {
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">PowerPrint Pipeline Processing...</p>
          <p className="text-purple-300 text-sm">{generationStatus}</p>
        </div>
      </div>
    );
  }

  if (uploadedImages.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-2 border-dashed border-gray-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 border border-gray-500 rounded"></div>
          </div>
          <p className="text-white font-medium">Ready for PowerPrint Generation</p>
          <p className="text-gray-400 text-sm">Upload images to generate 3D models using the PowerPrint pipeline</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg">
      <Canvas camera={{ position: [6, 6, 6], fov: 60 }}>
        {/* Enhanced lighting for better model visualization */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.6} />
        <spotLight position={[0, 15, 0]} intensity={0.8} angle={0.3} />

        {/* Environment for reflections */}
        <Environment preset="studio" />

        {/* 3D Grid */}
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#444444"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#666666"
          fadeDistance={30}
          fadeStrength={1}
          infiniteGrid
        />

        {/* Render the generated PowerPrint model */}
        {generatedModel && (
          <PowerPrintModel
            modelData={generatedModel}
            animate={true}
          />
        )}

        {/* Orbit controls for camera interaction */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
          autoRotate={false}
        />
      </Canvas>

      {/* Overlay text with pipeline info */}
      <div className="absolute bottom-4 left-4">
        {generatedModel ? (
          <div>
            <p className="text-white font-medium text-sm">
              PowerPrint Model Generated
            </p>
            <p className="text-purple-300 text-xs">
              {generatedModel.vertices.toLocaleString()} vertices • {generatedModel.faces.toLocaleString()} faces
            </p>
            <p className="text-gray-300 text-xs">
              Click and drag to rotate • Scroll to zoom
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            Waiting for PowerPrint pipeline...
          </p>
        )}
      </div>
    </div>
  );
};

export default ThreeDCanvas;
