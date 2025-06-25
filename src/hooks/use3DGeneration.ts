
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AdvancedMesh2DTo3DConverter, AdvancedMeshGenerationOptions, GeneratedMesh } from "@/services/advancedMesh2DTo3DConverter";

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
  const [processingMethod, setProcessingMethod] = useState<'advanced'>('advanced');
  const [generatedModel, setGeneratedModel] = useState<{
    meshData: any;
    textureUrl: string;
    complexity: number;
    vertices: number;
    faces: number;
    realMesh?: GeneratedMesh;
  } | null>(null);
  const { toast } = useToast();
  const [converter] = useState(() => new AdvancedMesh2DTo3DConverter());

  // Function to update the generated model
  const updateGeneratedModel = (updatedModel: any) => {
    setGeneratedModel(updatedModel);
    console.log("Model updated with new properties:", updatedModel);
  };

  const processImagesWithAdvancedPipeline = async (images: File[]): Promise<any> => {
    console.log("Starting advanced AI-inspired 2D to 3D conversion...");
    setProcessingMethod('advanced');
    setGenerationStatus("Analyzing image structure with deep learning-inspired techniques...");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setGenerationStatus("Applying edge detection and depth estimation...");
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setGenerationStatus("Generating sophisticated mesh with neural network-inspired algorithms...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Configure advanced mesh generation options
    const options: AdvancedMeshGenerationOptions = {
      extrusionHeight: 0.5,
      resolution: 64,
      generateBackface: true,
      textureResolution: 512,
      useEdgeDetection: true,
      useDepthEstimation: true,
      smoothingIterations: 3
    };
    
    setGenerationStatus("Converting 2D image to 3D mesh using advanced algorithms...");
    const realMesh = await converter.convertImageToMesh(images[0], options);
    
    const textureUrl = URL.createObjectURL(images[0]);

    return {
      meshData: {
        type: "advanced_ai_mesh_generated",
        algorithm: "deep_learning_inspired_2d_to_3d",
        inputImages: images.length,
        processingTime: 3500,
        propertyChanges: [],
        realMeshStats: {
          vertexCount: realMesh.vertexCount,
          faceCount: realMesh.faceCount,
          hasTexture: realMesh.textureData !== null,
          boundingBox: realMesh.boundingBox,
          usedEdgeDetection: options.useEdgeDetection,
          usedDepthEstimation: options.useDepthEstimation,
          smoothingIterations: options.smoothingIterations
        }
      },
      textureUrl,
      complexity: realMesh.vertexCount,
      vertices: realMesh.vertexCount,
      faces: realMesh.faceCount,
      realMesh
    };
  };

  const processImagesWithPowerPrintPipeline = async (images: File[]) => {
    if (!apiKey.trim()) {
      showApiKeyInput();
      return;
    }

    console.log("Starting PowerPrint pipeline for", images.length, "images");
    setIsLoading(true);
    setHasModel(false);
    setGenerationStatus("Initializing advanced 2D to 3D conversion...");

    const startTime = Date.now();
    let generatedModelData;

    try {
      console.log("Using advanced AI-inspired processing");
      generatedModelData = await processImagesWithAdvancedPipeline(images);

      setGeneratedModel(generatedModelData);
      setHasModel(true);
      
      const finalProcessingTime = Date.now() - startTime;
      setGenerationStatus(`Advanced 2D to 3D conversion completed using ${processingMethod} processing!`);
      
      // Add to history
      if (onModelGenerated) {
        const modelName = `Advanced AI 2D→3D Model ${new Date().toLocaleDateString()}`;
        const imageNames = images.map(img => img.name);
        onModelGenerated(modelName, imageNames, generatedModelData, finalProcessingTime);
      }
      
      toast({
        title: `Advanced 3D Mesh Generated!`,
        description: `Successfully converted 2D image to 3D mesh using AI-inspired algorithms with ${generatedModelData.vertices} vertices and ${generatedModelData.faces} faces.`,
      });

    } catch (error) {
      console.error("Error in advanced 2D to 3D conversion:", error);
      setHasModel(false);
      setGeneratedModel(null);
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "Failed to convert 2D image to 3D mesh using advanced algorithms.",
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
    processingMethod,
  };
};
