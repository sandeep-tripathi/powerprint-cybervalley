
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PowerPrintService, PowerPrintTask } from "@/services/meshyAiService";

interface UsePowerPrint3DGenerationProps {
  apiKey: string;
  showApiKeyInput: () => void;
  capturedImages: File[];
  onModelGenerated?: (modelName: string, imageNames: string[], modelData: any, processingTime: number) => void;
}

export const usePowerPrint3DGeneration = ({ 
  apiKey, 
  showApiKeyInput, 
  capturedImages, 
  onModelGenerated 
}: UsePowerPrint3DGenerationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasModel, setHasModel] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedModel, setGeneratedModel] = useState<{
    meshData: any;
    textureUrl: string;
    complexity: number;
    vertices: number;
    faces: number;
    modelUrls?: {
      glb: string;
      fbx: string;
      usdz: string;
      obj: string;
      mtl: string;
    };
    thumbnailUrl?: string;
    videoUrl?: string;
  } | null>(null);
  const { toast } = useToast();

  const updateGeneratedModel = (updatedModel: any) => {
    setGeneratedModel(updatedModel);
    console.log("Model updated with new properties:", updatedModel);
  };

  const processImagesWithPowerPrint = async (images: File[]) => {
    if (!apiKey.trim()) {
      showApiKeyInput();
      return;
    }

    if (images.length === 0) {
      toast({
        title: "No Images",
        description: "Please capture an image first.",
        variant: "destructive",
      });
      return;
    }

    console.log("Starting PowerPrint 3D generation for", images.length, "images");
    setIsLoading(true);
    setHasModel(false);
    setGenerationStatus("Initializing PowerPrint conversion...");
    setGenerationProgress(0);

    const startTime = Date.now();

    try {
      const powerPrintService = new PowerPrintService(apiKey);
      
      // Use the first captured image for 3D generation
      const imageFile = images[0];
      setGenerationStatus("Uploading image to PowerPrint...");
      
      const taskId = await powerPrintService.createImageTo3DTask(imageFile);
      console.log("PowerPrint task created:", taskId);
      
      setGenerationStatus("Generating 3D mesh...");
      
      const completedTask = await powerPrintService.waitForCompletion(
        taskId,
        (progress) => {
          setGenerationProgress(progress);
          setGenerationStatus(`Generating 3D mesh... ${progress}%`);
        }
      );

      console.log("PowerPrint generation completed:", completedTask);

      if (!completedTask.result) {
        throw new Error("No result from PowerPrint");
      }

      // Create model data structure
      const modelData = {
        meshData: {
          type: "powerprint_generated",
          algorithm: "powerprint_image_to_3d",
          inputImages: images.length,
          processingTime: Date.now() - startTime,
          taskId: completedTask.id,
          propertyChanges: [],
        },
        textureUrl: completedTask.result.thumbnail_url,
        complexity: 30000, // Target polycount
        vertices: 30000,
        faces: 60000,
        modelUrls: completedTask.result.model_urls,
        thumbnailUrl: completedTask.result.thumbnail_url,
        videoUrl: completedTask.result.video_url,
      };

      setGeneratedModel(modelData);
      setHasModel(true);
      
      const finalProcessingTime = Date.now() - startTime;
      setGenerationStatus(`3D mesh generated successfully with PowerPrint!`);
      setGenerationProgress(100);
      
      // Add to history
      if (onModelGenerated) {
        const modelName = `PowerPrint Model ${new Date().toLocaleDateString()}`;
        const imageNames = images.map(img => img.name);
        onModelGenerated(modelName, imageNames, modelData, finalProcessingTime);
      }
      
      toast({
        title: "3D Mesh Generated!",
        description: `Successfully generated 3D model using PowerPrint in ${(finalProcessingTime / 1000).toFixed(1)} seconds.`,
      });

    } catch (error) {
      console.error("Error in PowerPrint 3D generation:", error);
      setHasModel(false);
      setGeneratedModel(null);
      setGenerationProgress(0);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate 3D mesh with PowerPrint.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up texture URLs when images change
  useEffect(() => {
    return () => {
      if (generatedModel?.textureUrl && generatedModel.textureUrl.startsWith('blob:')) {
        URL.revokeObjectURL(generatedModel.textureUrl);
      }
    };
  }, [capturedImages]);

  // Trigger generation when images are captured
  useEffect(() => {
    if (capturedImages.length > 0 && apiKey.trim()) {
      processImagesWithPowerPrint(capturedImages);
    } else if (capturedImages.length === 0) {
      setHasModel(false);
      setGenerationStatus("");
      setGenerationProgress(0);
      if (generatedModel?.textureUrl && generatedModel.textureUrl.startsWith('blob:')) {
        URL.revokeObjectURL(generatedModel.textureUrl);
      }
      setGeneratedModel(null);
    }
  }, [capturedImages, apiKey]);

  return {
    isLoading,
    hasModel,
    generationStatus,
    generationProgress,
    generatedModel,
    updateGeneratedModel,
    processImagesWithPowerPrint,
  };
};
