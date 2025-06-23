
import { useState } from "react";
import { Brain, Zap, Target, Cog, Eye, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const ModelSelector = ({ selectedModel, setSelectedModel }: ModelSelectorProps) => {
  const [selectedRepo, setSelectedRepo] = useState("");

  const models = [
    {
      id: "gpt-4-vision",
      name: "GPT-4 Vision",
      description: "Advanced vision-language model with high precision understanding",
      icon: Target,
      speed: "Fast",
      quality: "Professional",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "claude-vision",
      name: "Claude Vision",
      description: "Optimized for complex visual reasoning and detailed analysis",
      icon: Brain,
      speed: "Medium",
      quality: "High",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "gemini-vision",
      name: "Gemini Vision",
      description: "Fast multimodal processing with good quality results",
      icon: Zap,
      speed: "Very Fast",
      quality: "Good",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "llava-vision",
      name: "LLaVA Vision",
      description: "Ultra-high precision for detailed visual understanding",
      icon: Cog,
      speed: "Slow",
      quality: "Ultra High",
      color: "from-orange-500 to-red-500"
    },
    {
      id: "custom-vision",
      name: "Custom Vision",
      description: "Customizable vision model with flexible configuration options",
      icon: Eye,
      speed: "Variable",
      quality: "Configurable",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const githubRepos = [
    { id: "repo1", name: "vision-transformer", owner: "huggingface" },
    { id: "repo2", name: "detectron2", owner: "facebookresearch" },
    { id: "repo3", name: "yolov5", owner: "ultralytics" },
    { id: "repo4", name: "clip", owner: "openai" },
    { id: "repo5", name: "efficientnet", owner: "tensorflow" },
    { id: "repo6", name: "sam", owner: "facebookresearch" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">AI Model</h2>
      
      <div className="grid grid-cols-1 gap-3">
        {models.map((model) => {
          const Icon = model.icon;
          return (
            <div key={model.id} className="space-y-3">
              <div
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

              {/* GitHub Repository Dropdown for Custom Vision */}
              {selectedModel === model.id && model.id === "custom-vision" && (
                <div className="ml-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <label className="block text-sm font-medium text-white mb-2">
                    Select GitHub Repository
                  </label>
                  <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                    <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Choose a repository..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {githubRepos.map((repo) => (
                        <SelectItem 
                          key={repo.id} 
                          value={repo.id}
                          className="text-white hover:bg-slate-700 focus:bg-slate-700"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">{repo.owner}/</span>
                            <span className="text-white font-medium">{repo.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedRepo && (
                    <p className="text-xs text-gray-400 mt-2">
                      Selected: {githubRepos.find(r => r.id === selectedRepo)?.owner}/{githubRepos.find(r => r.id === selectedRepo)?.name}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModelSelector;
