
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Download, 
  ExternalLink, 
  Zap, 
  BookOpen,
  Cpu,
  Eye,
  Box
} from "lucide-react";
import { NotebookIntegrationService, NotebookTemplate, CustomVisionConfig } from "@/services/notebookIntegration";
import { useToast } from "@/hooks/use-toast";

const NotebookIntegration = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customConfig, setCustomConfig] = useState<CustomVisionConfig>({
    algorithmName: '',
    description: '',
    inputFormat: 'image',
    outputFormat: '3d_mesh',
    customCode: '',
    dependencies: []
  });
  const [selectedPlatform, setSelectedPlatform] = useState<'colab' | 'jupyter' | 'spark'>('colab');
  const [notebookService] = useState(() => new NotebookIntegrationService());
  const { toast } = useToast();

  const templates = notebookService.getAvailableTemplates();
  const platformTemplates = notebookService.getAvailableTemplates(selectedPlatform);

  const handleDownloadNotebook = () => {
    if (!selectedTemplate) {
      toast({
        title: "No Template Selected",
        description: "Please select a notebook template first.",
        variant: "destructive",
      });
      return;
    }

    const config = customConfig.algorithmName ? customConfig : undefined;
    notebookService.downloadNotebook(selectedTemplate, config);
    
    toast({
      title: "Notebook Downloaded",
      description: "Your custom vision notebook has been downloaded.",
    });
  };

  const handleOpenInColab = () => {
    if (!selectedTemplate) {
      toast({
        title: "No Template Selected",
        description: "Please select a notebook template first.",
        variant: "destructive",
      });
      return;
    }

    const config = customConfig.algorithmName ? customConfig : undefined;
    notebookService.openInColab(selectedTemplate, config);
    
    toast({
      title: "Opening in Colab",
      description: "Your notebook is being opened in Google Colab.",
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'colab': return <Code className="w-4 h-4 text-orange-400" />;
      case 'jupyter': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'spark': return <Cpu className="w-4 h-4 text-purple-400" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'computer_vision': return <Eye className="w-4 h-4" />;
      case '3d_conversion': return <Box className="w-4 h-4" />;
      case 'image_processing': return <Zap className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const defaultCustomCode = `def custom_vision_algorithm(image):
    """
    Your custom vision algorithm goes here
    
    Args:
        image: Input image (numpy array)
    
    Returns:
        processed_result: Your algorithm output
    """
    import cv2
    import numpy as np
    
    # Example: Simple edge detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    
    # Add your custom processing here
    processed_result = edges
    
    return processed_result`;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Code className="w-5 h-5 text-purple-400" />
          <span>Custom Vision Notebook Integration</span>
        </CardTitle>
        <CardDescription className="text-slate-300">
          Generate custom vision algorithms for Google Colab, Jupyter, or Spark notebooks
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value as any)}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-700">
            <TabsTrigger value="colab" className="data-[state=active]:bg-slate-600">
              Google Colab
            </TabsTrigger>
            <TabsTrigger value="jupyter" className="data-[state=active]:bg-slate-600">
              Jupyter
            </TabsTrigger>
            <TabsTrigger value="spark" className="data-[state=active]:bg-slate-600">
              Spark
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedPlatform} className="space-y-6 mt-6">
            {/* Template Selection */}
            <div className="space-y-3">
              <Label className="text-white">Available Templates</Label>
              <div className="grid grid-cols-1 gap-3">
                {platformTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getPlatformIcon(template.platform)}
                        <div>
                          <h4 className="text-white font-medium">{template.name}</h4>
                          <p className="text-sm text-slate-400">{template.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(template.category)}
                        <Badge variant="secondary" className="text-xs">
                          {template.category.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Algorithm Configuration */}
            <div className="space-y-4">
              <Label className="text-white">Custom Algorithm (Optional)</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="algorithmName" className="text-sm text-slate-300">Algorithm Name</Label>
                  <Input
                    id="algorithmName"
                    placeholder="My Custom Vision Algorithm"
                    value={customConfig.algorithmName}
                    onChange={(e) => setCustomConfig({...customConfig, algorithmName: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm text-slate-300">Description</Label>
                  <Input
                    id="description"
                    placeholder="Describe your algorithm"
                    value={customConfig.description}
                    onChange={(e) => setCustomConfig({...customConfig, description: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-slate-300">Input Format</Label>
                  <Select value={customConfig.inputFormat} onValueChange={(value) => setCustomConfig({...customConfig, inputFormat: value as any})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="point_cloud">Point Cloud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-slate-300">Output Format</Label>
                  <Select value={customConfig.outputFormat} onValueChange={(value) => setCustomConfig({...customConfig, outputFormat: value as any})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3d_mesh">3D Mesh</SelectItem>
                      <SelectItem value="depth_map">Depth Map</SelectItem>
                      <SelectItem value="segmentation">Segmentation</SelectItem>
                      <SelectItem value="features">Features</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customCode" className="text-sm text-slate-300">Custom Algorithm Code</Label>
                <Textarea
                  id="customCode"
                  placeholder={defaultCustomCode}
                  value={customConfig.customCode || defaultCustomCode}
                  onChange={(e) => setCustomConfig({...customConfig, customCode: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white font-mono text-sm min-h-[200px]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleDownloadNotebook}
                disabled={!selectedTemplate}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Notebook</span>
              </Button>

              {selectedPlatform === 'colab' && (
                <Button
                  onClick={handleOpenInColab}
                  disabled={!selectedTemplate}
                  variant="outline"
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in Colab</span>
                </Button>
              )}
            </div>

            {/* Usage Instructions */}
            <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
              <h4 className="text-white font-medium flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Usage Instructions</span>
              </h4>
              <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                <li>Select a template that matches your use case</li>
                <li>Optionally configure your custom algorithm</li>
                <li>Download the notebook or open directly in Google Colab</li>
                <li>Upload your images and run the cells</li>
                <li>Customize the algorithm code as needed</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotebookIntegration;
