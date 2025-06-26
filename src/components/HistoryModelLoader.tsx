
import { useState } from "react";
import { History, FileText, Eye, Download } from "lucide-react";
import { Button } from "./ui/button";
import { useGenerationHistory } from "@/hooks/useGenerationHistory";

interface HistoryModelLoaderProps {
  onModelLoad: (modelData: any) => void;
}

const HistoryModelLoader = ({ onModelLoad }: HistoryModelLoaderProps) => {
  const { history } = useGenerationHistory();
  const [showHistory, setShowHistory] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleModelLoad = (item: any) => {
    onModelLoad(item.modelData);
    setShowHistory(false);
    console.log("Loaded model from history:", item.modelName);
  };

  if (showHistory) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Model History</h3>
          <Button
            onClick={() => setShowHistory(false)}
            variant="outline"
            size="sm"
          >
            Close
          </Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No models in history</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-500" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.modelName}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(item.timestamp)} • {item.modelData.vertices.toLocaleString()} vertices
                  </p>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleModelLoad(item)}
                    className="p-1 h-auto"
                    title="Load Model"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={() => setShowHistory(true)}
        disabled={history.length === 0}
        variant="outline"
        size="sm"
        className="h-8 px-3 text-xs"
      >
        <History className="w-3 h-3 mr-2" />
        Load from History
      </Button>
      
      {history.length === 0 && (
        <p className="text-xs text-gray-500">No models in history</p>
      )}
    </div>
  );
};

export default HistoryModelLoader;
