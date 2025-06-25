
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
    console.log("Starting local 2D to 3D conversion...");
    setProcessingMethod('local');
    setGenerationStatus("Analyzing image structure...");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setGenerationStatus("Creating local 3D extrusion...");
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Configure local mesh generation options
    const options: MeshGenerationOptions = {
      extrusionHeight: 0.2,
      resolution: 32,
      generateBackface: true,
      textureResolution: 256
    };
    
    setGenerationStatus("Converting 2D image to 3D mesh locally...");
    const realMesh = await converter.convertImageToMesh(images[0], options);
    
    const textureUrl = URL.createObjectURL(images[0]);

    return {
      meshData: {
        type: "local_mesh_generated",
        algorithm: "local_2d_to_3d_extrusion",
        inputImages: images.length,
        processingTime: 2000, // Simulated processing time
        propertyChanges: [],
        realMeshStats: {
          vertexCount: realMesh.vertexCount,
          faceCount: realMesh.faceCount,
          hasTexture: realMesh.textureData !== null,
          boundingBox: realMesh.boundingBox
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
    setGenerationStatus("Initializing 2D to 3D conversion...");

    const startTime = Date.now();
    let generatedModelData;

    try {
      console.log("Using local processing");
      generatedModelData = await processImagesWithLocalPipeline(images);

      setGeneratedModel(generatedModelData);
      setHasModel(true);
      
      const finalProcessingTime = Date.now() - startTime;
      setGenerationStatus(`2D to 3D conversion completed using ${processingMethod} processing!`);
      
      // Add to history
      if (onModelGenerated) {
        const modelName = `Local 2D→3D Model ${new Date().toLocaleDateString()}`;
        const imageNames = images.map(img => img.name);
        onModelGenerated(modelName, imageNames, generatedModelData, finalProcessingTime);
      }
      
      toast({
        title: `3D Mesh Generated with Local Processing!`,
        description: `Successfully converted 2D image to 3D mesh with ${generatedModelData.vertices} vertices and ${generatedModelData.faces} faces.`,
      });

    } catch (error) {
      console.error("Error in 2D to 3D conversion:", error);
      setHasModel(false);
      setGeneratedModel(null);
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "Failed to convert 2D image to 3D mesh.",
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
