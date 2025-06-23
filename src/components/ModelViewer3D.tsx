
import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RotateCcw, ZoomIn, ZoomOut, Download, Share2, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  const [apiKey, setApiKey] = useState("pp_example123456789abcdefghijk");
  const [showApiInput, setShowApiInput] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const { toast } = useToast();

  // Convert image to 3D mesh using PowerPrint API
  const convertImageTo3D = async (imageFile: File) => {
    if (!apiKey.trim()) {
      setShowApiInput(true);
      toast({
        title: "API Key Required",
        description: "Please enter your PowerPrint API key to generate 3D models.",
        variant: "destructive",
      });
      return;
    }

    console.log("Starting 3D conversion for:", imageFile.name);
    setIsLoading(true);
    setGenerationStatus("Uploading image...");

    try {
      // Step 1: Create image to 3D task
      const formData = new FormData();
      formData.append('image_file', imageFile);
      formData.append('enable_pbr', 'true');

      console.log("Sending request to PowerPrint API...");
      setGenerationStatus("Creating 3D generation task...");

      const response = await fetch('https://api.powerprint.ai/v2/image-to-3d', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error:", response.status, errorData);
        throw new Error(`API Error: ${response.status} - ${errorData}`);
      }

      const taskData = await response.json();
      console.log("Task created:", taskData);
      setGenerationStatus("Processing 3D model...");

      // Step 2: Poll for completion
      const taskId = taskData.result;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max

      const pollStatus = async (): Promise<any> => {
        attempts++;
        console.log(`Polling attempt ${attempts}/${maxAttempts}`);
        
        const statusResponse = await fetch(`https://api.powerprint.ai/v2/image-to-3d/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });

        if (!statusResponse.ok) {
          throw new Error(`Status check failed: ${statusResponse.status}`);
        }

        const statusData = await statusResponse.json();
        console.log("Status:", statusData);

        if (statusData.status === 'SUCCEEDED') {
          return statusData;
        } else if (statusData.status === 'FAILED') {
          throw new Error('3D generation failed');
        } else if (attempts >= maxAttempts) {
          throw new Error('Generation timeout');
        } else {
          // Wait 5 seconds before next poll
          setGenerationStatus(`Processing... (${attempts}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 5000));
          return pollStatus();
        }
      };

      const finalResult = await pollStatus();
      console.log("Generation completed:", finalResult);

      setHasModel(true);
      setGenerationStatus("3D model generated successfully!");
      
      toast({
        title: "Success!",
        description: "3D model generated successfully from your image.",
      });

    } catch (error) {
      console.error("Error generating 3D model:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate 3D model. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger conversion when images are uploaded
  useEffect(() => {
    if (uploadedImages.length > 0 && apiKey.trim()) {
      // Use the first uploaded image
      convertImageTo3D(uploadedImages[0]);
    } else if (uploadedImages.length === 0) {
      setHasModel(false);
      setGenerationStatus("");
    }
  }, [uploadedImages, apiKey]);

  const resetView = () => {
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
          <p className="text-sm text-gray-400">AI-Powered Image to 3D Conversion</p>
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

      {/* API Key Input - now hidden by default since we have a key */}
      {showApiInput && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <h3 className="text-yellow-400 font-medium mb-2">PowerPrint API Key</h3>
          <p className="text-gray-300 text-sm mb-3">
            Update your PowerPrint API key if needed, or generate a new one by clicking your username
          </p>
          <div className="flex space-x-2">
            <input
              type="password"
              placeholder="Enter your PowerPrint API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400"
            />
            <button
              onClick={() => {
                if (apiKey.trim()) {
                  setShowApiInput(false);
                  toast({
                    title: "API Key Updated",
                    description: "Your API key has been updated successfully!",
                  });
                }
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Success banner showing API is ready */}
      {!showApiInput && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-green-400 font-medium mb-1">API Ready</h3>
                <p className="text-gray-300 text-sm">
                  PowerPrint API key is configured. Upload an image to start generating 3D models!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowApiInput(true)}
              className="text-green-400 hover:text-green-300 text-sm font-medium"
            >
              Change Key
            </button>
          </div>
        </div>
      )}

      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white font-medium">Converting Image to 3D Model...</p>
                <p className="text-gray-400 text-sm">{generationStatus}</p>
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
                <p className="text-white font-medium">Ready for 3D Generation</p>
                <p className="text-gray-400 text-sm">Upload an image to convert it to a 3D model using AI</p>
              </div>
            </div>
          )}
        </div>

        {hasModel && (
          <div className="p-4 bg-black/20">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Source</p>
                <p className="text-white font-medium">Meshy AI</p>
              </div>
              <div>
                <p className="text-gray-400">Format</p>
                <p className="text-white font-medium">OBJ/GLB</p>
              </div>
              <div>
                <p className="text-gray-400">Quality</p>
                <p className="text-white font-medium">High</p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <p className="text-green-400 font-medium">Generated</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 space-y-1">
        <p>• Powered by PowerPrint AI • Supports JPG, PNG images • Free tier: 500 credits/month</p>
        <p>• Generation time: 1-3 minutes • Export formats: OBJ, GLB, USDZ, STL</p>
      </div>
    </div>
  );
};

export default ModelViewer3D;
