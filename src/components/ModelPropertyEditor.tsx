
import { useState } from "react";
import { Palette, Layers, Settings, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface ModelPropertyEditorProps {
  generatedModel: {
    meshData: any;
    textureUrl: string;
    complexity: number;
    vertices: number;
    faces: number;
  };
  onModelUpdate: (updatedModel: any) => void;
}

const ModelPropertyEditor = ({ generatedModel, onModelUpdate }: ModelPropertyEditorProps) => {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const { toast } = useToast();

  const quickPrompts = [
    { label: "Make it metallic", prompt: "Make the model have a metallic gold finish with high reflectivity" },
    { label: "Change to blue", prompt: "Change the color to a vibrant blue with smooth finish" },
    { label: "Add texture", prompt: "Add a rough stone texture to the surface" },
    { label: "Make transparent", prompt: "Make the model semi-transparent like glass" },
    { label: "Increase detail", prompt: "Add more surface detail and complexity to the model" },
    { label: "Simplify", prompt: "Simplify the model by reducing complexity while maintaining shape" }
  ];

  const processPropertyChange = async (changePrompt: string) => {
    setIsProcessing(true);
    setProcessingStatus("Analyzing property change request...");

    try {
      // Simulate property modification pipeline
      const modificationSteps = [
        { status: "Parsing modification prompt...", duration: 800 },
        { status: "Analyzing current model properties...", duration: 1200 },
        { status: "Applying material changes...", duration: 1500 },
        { status: "Updating surface properties...", duration: 1000 },
        { status: "Optimizing visual appearance...", duration: 800 },
        { status: "Finalizing property updates...", duration: 600 }
      ];

      for (let i = 0; i < modificationSteps.length; i++) {
        setProcessingStatus(modificationSteps[i].status);
        await new Promise(resolve => setTimeout(resolve, modificationSteps[i].duration));
      }

      // Create updated model with new properties
      const updatedModel = {
        ...generatedModel,
        meshData: {
          ...generatedModel.meshData,
          lastModification: changePrompt,
          modificationTimestamp: Date.now(),
          propertyChanges: [...(generatedModel.meshData.propertyChanges || []), changePrompt]
        },
        // Simulate property changes affecting complexity
        complexity: Math.max(1000, generatedModel.complexity + (changePrompt.includes("detail") ? 500 : 0)),
        vertices: generatedModel.vertices + (changePrompt.includes("detail") ? 200 : 0),
        faces: generatedModel.faces + (changePrompt.includes("detail") ? 150 : 0)
      };

      onModelUpdate(updatedModel);
      
      toast({
        title: "Model Properties Updated!",
        description: `Successfully applied: "${changePrompt}"`,
      });

      setPrompt("");
      
    } catch (error) {
      console.error("Error updating model properties:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update model properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Wand2 className="w-5 h-5 text-purple-400" />
          <span>Model Property Editor</span>
        </CardTitle>
        <p className="text-slate-300 text-sm">
          Use AI to modify the appearance and properties of your generated model
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="prompt" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700">
            <TabsTrigger value="prompt" className="text-slate-300 data-[state=active]:text-white">
              Custom Prompt
            </TabsTrigger>
            <TabsTrigger value="quick" className="text-slate-300 data-[state=active]:text-white">
              Quick Changes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompt" className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Describe the changes you want to make:
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Make the model shiny gold with a mirror finish, or change the color to bright red with a matte texture..."
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 min-h-[80px]"
                disabled={isProcessing}
              />
            </div>
            
            <Button
              onClick={() => processPropertyChange(prompt)}
              disabled={!prompt.trim() || isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating Properties...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Apply Changes</span>
                </div>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="quick" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {quickPrompts.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => processPropertyChange(item.prompt)}
                  disabled={isProcessing}
                  className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white text-xs"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {isProcessing && (
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-purple-300 font-medium text-sm">Processing Changes</span>
            </div>
            <p className="text-slate-300 text-xs">{processingStatus}</p>
          </div>
        )}

        {generatedModel.meshData.propertyChanges && generatedModel.meshData.propertyChanges.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm text-slate-300 mb-2">Recent Changes:</h4>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {generatedModel.meshData.propertyChanges.slice(-3).map((change: string, index: number) => (
                <div key={index} className="text-xs text-slate-400 bg-slate-700/30 rounded px-2 py-1">
                  {change}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModelPropertyEditor;
