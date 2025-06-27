
import { useState } from "react";
import { Eye, EyeOff, Key, ExternalLink } from "lucide-react";

interface ApiStatusProps {
  showApiInput: boolean;
  apiKey: string;
  setApiKey: (key: string) => void;
  updateApiKey: (key: string) => void;
  setShowApiInput: (show: boolean) => void;
}

const ApiStatus = ({ 
  showApiInput, 
  apiKey, 
  setApiKey, 
  updateApiKey, 
  setShowApiInput 
}: ApiStatusProps) => {
  const [showKey, setShowKey] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateApiKey(tempKey);
  };

  if (!showApiInput && apiKey) {
    return (
      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-300 font-medium">Meshy AI Connected</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-gray-400 hover:text-white p-1"
              title={showKey ? "Hide API Key" : "Show API Key"}
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowApiInput(true)}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              Change
            </button>
          </div>
        </div>
        {showKey && (
          <div className="mt-2 text-xs text-gray-300">
            <code className="bg-black/30 px-2 py-1 rounded">
              {apiKey.substring(0, 8)}...{apiKey.substring(apiKey.length - 4)}
            </code>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Key className="w-5 h-5 text-purple-400" />
        <span className="text-purple-300 font-medium">Meshy AI API Key Required</span>
        <a
          href="https://www.meshy.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300"
          title="Get Meshy AI API Key"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="Enter your Meshy AI API key..."
            className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Connect Meshy AI
          </button>
          {apiKey && (
            <button
              type="button"
              onClick={() => setShowApiInput(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <p className="text-xs text-gray-400 mt-2">
        Get your API key from{" "}
        <a 
          href="https://www.meshy.ai/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 underline"
        >
          meshy.ai
        </a>
        {" "}dashboard
      </p>
    </div>
  );
};

export default ApiStatus;
