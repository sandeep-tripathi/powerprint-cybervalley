
import { useEffect, useRef } from "react";
import * as OV from "3dviewer";

interface ThreeDCanvasProps {
  isLoading: boolean;
  generationStatus: string;
  uploadedImages: File[];
}

const ThreeDCanvas = ({ isLoading, generationStatus, uploadedImages }: ThreeDCanvasProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<OV.Viewer | null>(null);

  useEffect(() => {
    if (viewerRef.current && !viewerInstanceRef.current) {
      // Initialize the 3D viewer
      viewerInstanceRef.current = new OV.Viewer();
      viewerInstanceRef.current.Init(viewerRef.current);
      
      // Set viewer parameters
      const viewerParams = new OV.ViewerParams();
      viewerParams.cameraMode = OV.CameraMode.Perspective;
      viewerParams.backgroundColor = new OV.RGBColor(0, 0, 0);
      viewerParams.defaultLineColor = new OV.RGBColor(200, 200, 200);
      viewerInstanceRef.current.SetParameters(viewerParams);
    }

    return () => {
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.Destroy();
        viewerInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (viewerInstanceRef.current && uploadedImages.length > 0) {
      // Create a simple 3D model when images are uploaded
      // In a real implementation, this would be the generated 3D model
      const model = new OV.Model();
      
      // Create a simple cube mesh as placeholder
      const mesh = new OV.Mesh();
      mesh.SetName("Generated 3D Model");
      
      // Add vertices for a cube
      const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], // bottom face
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]      // top face
      ];
      
      vertices.forEach(vertex => {
        mesh.AddVertex(new OV.Coord3D(vertex[0], vertex[1], vertex[2]));
      });
      
      // Add faces
      const faces = [
        [0, 1, 2, 3], // bottom
        [4, 7, 6, 5], // top
        [0, 4, 5, 1], // front
        [2, 6, 7, 3], // back
        [0, 3, 7, 4], // left
        [1, 5, 6, 2]  // right
      ];
      
      faces.forEach(face => {
        const triangle1 = new OV.Triangle(face[0], face[1], face[2]);
        const triangle2 = new OV.Triangle(face[0], face[2], face[3]);
        mesh.AddTriangle(triangle1);
        mesh.AddTriangle(triangle2);
      });
      
      // Set material
      const material = new OV.Material();
      material.name = "Generated Material";
      material.color = new OV.RGBColor(100, 150, 200);
      material.metallic = 0.3;
      material.roughness = 0.7;
      
      model.AddMaterial(material);
      mesh.SetMaterial(0);
      model.AddMesh(mesh);
      
      // Load the model into the viewer
      viewerInstanceRef.current.LoadModelFromModelObject(model);
    }
  }, [uploadedImages]);

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

  if (uploadedImages.length === 0) {
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
  }

  return (
    <div 
      ref={viewerRef} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
};

export default ThreeDCanvas;
