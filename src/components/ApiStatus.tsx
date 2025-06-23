
interface ApiStatusProps {
  showApiInput: boolean;
  apiKey: string;
  setApiKey: (key: string) => void;
  updateApiKey: (key: string) => void;
  setShowApiInput: (show: boolean) => void;
}

const ApiStatus = ({ showApiInput, apiKey, setApiKey, updateApiKey, setShowApiInput }: ApiStatusProps) => {
  if (showApiInput) {
    return (
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
        <h3 className="text-yellow-700 font-medium mb-2">PowerPrint API Key</h3>
        <p className="text-gray-700 text-sm mb-3">
          Update your PowerPrint API key if needed, or generate a new one by clicking your username
        </p>
        <div className="flex space-x-2">
          <input
            type="password"
            placeholder="Enter your PowerPrint API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400"
          />
          <button
            onClick={() => updateApiKey(apiKey)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-300 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
          <div>
            <h3 className="text-green-700 font-medium mb-1">API Ready</h3>
            <p className="text-gray-700 text-sm">
              PowerPrint API key is configured. Upload an image to start generating 3D models!
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowApiInput(true)}
          className="text-gray-600 hover:text-gray-500 text-sm font-medium"
        >
          Change Key
        </button>
      </div>
    </div>
  );
};

export default ApiStatus;
