
import { RotateCcw, ZoomIn, ZoomOut, Download, Share2, Maximize2 } from "lucide-react";

interface ViewerControlsProps {
  hasModel: boolean;
  uploadedImages: File[];
  onResetView: () => void;
  onDownloadOBJ: () => void;
}

const ViewerControls = ({ hasModel, uploadedImages, onResetView, onDownloadOBJ }: ViewerControlsProps) => {
  if (!hasModel && uploadedImages.length === 0) {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <button 
        onClick={onResetView}
        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <RotateCcw className="w-5 h-5 text-gray-700" />
      </button>
      <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
        <ZoomIn className="w-5 h-5 text-gray-700" />
      </button>
      <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
        <ZoomOut className="w-5 h-5 text-gray-700" />
      </button>
      <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
        <Maximize2 className="w-5 h-5 text-gray-700" />
      </button>
      <button 
        onClick={onDownloadOBJ}
        className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
        title="Download OBJ file"
      >
        <Download className="w-5 h-5 text-white" />
      </button>
      <button className="p-2 bg-gray-500 hover:bg-gray-600 rounded-lg transition-colors">
        <Share2 className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default ViewerControls;
