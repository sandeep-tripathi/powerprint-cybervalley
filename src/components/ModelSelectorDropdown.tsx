
import { useState } from "react";
import { Brain, Zap, Target, Cog, Eye, Rocket, Plus } from "lucide-react";
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
}

const ModelSelectorDropdown = ({ selectedModel, setSelectedModel }: ModelSelectorDropdownProps) => {
  const [selectedRepo, setSelectedRepo] = useState("");
  const [customRepos, setCustomRepos] = useState<CustomRepo[]>([]);
  const [showAddCustomRepo, setShowAddCustomRepo] = useState(false);
  const [newRepoOwner, setNewRepoOwner] = useState("");
  const [newRepoName, setNewRepoName] = useState("");
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

  const handleAddCustomRepo = () => {
    if (!newRepoOwner.trim() || !newRepoName.trim()) {
      toast({
        title: "Invalid Repository",
        description: "Please provide both owner and repository name.",
        variant: "destructive",
      });
      return;
    }

    const newRepo: CustomRepo = {
      id: `custom-${Date.now()}`,
      name: newRepoName.trim(),
      owner: newRepoOwner.trim()
    };

    setCustomRepos(prev => [...prev, newRepo]);
    setSelectedRepo(newRepo.id);
    setNewRepoOwner("");
    setNewRepoName("");
    setShowAddCustomRepo(false);

    toast({
      title: "Repository Added",
      description: `Successfully added ${newRepo.owner}/${newRepo.name}`,
    });
  };

  const generateSparkNotebook = () => {
    const selectedRepoData = allRepos.find(r => r.id === selectedRepo);
    const repoName = selectedRepoData ? `${selectedRepoData.owner}/${selectedRepoData.name}` : 'your-repo';
    
    const sparkNotebookContent = `# Custom Vision Model - Spark Notebook
# 2D to 3D Conversion using Apache Spark

from pyspark.sql import SparkSession
from pyspark.ml import Pipeline
from pyspark.ml.feature import VectorAssembler
import numpy as np

# Initialize Spark Session
spark = SparkSession.builder \\
    .appName("CustomVision2Dto3D") \\
    .config("spark.sql.adaptive.enabled", "true") \\
    .config("spark.sql.adaptive.coalescePartitions.enabled", "true") \\
    .getOrCreate()

# Clone and setup custom vision repository
!git clone https://github.com/${repoName}.git
%cd ${repoName.split('/')[1]}

# Install dependencies
!pip install torch torchvision opencv-python matplotlib

# Custom Vision 2D to 3D Processing Pipeline
class VisionProcessor:
    def __init__(self, spark_session):
        self.spark = spark_session
        
    def process_image_to_3d(self, image_path):
        """Convert 2D image to 3D model using distributed processing"""
        
        # Load and preprocess image
        import cv2
        image = cv2.imread(image_path)
        
        # Distributed feature extraction
        features_df = self.extract_features_distributed(image)
        
        # 3D mesh generation
        mesh_data = self.generate_3d_mesh(features_df)
        
        return mesh_data
    
    def extract_features_distributed(self, image):
        """Extract image features using Spark for distributed processing"""
        # Implementation for distributed feature extraction
        pass
    
    def generate_3d_mesh(self, features_df):
        """Generate 3D mesh from extracted features"""
        # Implementation for 3D mesh generation
        pass

# Initialize processor
processor = VisionProcessor(spark)

# Process your image
result = processor.process_image_to_3d('/path/to/your/image.jpg')

print("Spark-based 2D to 3D conversion completed!")
print(f"Processing completed using repository: ${repoName}")
`;

    const blob = new Blob([sparkNotebookContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom_vision_spark_notebook.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Spark Notebook Generated",
      description: "Custom vision Spark notebook has been downloaded successfully!",
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Owner</label>
                  <Input
                    value={newRepoOwner}
                    onChange={(e) => setNewRepoOwner(e.target.value)}
                    placeholder="e.g., facebook"
                    className="bg-slate-800 border-slate-600 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Repository</label>
                  <Input
                    value={newRepoName}
                    onChange={(e) => setNewRepoName(e.target.value)}
                    placeholder="e.g., react"
                    className="bg-slate-800 border-slate-600 text-white text-sm"
                  />
                </div>
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

          {/* Spark Notebook Integration */}
          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Rocket className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 font-medium text-sm">Spark Notebook</span>
            </div>
            <p className="text-orange-200 text-xs mb-3">
              Deploy your custom vision algorithm to Apache Spark for distributed 2D to 3D processing
            </p>
            <Button
              onClick={generateSparkNotebook}
              disabled={!selectedRepo}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm py-2"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Generate Spark Notebook
            </Button>
            {!selectedRepo && (
              <p className="text-xs text-orange-300 mt-1">
                Select a repository first to generate Spark notebook
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelectorDropdown;
