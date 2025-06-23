
import { useState } from "react";
import { RotateCcw, ZoomIn, ZoomOut, Download, Share2, Maximize2 } from "lucide-react";

const ModelViewer3D = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasModel, setHasModel] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">3D Model Viewer</h2>
        
        {hasModel && (
          <div className="flex space-x-2">
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
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
                <p className="text-white font-medium">Generating 3D Model...</p>
                <p className="text-gray-400 text-sm">This may take a few minutes</p>
              </div>
            </div>
          ) : hasModel ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div className="text-white text-lg font-bold">3D</div>
                </div>
                <p className="text-white font-medium">3D Model Ready</p>
                <p className="text-gray-400 text-sm">Use controls above to interact</p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 border-2 border-dashed border-white/30 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 border border-white/30 rounded"></div>
                </div>
                <p className="text-white font-medium">No Model Generated</p>
                <p className="text-gray-400 text-sm">Upload images and generate a 3D model to view it here</p>
              </div>
            </div>
          )}
        </div>

        {hasModel && (
          <div className="p-4 bg-black/20">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Vertices</p>
                <p className="text-white font-medium">12,847</p>
              </div>
              <div>
                <p className="text-gray-400">Faces</p>
                <p className="text-white font-medium">8,932</p>
              </div>
              <div>
                <p className="text-gray-400">File Size</p>
                <p className="text-white font-medium">2.4 MB</p>
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
