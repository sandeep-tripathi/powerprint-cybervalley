
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment } from "@react-three/drei";
import PowerPrintModel from "./PowerPrintModel";
import ObjViewer from "./ObjViewer";
import DefaultRing from "./DefaultRing";
import { ParsedObjData } from "./ObjFileParser";

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
    qualityScore?: number;
  } | null;
  uploadedObj?: {
    data: ParsedObjData;
    fileName: string;
  } | null;
}

const ThreeDCanvas = ({ 
  isLoading, 
  generationStatus, 
  uploadedImages, 
  generatedModel,
  uploadedObj 
}: ThreeDCanvasProps) => {
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white font-medium">Vision AI Processing...</p>
          <p className="text-purple-300 text-sm">{generationStatus}</p>
          <div className="mt-2 text-xs text-gray-400">
            Using advanced vision language models
          </div>
        </div>
      </div>
    );
  }

  const showDefaultRing = uploadedImages.length === 0 && !uploadedObj && !generatedModel;

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

        {/* Show default ring when no content */}
        {showDefaultRing && <DefaultRing animate={true} />}

        {/* Render the generated model */}
        {generatedModel && (
          <PowerPrintModel
            modelData={generatedModel}
            animate={true}
          />
        )}

        {/* Render uploaded OBJ file */}
        {uploadedObj && (
          <ObjViewer
            objData={uploadedObj.data}
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

      {/* Overlay text with algorithm info */}
      <div className="absolute bottom-4 left-4">
        {showDefaultRing ? (
          <div>
            <p className="text-white font-medium text-sm">
              Default 3D Ring Model
            </p>
            <p className="text-purple-300 text-xs">
              Ready for manipulation and printing validation
            </p>
            <p className="text-gray-300 text-xs">
              Click and drag to rotate • Scroll to zoom
            </p>
          </div>
        ) : generatedModel ? (
          <div>
            <p className="text-white font-medium text-sm">
              Vision AI 3D Model Generated
            </p>
            <p className="text-purple-300 text-xs">
              {generatedModel.vertices.toLocaleString()} vertices • {generatedModel.faces.toLocaleString()} faces
              {generatedModel.qualityScore && ` • Quality: ${(generatedModel.qualityScore * 100).toFixed(1)}%`}
            </p>
            <p className="text-gray-300 text-xs">
              Click and drag to rotate • Scroll to zoom
            </p>
          </div>
        ) : uploadedObj ? (
          <div>
            <p className="text-white font-medium text-sm">
              OBJ File: {uploadedObj.fileName}
            </p>
            <p className="text-purple-300 text-xs">
              {(uploadedObj.data.vertices.length / 3).toLocaleString()} vertices
            </p>
            <p className="text-gray-300 text-xs">
              Click and drag to rotate • Scroll to zoom
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            Waiting for vision AI processing...
          </p>
        )}
      </div>
    </div>
  );
};

export default ThreeDCanvas;
