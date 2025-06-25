
import { useState } from "react";
import { Download, Eye, Trash2, Clock, Image, Layers, Calendar } from "lucide-react";
import { useGenerationHistory } from "@/hooks/useGenerationHistory";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const GenerationHistory = () => {
  const { history, clearHistory, removeFromHistory } = useGenerationHistory();
  const [selectedModel, setSelectedModel] = useState<any>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const downloadModel = (item: any) => {
    const objContent = `# PowerPrint Generated Model - ${item.modelName}
# Generated: ${formatDate(item.timestamp)}
# Source Images: ${item.imageNames.join(', ')}
# Vertices: ${item.modelData.vertices.toLocaleString()}
# Faces: ${item.modelData.faces.toLocaleString()}
# Complexity: ${item.modelData.complexity}
# Processing Time: ${(item.processingTime / 1000).toFixed(1)}s

# PowerPrint Pipeline Model Export
# Advanced AI-Generated 3D Geometry
`;
    
    const blob = new Blob([objContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.modelName.replace(/\s+/g, '_')}_${item.id.slice(-8)}.obj`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const viewModel = (item: any) => {
    setSelectedModel(item);
  };

  if (history.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Generation History</h1>
        </div>
        
        <div className="text-center py-20">
          <div className="w-20 h-20 border-2 border-dashed border-gray-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <Clock className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No Generation History</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Your PowerPrint 3D model generations will appear here. Start by uploading images in the Generate tab.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Generation History</h1>
          <p className="text-slate-300">Your PowerPrint AI-generated 3D models</p>
        </div>
        
        <button
          onClick={clearHistory}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear History</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
          <div className="flex items-center space-x-3">
            <Layers className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-white">{history.length}</p>
              <p className="text-sm text-gray-400">Models Generated</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
          <div className="flex items-center space-x-3">
            <Image className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">
                {history.reduce((acc, item) => acc + item.imageNames.length, 0)}
              </p>
              <p className="text-sm text-gray-400">Images Processed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">
                {(history.reduce((acc, item) => acc + item.processingTime, 0) / 1000 / 60).toFixed(1)}m
              </p>
              <p className="text-sm text-gray-400">Total Processing</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-orange-400" />
            <div>
              <p className="text-2xl font-bold text-white">
                {formatDate(history[0]?.timestamp).split(',')[0]}
              </p>
              <p className="text-sm text-gray-400">Latest Generation</p>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/20">
              <TableHead className="text-white font-semibold">Model Name</TableHead>
              <TableHead className="text-white font-semibold">Generated</TableHead>
              <TableHead className="text-white font-semibold">Source Images</TableHead>
              <TableHead className="text-white font-semibold">Details</TableHead>
              <TableHead className="text-white font-semibold">Processing Time</TableHead>
              <TableHead className="text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="text-white font-medium">{item.modelName}</TableCell>
                <TableCell className="text-gray-300">{formatDate(item.timestamp)}</TableCell>
                <TableCell className="text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Image className="w-4 h-4" />
                    <span>{item.imageNames.length} image{item.imageNames.length > 1 ? 's' : ''}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  <div className="text-sm space-y-1">
                    <div>{item.modelData.vertices.toLocaleString()} vertices</div>
                    <div>{item.modelData.faces.toLocaleString()} faces</div>
                    <div>Complexity: {item.modelData.complexity}</div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  {(item.processingTime / 1000).toFixed(1)}s
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => viewModel(item)}
                      className="p-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded-lg transition-colors"
                      title="View Model"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadModel(item)}
                      className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded-lg transition-colors"
                      title="Download Model"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromHistory(item.id)}
                      className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg transition-colors"
                      title="Remove from History"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Model Preview Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg border border-white/20 p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{selectedModel.modelName}</h3>
              <button
                onClick={() => setSelectedModel(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Generated:</span>
                  <p className="text-white">{formatDate(selectedModel.timestamp)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Processing Time:</span>
                  <p className="text-white">{(selectedModel.processingTime / 1000).toFixed(1)}s</p>
                </div>
                <div>
                  <span className="text-gray-400">Vertices:</span>
                  <p className="text-white">{selectedModel.modelData.vertices.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-400">Faces:</span>
                  <p className="text-white">{selectedModel.modelData.faces.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <span className="text-gray-400">Source Images:</span>
                <p className="text-white">{selectedModel.imageNames.join(', ')}</p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => downloadModel(selectedModel)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Model</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationHistory;
