
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

interface ModelViewer3DProps {
  capturedImages?: File[];
  onModelGenerated?: (modelName: string, imageNames: string[], modelData: any, processingTime: number) => void;
}

const ModelViewer3D = ({ capturedImages = [], onModelGenerated }: ModelViewer3DProps) => {
  const [llmLoading, setLlmLoading] = useState(false);
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

  const handleLLMManipulation = async (instruction: string, type: 'color' | 'size') => {
    setLlmLoading(true);
    console.log(`LLM ${type} manipulation instruction:`, instruction);
    
    // Simulate LLM processing with type-specific responses
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate model property changes based on type
    if (generatedModel) {
      const updatedModel = { ...generatedModel };
      
      if (type === 'color') {
        // Simulate color changes
        updatedModel.meshData = {
          ...updatedModel.meshData,
          colorChange: instruction,
          appliedAt: new Date().toISOString()
        };
        toast({
          title: "Color Changed!",
          description: `Applied color change: ${instruction}`,
        });
      } else if (type === 'size') {
        // Simulate size changes
        const sizeMultiplier = instruction.toLowerCase().includes('bigger') ? 1.5 : 
                              instruction.toLowerCase().includes('smaller') ? 0.7 : 1.2;
        updatedModel.meshData = {
          ...updatedModel.meshData,
          sizeChange: instruction,
          sizeMultiplier,
          appliedAt: new Date().toISOString()
        };
        toast({
          title: "Size Changed!",
          description: `Applied size change: ${instruction}`,
        });
      }
      
      updateGeneratedModel(updatedModel);
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
      ]
    };
  };

  const showManipulationTools = capturedImages.length === 0 || generatedModel;

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
                  isLoading={llmLoading}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full font-semibold text-xs">
                  3
                </span>
                <CompactPrintingValidation
                  onValidate={handlePrintingValidation}
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

      {generatedModel && !isLoading && (
        <ModelPropertyEditor
          generatedModel={generatedModel}
          onModelUpdate={updateGeneratedModel}
        />
      )}
    </div>
  );
};

export default ModelViewer3D;
