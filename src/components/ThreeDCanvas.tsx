
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import SlicedCube from "./SlicedCube";

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
          <p className="text-white font-medium">Converting Images to 3D Models...</p>
          <p className="text-gray-300 text-sm">{generationStatus}</p>
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
          <p className="text-white font-medium">Ready for 3D Generation</p>
          <p className="text-gray-400 text-sm">Upload images to convert them to 3D models using AI</p>
        </div>
      </div>
    );
  }

  // Calculate positions for cubes in a grid layout
  const getCubePosition = (index: number): [number, number, number] => {
    const spacing = 3;
    const cubesPerRow = 3;
    const x = (index % cubesPerRow) * spacing - (cubesPerRow - 1) * spacing / 2;
    const z = Math.floor(index / cubesPerRow) * spacing - Math.floor(uploadedImages.length / cubesPerRow) * spacing / 2;
    return [x, 1, z];
  };

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg">
      <Canvas camera={{ position: [8, 8, 8], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

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

        {/* Render a cube for each uploaded image */}
        {uploadedImages.map((image, index) => {
          const position = getCubePosition(index);
          return (
            <SlicedCube
              key={index}
              position={position}
              scale={[1, 1, 1]}
              rotation={[0, index * 0.5, 0]}
              animate={true}
            />
          );
        })}

        {/* Orbit controls for camera interaction */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
        />
      </Canvas>

      {/* Overlay text */}
      <div className="absolute bottom-4 left-4">
        <p className="text-white font-medium text-sm">
          3D Models Generated ({uploadedImages.length})
        </p>
        <p className="text-gray-300 text-xs">
          Click and drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
};

export default ThreeDCanvas;
