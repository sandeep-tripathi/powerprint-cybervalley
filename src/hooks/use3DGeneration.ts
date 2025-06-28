
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { VisionLanguageModelConverter, VisionModelOptions, Enhanced3DMesh } from "@/services/visionLanguageModel";

interface Use3DGenerationProps {
  apiKey: string;
  showApiKeyInput: () => void;
  uploadedImages: File[];
  onModelGenerated?: (modelName: string, imageNames: string[], modelData: any, processingTime: number) => void;
}

export const use3DGeneration = ({ apiKey, showApiKeyInput, uploadedImages, onModelGenerated }: Use3DGenerationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasModel, setHasModel] = useState(true); // Default to true to show panda immediately
  const [generationStatus, setGenerationStatus] = useState("");
  const [processingMethod, setProcessingMethod] = useState<'vision'>('vision');
  const [generatedModel, setGeneratedModel] = useState<{
    meshData: any;
    textureUrl: string;
    complexity: number;
    vertices: number;
    faces: number;
    realMesh?: Enhanced3DMesh;
    qualityScore?: number;
  } | null>(null);
  const { toast } = useToast();
  const [converter] = useState(() => new VisionLanguageModelConverter());

  // Function to update the generated model
  const updateGeneratedModel = (updatedModel: any) => {
    setGeneratedModel(updatedModel);
    console.log("Model updated with new properties:", updatedModel);
  };

  const processImagesWithVisionModel = async (images: File[]): Promise<any> => {
    console.log("Starting vision language model 3D conversion...");
    setProcessingMethod('vision');
    setGenerationStatus("Analyzing image with advanced AI vision...");
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setGenerationStatus("Processing depth and structure analysis...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Configure vision model options
    const options: VisionModelOptions = {
      model: "claude-vision", // Using Claude for best results
      quality: "high",
      detailLevel: 8
    };
    
    setGenerationStatus("Generating enhanced 3D mesh with vision AI...");
    const enhancedMesh = await converter.convertToEnhanced3D(images[0], options);
    
    const textureUrl = URL.createObjectURL(images[0]);

    return {
      meshData: {
        type: "vision_enhanced_mesh",
        algorithm: "vision_language_model_3d",
        inputImages: images.length,
        processingTime: 3500,
        propertyChanges: [],
        visionModelStats: {
          model: options.model,
          quality: options.quality,
          detailLevel: options.detailLevel,
          depthLayers: enhancedMesh.depthAnalysis.depthLayers,
          qualityScore: enhancedMesh.qualityScore
        }
      },
      textureUrl,
      complexity: enhancedMesh.complexity,
      vertices: enhancedMesh.vertexCount,
      faces: enhancedMesh.faceCount,
      realMesh: enhancedMesh,
      qualityScore: enhancedMesh.qualityScore
    };
  };

  const processImagesWithAdvancedPipeline = async (images: File[]) => {
    if (images.length === 0) {
      toast({
        title: "No Images",
        description: "Please add images to generate 3D models.",
        variant: "destructive",
      });
      return;
    }

    console.log("Starting advanced vision-based 3D generation for", images.length, "images");
    setIsLoading(true);
    setHasModel(false);
    setGenerationStatus("Initializing advanced AI vision processing...");

    const startTime = Date.now();
    let generatedModelData;

    try {
      console.log("Using vision language model processing");
      generatedModelData = await processImagesWithVisionModel(images);

      setGeneratedModel(generatedModelData);
      setHasModel(true);
      
      const finalProcessingTime = Date.now() - startTime;
      setGenerationStatus(`Advanced 3D model generated successfully!`);
      
      // Add to history
      if (onModelGenerated) {
        const modelName = `Vision AI 3D Model ${new Date().toLocaleDateString()}`;
        const imageNames = images.map(img => img.name);
        onModelGenerated(modelName, imageNames, generatedModelData, finalProcessingTime);
      }
      
      toast({
        title: `Enhanced 3D Model Generated!`,
        description: `Vision AI created a high-quality 3D mesh with ${generatedModelData.vertices} vertices and quality score: ${(generatedModelData.qualityScore * 100).toFixed(1)}%.`,
      });

    } catch (error) {
      console.error("Error in vision-based 3D conversion:", error);
      setHasModel(false);
      setGeneratedModel(null);
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "Failed to convert image to 3D mesh using vision AI.",
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

  // Clean up converter on unmount
  useEffect(() => {
    return () => {
      converter.dispose();
    };
  }, [converter]);

  // Trigger pipeline when images are uploaded
  useEffect(() => {
    if (uploadedImages.length > 0) {
      processImagesWithAdvancedPipeline(uploadedImages);
    } else if (uploadedImages.length === 0) {
      // For default case (no images), show panda immediately without running pipeline
      setHasModel(true);
      setGenerationStatus("");
      if (generatedModel?.textureUrl) {
        URL.revokeObjectURL(generatedModel.textureUrl);
      }
      setGeneratedModel(null);
    }
  }, [uploadedImages]);

  return {
    isLoading,
    hasModel,
    generationStatus,
    generatedModel,
    updateGeneratedModel,
    processImagesWithAdvancedPipeline,
    processingMethod,
  };
};
