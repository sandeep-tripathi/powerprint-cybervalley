
import { Brain, Sparkles, Zap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectorDropdownProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const ModelSelectorDropdown = ({ selectedModel, setSelectedModel }: ModelSelectorDropdownProps) => {
  const models = [
    {
      id: "powerprint-basic",
      name: "PowerPrint Basic",
      description: "Standard quality, fast processing",
      icon: Brain,
      accuracy: "85%",
      speed: "Fast",
      specialty: "General objects"
    },
    {
      id: "powerprint-pro",
      name: "PowerPrint Pro",
      description: "High quality, detailed reconstruction",
      icon: Sparkles,
      accuracy: "95%",
      speed: "Medium",
      specialty: "Complex geometries",
      popular: true
    },
    {
      id: "powerprint-ultra",
      name: "PowerPrint Ultra",
      description: "Maximum quality, photorealistic",
      icon: Zap,
      accuracy: "99%",
      speed: "Slow",
      specialty: "Professional grade"
    }
  ];

  const selectedModelData = models.find(m => m.id === selectedModel);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          AI Model
        </label>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-full bg-gradient-to-r from-blue-900 to-blue-800 border-blue-600 text-white hover:from-blue-800 hover:to-blue-700 transition-all">
            <SelectValue placeholder="Select AI model..." />
          </SelectTrigger>
          <SelectContent className="bg-blue-900 border-blue-600 z-50">
            {models.map((model) => {
              const Icon = model.icon;
              return (
                <SelectItem 
                  key={model.id} 
                  value={model.id}
                  className="text-white hover:bg-blue-800 focus:bg-blue-800"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 text-blue-300" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{model.name}</span>
                          {model.popular && (
                            <span className="bg-blue-500 text-xs px-1.5 py-0.5 rounded">Popular</span>
                          )}
                        </div>
                        <div className="text-xs text-blue-200">{model.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-blue-200">{model.accuracy}</div>
                      <div className="text-xs text-blue-300">{model.speed}</div>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        
        {selectedModelData && (
          <div className="mt-2 text-xs text-blue-300">
            Specialty: {selectedModelData.specialty} • Accuracy: {selectedModelData.accuracy}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-700 rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 font-medium text-sm">AI Model Info</span>
        </div>
        <p className="text-blue-200 text-xs">
          Choose the AI model that best fits your quality and speed requirements for 3D reconstruction.
        </p>
      </div>
    </div>
  );
};

export default ModelSelectorDropdown;
