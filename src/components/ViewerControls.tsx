
import { RotateCcw, ZoomIn, ZoomOut, Download, Share2, Maximize2 } from "lucide-react";
import PrintPreparation from "./PrintPreparation";
import PrintServiceIntegration from "./PrintServiceIntegration";

interface ViewerControlsProps {
  hasModel: boolean;
  uploadedImages: File[];
  generatedModel?: {
    meshData: any;
    textureUrl: string;
    complexity: number;
    vertices: number;
    faces: number;
  } | null;
  onResetView: () => void;
  onDownloadOBJ: () => void;
}

const ViewerControls = ({ hasModel, uploadedImages, generatedModel, onResetView, onDownloadOBJ }: ViewerControlsProps) => {
  if (!hasModel && uploadedImages.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button 
        onClick={onResetView}
        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        title="Reset View"
      >
        <RotateCcw className="w-5 h-5 text-white" />
      </button>
      <button 
        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-5 h-5 text-white" />
      </button>
      <button 
        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-5 h-5 text-white" />
      </button>
      <button 
        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        title="Fullscreen"
      >
        <Maximize2 className="w-5 h-5 text-white" />
      </button>
      <button 
        onClick={onDownloadOBJ}
        className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        title="Download 3D Model"
      >
        <Download className="w-5 h-5 text-white" />
      </button>
      <button 
        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        title="Share Model"
      >
        <Share2 className="w-5 h-5 text-white" />
      </button>
      
      {/* 3D Printing Controls */}
      {hasModel && generatedModel && (
        <>
          <PrintPreparation
            modelData={generatedModel}
            uploadedImages={uploadedImages}
          />
          <PrintServiceIntegration
            modelData={generatedModel}
          />
        </>
      )}
    </div>
  );
};

export default ViewerControls;
