
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Use3DGenerationProps {
  apiKey: string;
  showApiKeyInput: () => void;
  uploadedImages: File[];
  onModelGenerated?: (modelName: string, imageNames: string[], modelData: any, processingTime: number) => void;
}

export const use3DGeneration = ({ apiKey, showApiKeyInput, uploadedImages, onModelGenerated }: Use3DGenerationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasModel, setHasModel] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [generatedModel, setGeneratedModel] = useState<{
    meshData: any;
    textureUrl: string;
    complexity: number;
    vertices: number;
    faces: number;
  } | null>(null);
  const { toast } = useToast();

  // Function to update the generated model
  const updateGeneratedModel = (updatedModel: any) => {
    setGeneratedModel(updatedModel);
    console.log("Model updated with new properties:", updatedModel);
  };

  const processImagesWithPowerPrintPipeline = async (images: File[]) => {
    if (!apiKey.trim()) {
      showApiKeyInput();
      return;
    }

    console.log("Starting PowerPrint pipeline for", images.length, "images");
    setIsLoading(true);
    setHasModel(false);
    setGenerationStatus("Initializing PowerPrint pipeline...");

    const startTime = Date.now();

    try {
      // Simulate the advanced PowerPrint pipeline processing
      const pipelineSteps = [
        { status: "Loading PowerPrint model weights...", duration: 1500 },
        { status: "Processing multi-view image analysis...", duration: 2500 },
        { status: "Extracting depth information and normal maps...", duration: 3000 },
        { status: "Generating 3D Gaussian splatting representation...", duration: 3500 },
        { status: "Converting to structured mesh geometry...", duration: 2500 },
        { status: "Optimizing topology and UV mapping...", duration: 2000 },
        { status: "Applying advanced texture synthesis...", duration: 1500 },
        { status: "Post-processing and quality enhancement...", duration: 1000 }
      ];

      for (let i = 0; i < pipelineSteps.length; i++) {
        setGenerationStatus(pipelineSteps[i].status);
        await new Promise(resolve => setTimeout(resolve, pipelineSteps[i].duration));
      }

      // Use the first uploaded image as the texture
      const mainImage = images[0];
      const textureUrl = URL.createObjectURL(mainImage);

      // Generate model data based on the pipeline processing
      const modelComplexity = Math.min(images.length * 1000 + 2000, 8000);
      const vertices = Math.floor(modelComplexity * 0.8);
      const faces = Math.floor(modelComplexity * 0.6);
      const processingTime = Date.now() - startTime;

      const generatedModelData = {
        meshData: {
          // Simulated mesh data that would come from PowerPrint
          type: "powerprint_generated",
          algorithm: "gaussian_splatting_to_mesh",
          inputImages: images.length,
          processingTime,
          propertyChanges: [] // Initialize empty array for property changes
        },
        textureUrl,
        complexity: modelComplexity,
        vertices,
        faces
      };

      setGeneratedModel(generatedModelData);
      setHasModel(true);
      setGenerationStatus("PowerPrint pipeline completed successfully!");
      
      // Add to history
      if (onModelGenerated) {
        const modelName = `PowerPrint Model ${new Date().toLocaleDateString()}`;
        const imageNames = images.map(img => img.name);
        onModelGenerated(modelName, imageNames, generatedModelData, processingTime);
      }
      
      toast({
        title: "3D Model Generated!",
        description: `Generated high-quality 3D model with ${vertices.toLocaleString()} vertices using PowerPrint pipeline.`,
      });

    } catch (error) {
      console.error("Error in PowerPrint pipeline:", error);
      setHasModel(false);
      setGeneratedModel(null);
      toast({
        title: "Pipeline Failed",
        description: error instanceof Error ? error.message : "Failed to generate 3D model using PowerPrint pipeline.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up texture URLs when images change
  useEffect(() => {
    return () => {
      if (generatedModel?.textureUrl) {
        URL.revokeObjectURL(generatedModel.textureUrl);
      }
    };
  }, [uploadedImages]);

  // Trigger pipeline when images are uploaded
  useEffect(() => {
    if (uploadedImages.length > 0 && apiKey.trim()) {
      processImagesWithPowerPrintPipeline(uploadedImages);
    } else if (uploadedImages.length === 0) {
      setHasModel(false);
      setGenerationStatus("");
      if (generatedModel?.textureUrl) {
        URL.revokeObjectURL(generatedModel.textureUrl);
      }
      setGeneratedModel(null);
    }
  }, [uploadedImages, apiKey]);

  return {
    isLoading,
    hasModel,
    generationStatus,
    generatedModel,
    updateGeneratedModel,
    processImagesWithPowerPrintPipeline,
  };
};
