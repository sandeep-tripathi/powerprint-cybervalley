import { useState } from "react";
import { Brain, Zap, Target, Cog, Eye, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ModelSelectorDropdownProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

interface CustomRepo {
  id: string;
  name: string;
  owner: string;
  url?: string;
}

const ModelSelectorDropdown = ({ selectedModel, setSelectedModel }: ModelSelectorDropdownProps) => {
  const [selectedRepo, setSelectedRepo] = useState("");
  const [customRepos, setCustomRepos] = useState<CustomRepo[]>([]);
  const [showAddCustomRepo, setShowAddCustomRepo] = useState(false);
  const [repoInput, setRepoInput] = useState("");
  const { toast } = useToast();

  const models = [
    {
      id: "gpt-4-vision",
      name: "GPT-4 Vision",
      description: "Advanced vision-language model",
      icon: Target,
      speed: "Fast",
      quality: "Professional"
    },
    {
      id: "claude-vision",
      name: "Claude Vision",
      description: "Complex visual reasoning",
      icon: Brain,
      speed: "Medium",
      quality: "High"
    },
    {
      id: "gemini-vision",
      name: "Gemini Vision",
      description: "Fast multimodal processing",
      icon: Zap,
      speed: "Very Fast",
      quality: "Good"
    },
    {
      id: "llava-vision",
      name: "LLaVA Vision",
      description: "Ultra-high precision",
      icon: Cog,
      speed: "Slow",
      quality: "Ultra High"
    },
    {
      id: "custom-vision",
      name: "Custom Vision",
      description: "Customizable configuration",
      icon: Eye,
      speed: "Variable",
      quality: "Configurable"
    }
  ];

  const defaultGithubRepos = [
    { id: "repo1", name: "vision-transformer", owner: "huggingface" },
    { id: "repo2", name: "detectron2", owner: "facebookresearch" },
    { id: "repo3", name: "yolov5", owner: "ultralytics" },
    { id: "repo4", name: "clip", owner: "openai" },
    { id: "repo5", name: "efficientnet", owner: "tensorflow" },
    { id: "repo6", name: "sam", owner: "facebookresearch" }
  ];

  const allRepos = [...defaultGithubRepos, ...customRepos];

  const parseRepoInput = (input: string): { owner: string; name: string; url?: string } | null => {
    const trimmedInput = input.trim();
    
    // Check if it's a URL
    if (trimmedInput.startsWith('http://') || trimmedInput.startsWith('https://')) {
      const urlMatch = trimmedInput.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
      if (urlMatch) {
        return {
          owner: urlMatch[1],
          name: urlMatch[2].replace(/\.git$/, ''),
          url: trimmedInput
        };
      }
      return null;
    }
    
    // Check if it's in owner/repo format
    if (trimmedInput.includes('/')) {
      const [owner, name] = trimmedInput.split('/');
      if (owner && name) {
        return { owner: owner.trim(), name: name.trim() };
      }
    }
    
    return null;
  };

  const handleAddCustomRepo = () => {
    if (!repoInput.trim()) {
      toast({
        title: "Invalid Repository",
        description: "Please provide a repository URL or owner/repository format.",
        variant: "destructive",
      });
      return;
    }

    const parsedRepo = parseRepoInput(repoInput);
    if (!parsedRepo) {
      toast({
        title: "Invalid Format",
        description: "Please use either a GitHub URL or owner/repository format (e.g., facebook/react).",
        variant: "destructive",
      });
      return;
    }

    const newRepo: CustomRepo = {
      id: `custom-${Date.now()}`,
      name: parsedRepo.name,
      owner: parsedRepo.owner,
      url: parsedRepo.url
    };

    setCustomRepos(prev => [...prev, newRepo]);
    setSelectedRepo(newRepo.id);
    setRepoInput("");
    setShowAddCustomRepo(false);

    toast({
      title: "Repository Added",
      description: `Successfully added ${newRepo.owner}/${newRepo.name}`,
    });
  };

  const selectedModelData = models.find(m => m.id === selectedModel);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">AI Model</h2>
      <div>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white">
            <SelectValue placeholder="Select an AI model..." />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600 z-50">
            {models.map((model) => {
              const Icon = model.icon;
              return (
                <SelectItem 
                  key={model.id} 
                  value={model.id}
                  className="text-white hover:bg-slate-700 focus:bg-slate-700"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-xs text-gray-400">{model.description}</div>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        
        {selectedModelData && (
          <div className="mt-2 text-xs text-gray-400">
            Speed: {selectedModelData.speed} • Quality: {selectedModelData.quality}
          </div>
        )}
      </div>

      {/* GitHub Repository Selection for Custom Vision */}
      {selectedModel === "custom-vision" && (
        <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-white">
              Select GitHub Repository
            </label>
            <Button
              onClick={() => setShowAddCustomRepo(!showAddCustomRepo)}
              variant="outline"
              size="sm"
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Custom
            </Button>
          </div>

          {showAddCustomRepo && (
            <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Repository URL or owner/repo</label>
                <Input
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  placeholder="e.g., https://github.com/facebook/react or facebook/react"
                  className="bg-slate-800 border-slate-600 text-white text-sm"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Enter a GitHub URL or use owner/repository format
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleAddCustomRepo}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Add Repository
                </Button>
                <Button
                  onClick={() => setShowAddCustomRepo(false)}
                  variant="outline"
                  size="sm"
                  className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <Select value={selectedRepo} onValueChange={setSelectedRepo}>
            <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white">
              <SelectValue placeholder="Choose a repository..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600 z-50">
              {allRepos.map((repo) => (
                <SelectItem 
                  key={repo.id} 
                  value={repo.id}
                  className="text-white hover:bg-slate-700 focus:bg-slate-700"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">{repo.owner}/</span>
                    <span className="text-white font-medium">{repo.name}</span>
                    {repo.id.startsWith('custom-') && (
                      <span className="text-xs bg-purple-600 text-white px-1 rounded">custom</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ModelSelectorDropdown;
