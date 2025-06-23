
import { useState } from "react";
import { Brain, Zap, Target, Cog } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const ModelSelector = ({ selectedModel, setSelectedModel }: ModelSelectorProps) => {
  const models = [
    {
      id: "cad-pro",
      name: "CAD Pro",
      description: "Professional-grade CAD generation with high precision",
      icon: Target,
      speed: "Fast",
      quality: "Professional",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "mesh-builder",
      name: "Mesh Builder",
      description: "Optimized for complex mesh generation and topology",
      icon: Brain,
      speed: "Medium",
      quality: "High",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "rapid-proto",
      name: "Rapid Proto",
      description: "Fast prototyping with good quality results",
      icon: Zap,
      speed: "Very Fast",
      quality: "Good",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "precision-craft",
      name: "Precision Craft",
      description: "Ultra-high precision for detailed engineering models",
      icon: Cog,
      speed: "Slow",
      quality: "Ultra High",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">AI Model</h2>
      
      <div className="grid grid-cols-1 gap-3">
        {models.map((model) => {
          const Icon = model.icon;
          return (
            <div
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                selectedModel === model.id
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${model.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{model.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{model.description}</p>
                  
                  <div className="flex space-x-4 text-xs">
                    <span className="text-gray-300">
                      Speed: <span className="text-white">{model.speed}</span>
                    </span>
                    <span className="text-gray-300">
                      Quality: <span className="text-white">{model.quality}</span>
                    </span>
                  </div>
                </div>
                
                {selectedModel === model.id && (
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModelSelector;
