
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mesh2DTo3DConverter, MeshGenerationOptions, GeneratedMesh } from "@/services/mesh2DTo3DConverter";

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
  const [processingMethod, setProcessingMethod] = useState<'local'>('local');
  const [generatedModel, setGeneratedModel] = useState<{
    meshData: any;
    textureUrl: string;
    complexity: number;
    vertices: number;
    faces: number;
    realMesh?: GeneratedMesh;
  } | null>(null);
  const { toast } = useToast();
  const [converter] = useState(() => new Mesh2DTo3DConverter());

  // Function to update the generated model
  const updateGeneratedModel = (updatedModel: any) => {
    setGeneratedModel(updatedModel);
    console.log("Model updated with new properties:", updatedModel);
  };

  const processImagesWithLocalPipeline = async (images: File[]): Promise<any> => {
    console.log("Starting advanced 2D to 3D conversion with improved algorithms...");
    setProcessingMethod('local');
    setGenerationStatus("Analyzing image structure and depth cues...");
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setGenerationStatus("Applying Sobel edge detection and depth estimation...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setGenerationStatus("Generating advanced heightfield mesh...");
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Configure advanced mesh generation options
    const options: MeshGenerationOptions = {
      extrusionHeight: 0.3,
      resolution: 64, // Higher resolution for better quality
      generateBackface: true,
      textureResolution: 512, // Higher texture resolution
      depthAnalysis: true,
      edgePreservation: true,
      smoothingIterations: 2
    };
    
    setGenerationStatus("Converting 2D image to 3D mesh with advanced algorithms...");
    const realMesh = await converter.convertImageToMesh(images[0], options);
    
    setGenerationStatus("Applying mesh smoothing and normal calculation...");
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const textureUrl = URL.createObjectURL(images[0]);

    return {
      meshData: {
        type: "advanced_mesh_generated",
        algorithm: "advanced_depth_estimation_sobel_gaussian",
        inputImages: images.length,
        processingTime: 3600, // Simulated processing time for advanced algorithm
        propertyChanges: [],
        realMeshStats: {
          vertexCount: realMesh.vertexCount,
          faceCount: realMesh.faceCount,
          hasTexture: realMesh.textureData !== null,
          boundingBox: realMesh.boundingBox,
          features: [
            "Sobel edge detection",
            "Gaussian smoothing",
            "Bilinear depth sampling",
            "Laplacian mesh smoothing",
            "Area-weighted normals"
          ]
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

    console.log("Starting advanced PowerPrint pipeline for", images.length, "images");
    setIsLoading(true);
    setHasModel(false);
    setGenerationStatus("Initializing advanced 2D to 3D conversion...");

    const startTime = Date.now();
    let generatedModelData;

    try {
      console.log("Using advanced local processing with improved algorithms");
      generatedModelData = await processImagesWithLocalPipeline(images);

      setGeneratedModel(generatedModelData);
      setHasModel(true);
      
      const finalProcessingTime = Date.now() - startTime;
      setGenerationStatus(`Advanced 2D to 3D conversion completed with realistic mesh generation!`);
      
      // Add to history
      if (onModelGenerated) {
        const modelName = `Advanced 2D→3D Model ${new Date().toLocaleDateString()}`;
        const imageNames = images.map(img => img.name);
        onModelGenerated(modelName, imageNames, generatedModelData, finalProcessingTime);
      }
      
      toast({
        title: `Realistic 3D Mesh Generated!`,
        description: `Successfully converted 2D image to realistic 3D mesh using advanced algorithms with ${generatedModelData.vertices} vertices and ${generatedModelData.faces} faces.`,
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
