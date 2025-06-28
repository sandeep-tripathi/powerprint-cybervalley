
import { useState } from "react";
import { useApiKey } from "@/hooks/useApiKey";
import { use3DGeneration } from "@/hooks/use3DGeneration";
import ThreeDCanvas from "@/components/ThreeDCanvas";
import ModelInfo from "@/components/ModelInfo";
import ModelPropertyEditor from "@/components/ModelPropertyEditor";
import CompactModelManipulation from "@/components/CompactModelManipulation";
import CompactPrintingValidation from "@/components/CompactPrintingValidation";
import { ParsedObjData } from "@/components/ObjFileParser";
import { useToast } from "@/hooks/use-toast";
import { LLMModelManipulator } from "@/services/llmModelManipulation";

interface ModelViewer3DProps {
  capturedImages?: File[];
  onModelGenerated?: (modelName: string, imageNames: string[], modelData: any, processingTime: number) => void;
}

const ModelViewer3D = ({ capturedImages = [], onModelGenerated }: ModelViewer3DProps) => {
  const [llmLoading, setLlmLoading] = useState(false);
  const [manipulator] = useState(() => new LLMModelManipulator());
  const { toast } = useToast();

  const {
    apiKey,
    setApiKey,
    showApiInput,
    setShowApiInput,
    updateApiKey,
    showApiKeyInput,
  } = useApiKey();

  const {
    isLoading,
    hasModel,
    generationStatus,
    generatedModel,
    updateGeneratedModel,
  } = use3DGeneration({
    apiKey,
    showApiKeyInput,
    uploadedImages: capturedImages,
    onModelGenerated,
  });

  // Create a default panda model when no real model exists
  const getModelForManipulation = () => {
    if (generatedModel) {
      return generatedModel;
    }
    
    // Create default panda model structure
    return {
      meshData: {
        type: "default_panda",
        algorithm: "procedural_geometry",
        inputImages: 0,
        processingTime: 0,
        propertyChanges: [],
      },
      textureUrl: "",
      complexity: 2000,
      vertices: 1000,
      faces: 800,
      qualityScore: 0.85
    };
  };

  const handleLLMManipulation = async (instruction: string, type: 'color' | 'size') => {
    setLlmLoading(true);
    console.log(`Processing LLM ${type} manipulation:`, instruction);
    
    try {
      const currentModel = getModelForManipulation();
      
      const result = await manipulator.manipulateModel({
        instruction,
        type,
        currentModel,
      });

      if (result.success) {
        // If we started with a default model, update the generated model
        if (!generatedModel) {
          updateGeneratedModel(result.updatedModel);
        } else {
          updateGeneratedModel(result.updatedModel);
        }
        
        toast({
          title: `${type === 'color' ? 'Color' : 'Size'} Changes Applied!`,
          description: result.appliedChanges.join(', '),
        });
      } else {
        toast({
          title: "Manipulation Failed",
          description: result.error || "Failed to apply changes to the model.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('LLM manipulation error:', error);
      toast({
        title: "Processing Error",
        description: "An error occurred while processing your request.",
        variant: "destructive",
      });
    }
    
    setLlmLoading(false);
  };

  const handlePropertyChange = async (instruction: string) => {
    setLlmLoading(true);
    console.log('Processing property change:', instruction);
    
    try {
      const currentModel = getModelForManipulation();
      
      // Simulate property change processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedModel = {
        ...currentModel,
        meshData: {
          ...currentModel.meshData,
          lastModification: instruction,
          modificationTimestamp: Date.now(),
          propertyChanges: [...(currentModel.meshData.propertyChanges || []), instruction]
        },
        // Simulate property changes affecting complexity
        complexity: Math.max(1000, currentModel.complexity + (instruction.includes("detail") ? 500 : 0)),
        vertices: currentModel.vertices + (instruction.includes("detail") ? 200 : 0),
        faces: currentModel.faces + (instruction.includes("detail") ? 150 : 0)
      };

      updateGeneratedModel(updatedModel);
      
      toast({
        title: "Model Properties Updated!",
        description: `Successfully applied: "${instruction}"`,
      });
    } catch (error) {
      console.error('Property change error:', error);
      toast({
        title: "Processing Error",
        description: "An error occurred while processing your request.",
        variant: "destructive",
      });
    }
    
    setLlmLoading(false);
  };

  const handlePrintingValidation = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      isValid: Math.random() > 0.3,
      warnings: [
        "Wall thickness is below recommended 0.8mm in some areas",
        "Some overhangs may require support structures"
      ],
      errors: Math.random() > 0.7 ? ["Model contains non-manifold edges"] : [],
      recommendations: [
        "Consider increasing wall thickness for better durability",
        "Optimize orientation for minimal support material"
      ],
      optimizations: [
        "Add support structures for overhangs",
        "Optimize layer adhesion for better strength"
      ]
    };
  };

  const handlePrintOptimization = async (instruction: string) => {
    setLlmLoading(true);
    console.log('Processing print optimization:', instruction);
    
    try {
      const currentModel = getModelForManipulation();
      
      // Simulate optimization processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedModel = {
        ...currentModel,
        meshData: {
          ...currentModel.meshData,
          printOptimization: {
            optimizedAt: Date.now(),
            instruction,
            improvements: ["Reduced support material needed", "Improved layer adhesion"]
          }
        }
      };

      updateGeneratedModel(updatedModel);
    } catch (error) {
      console.error('Print optimization error:', error);
    }
    
    setLlmLoading(false);
  };

  const showManipulationTools = capturedImages.length === 0 || generatedModel || hasModel;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {showManipulationTools && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-600 text-white rounded-full font-semibold text-xs">
                  2
                </span>
                <CompactModelManipulation
                  onManipulate={handleLLMManipulation}
                  onPropertyChange={handlePropertyChange}
                  isLoading={llmLoading}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full font-semibold text-xs">
                  3
                </span>
                <CompactPrintingValidation
                  onValidate={handlePrintingValidation}
                  onOptimize={handlePrintOptimization}
                  isLoading={llmLoading}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="aspect-video bg-black relative">
          <ThreeDCanvas
            isLoading={isLoading}
            generationStatus={generationStatus}
            uploadedImages={capturedImages}
            generatedModel={generatedModel}
            uploadedObj={null}
          />
        </div>

        <ModelInfo uploadedImages={capturedImages} />
      </div>
    </div>
  );
};

export default ModelViewer3D;
