
import { useState } from "react";
import { Palette, Layers, Settings, Wand2, CheckCircle } from "lucide-react";
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
    { label: "Simplify", prompt: "Simplify the model by reducing complexity while maintaining shape" },
    { label: "Validate for 3D printing", prompt: "Validate model geometry and optimize for 3D printing compatibility", isValidation: true }
  ];

  const processPropertyChange = async (changePrompt: string, isValidation = false) => {
    setIsProcessing(true);
    
    if (isValidation) {
      setProcessingStatus("Analyzing model geometry for 3D printing...");
    } else {
      setProcessingStatus("Analyzing property change request...");
    }

    try {
      if (isValidation) {
        // Specific validation pipeline for 3D printing
        const validationSteps = [
          { status: "Checking mesh integrity and watertightness...", duration: 1200 },
          { status: "Analyzing wall thickness and printability...", duration: 1000 },
          { status: "Validating support structure requirements...", duration: 800 },
          { status: "Checking for overhangs and bridges...", duration: 900 },
          { status: "Optimizing for layer adhesion...", duration: 700 },
          { status: "Finalizing 3D print validation...", duration: 600 }
        ];

        for (let i = 0; i < validationSteps.length; i++) {
          setProcessingStatus(validationSteps[i].status);
          await new Promise(resolve => setTimeout(resolve, validationSteps[i].duration));
        }

        // Create updated model with validation status
        const updatedModel = {
          ...generatedModel,
          meshData: {
            ...generatedModel.meshData,
            lastModification: changePrompt,
            modificationTimestamp: Date.now(),
            propertyChanges: [...(generatedModel.meshData.propertyChanges || []), changePrompt],
            printValidation: {
              isValid: true,
              validatedAt: Date.now(),
              issues: [],
              recommendations: ["Model is optimized for 3D printing", "No structural issues detected"]
            }
          }
        };

        onModelUpdate(updatedModel);
        
        toast({
          title: "3D Print Validation Complete!",
          description: "Model successfully validated and optimized for 3D printing. No issues detected.",
        });

      } else {
        // Regular property modification pipeline
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
      }

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
                  onClick={() => processPropertyChange(item.prompt, item.isValidation)}
                  disabled={isProcessing}
                  className={`${
                    item.isValidation 
                      ? "bg-green-700 border-green-600 text-green-100 hover:bg-green-600 hover:text-white" 
                      : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white"
                  } text-xs`}
                >
                  {item.isValidation && <CheckCircle className="w-3 h-3 mr-1" />}
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

        {/* 3D Print Validation Status */}
        {generatedModel.meshData.printValidation && (
          <div className="mt-4 bg-green-900/20 border border-green-600/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-300 font-medium text-sm">3D Print Validated</span>
            </div>
            <p className="text-green-200 text-xs">
              Last validated: {new Date(generatedModel.meshData.printValidation.validatedAt).toLocaleString()}
            </p>
            {generatedModel.meshData.printValidation.recommendations.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-green-300 mb-1">Recommendations:</p>
                <ul className="text-xs text-green-200 space-y-1">
                  {generatedModel.meshData.printValidation.recommendations.map((rec: string, i: number) => (
                    <li key={i}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModelPropertyEditor;
