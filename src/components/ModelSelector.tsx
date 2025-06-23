import { useState } from "react";
import { Brain, Zap, Target, Cog, Eye, ChevronDown, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const ModelSelector = ({ selectedModel, setSelectedModel }: ModelSelectorProps) => {
  const [selectedRepo, setSelectedRepo] = useState("");
  const [customRepoUrl, setCustomRepoUrl] = useState("");
  const [customRepos, setCustomRepos] = useState<Array<{id: string, name: string, owner: string}>>([]);
  const { toast } = useToast();

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
    ...customRepos
  ];

  const parseGithubUrl = (url: string) => {
    // Support formats: https://github.com/owner/repo, github.com/owner/repo, owner/repo
    const githubUrlRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/\s]+)/;
    const simpleFormatRegex = /^([^\/\s]+)\/([^\/\s]+)$/;
    
    let match = url.match(githubUrlRegex);
    if (match) {
      return { owner: match[1], name: match[2] };
    }
    
    match = url.match(simpleFormatRegex);
    if (match) {
      return { owner: match[1], name: match[2] };
    }
    
    return null;
  };

  const handleAddCustomRepo = () => {
    if (!customRepoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a GitHub repository URL or owner/repo format",
        variant: "destructive",
      });
      return;
    }

    const parsed = parseGithubUrl(customRepoUrl.trim());
    if (!parsed) {
      toast({
        title: "Invalid Format",
        description: "Please use format: owner/repo or https://github.com/owner/repo",
        variant: "destructive",
      });
      return;
    }

    // Check if repo already exists
    const existingRepo = githubRepos.find(repo => 
      repo.owner === parsed.owner && repo.name === parsed.name
    );

    if (existingRepo) {
      toast({
        title: "Repository Exists",
        description: "This repository is already in the list",
        variant: "destructive",
      });
      return;
    }

    const newRepo = {
      id: `custom-${Date.now()}`,
      name: parsed.name,
      owner: parsed.owner
    };

    setCustomRepos(prev => [...prev, newRepo]);
    setSelectedRepo(newRepo.id);
    setCustomRepoUrl("");
    
    toast({
      title: "Repository Added",
      description: `Successfully added ${parsed.owner}/${parsed.name}`,
    });
  };

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

              {/* GitHub Repository Selection for Custom Vision */}
              {selectedModel === model.id && model.id === "custom-vision" && (
                <div className="ml-4 p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Select GitHub Repository
                  </label>
                  <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                    <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Choose a repository..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 z-50">
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

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Add Custom Repository
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={customRepoUrl}
                        onChange={(e) => setCustomRepoUrl(e.target.value)}
                        placeholder="owner/repo or https://github.com/owner/repo"
                        className="flex-1 bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddCustomRepo();
                          }
                        }}
                      />
                      <Button
                        onClick={handleAddCustomRepo}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">
                      Enter repository in format: owner/repo or full GitHub URL
                    </p>
                  </div>

                  {selectedRepo && (
                    <p className="text-xs text-gray-400">
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
