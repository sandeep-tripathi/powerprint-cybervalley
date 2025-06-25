import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { notebookService } from "@/services/notebookService";
import { 
  FileCode, 
  Download, 
  ExternalLink, 
  Code, 
  Cpu, 
  Eye,
  Layers,
  Brain,
  Image
} from "lucide-react";

const NotebookIntegration = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const notebookTemplates = [
    {
      id: "computer-vision-basic",
      name: "Computer Vision Basics",
      category: "Computer Vision",
      platform: "colab",
      description: "Essential computer vision operations and image analysis",
      icon: Eye,
      algorithms: ["Edge Detection", "Feature Matching", "Object Detection"],
      difficulty: "Beginner"
    },
    {
      id: "image-processing-advanced",
      name: "Advanced Image Processing",
      category: "Image Processing",
      platform: "jupyter",
      description: "Advanced filtering, enhancement, and transformation techniques",
      icon: Image,
      algorithms: ["Gaussian Filters", "Morphological Operations", "Histogram Equalization"],
      difficulty: "Intermediate"
    },
    {
      id: "3d-conversion-pipeline",
      name: "2D to 3D Conversion",
      category: "2D to 3D Conversion",
      platform: "colab",
      description: "Convert 2D images to 3D models using depth estimation",
      icon: Layers,
      algorithms: ["Depth Estimation", "Point Cloud Generation", "Mesh Reconstruction"],
      difficulty: "Advanced"
    },
    {
      id: "neural-style-transfer",
      name: "Neural Style Transfer",
      category: "Computer Vision",
      platform: "colab",
      description: "Apply artistic styles to images using neural networks",
      icon: Brain,
      algorithms: ["VGG Networks", "Style Loss", "Content Loss"],
      difficulty: "Advanced"
    },
    {
      id: "object-segmentation",
      name: "Object Segmentation",
      category: "Computer Vision",
      platform: "jupyter",
      description: "Semantic and instance segmentation of objects in images",
      icon: Cpu,
      algorithms: ["Mask R-CNN", "U-Net", "DeepLab"],
      difficulty: "Intermediate"
    },
    {
      id: "spark-image-processing",
      name: "Distributed Image Processing",
      category: "Image Processing",
      platform: "spark",
      description: "Large-scale image processing using Apache Spark",
      icon: Code,
      algorithms: ["Distributed Computing", "Batch Processing", "Parallel Filters"],
      difficulty: "Expert"
    }
  ];

  const categories = ["All", "Computer Vision", "Image Processing", "2D to 3D Conversion"];
  const platforms = ["All", "colab", "jupyter", "spark"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");

  const filteredTemplates = notebookTemplates.filter(template => {
    const categoryMatch = selectedCategory === "All" || template.category === selectedCategory;
    const platformMatch = selectedPlatform === "All" || template.platform === selectedPlatform;
    return categoryMatch && platformMatch;
  });

  const handleDownloadNotebook = async (templateId: string) => {
    setIsGenerating(true);
    try {
      const template = notebookTemplates.find(t => t.id === templateId);
      if (!template) return;

      const notebookContent = await notebookService.generateNotebook(templateId, template.platform);
      notebookService.downloadNotebook(notebookContent, `${template.name.replace(/\s+/g, '_')}.ipynb`);
      
      toast({
        title: "Notebook Downloaded",
        description: `${template.name} notebook has been downloaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate notebook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenInColab = (templateId: string) => {
    const template = notebookTemplates.find(t => t.id === templateId);
    if (!template) return;

    const colabUrl = notebookService.getColabUrl(templateId);
    window.open(colabUrl, '_blank');
    
    toast({
      title: "Opening in Colab",
      description: `${template.name} notebook is opening in Google Colab.`,
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'colab': return '🟡';
      case 'jupyter': return '🟠';
      case 'spark': return '🔵';
      default: return '📓';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-orange-500';
      case 'Expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FileCode className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Custom Vision Notebooks</h2>
      </div>

      <div className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {platforms.map(platform => (
                <option key={platform} value={platform}>
                  {platform === "All" ? "All Platforms" : platform.charAt(0).toUpperCase() + platform.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <Card key={template.id} className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-lg">{getPlatformIcon(template.platform)}</span>
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                            {template.platform}
                          </Badge>
                          <Badge className={`text-xs text-white ${getDifficultyColor(template.difficulty)}`}>
                            {template.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">{template.description}</p>
                  
                  <div>
                    <h4 className="text-white font-medium text-sm mb-2">Included Algorithms:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.algorithms.map((algorithm, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                          {algorithm}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadNotebook(template.id)}
                      disabled={isGenerating}
                      className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    {template.platform === 'colab' && (
                      <Button
                        size="sm"
                        onClick={() => handleOpenInColab(template.id)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in Colab
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileCode className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-medium">No templates found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your filters to see more templates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotebookIntegration;
