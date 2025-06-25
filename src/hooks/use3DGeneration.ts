
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

  const processImagesWithPowerPrintPipeline = async (images: File[]) => {
    if (!apiKey.trim()) {
      showApiKeyInput();
      return;
    }

    console.log("Starting simple PowerPrint pipeline for", images.length, "images");
    setIsLoading(true);
    setHasModel(false);
    setGenerationStatus("Initializing simple 2D to 3D conversion...");

    const startTime = Date.now();

    try {
      const mainImage = images[0];
      
      setGenerationStatus("Analyzing image structure...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGenerationStatus("Creating simple 3D extrusion...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Configure simple mesh generation options
      const options: MeshGenerationOptions = {
        extrusionHeight: 0.2, // Simple extrusion height
        resolution: 32, // Low resolution for simplicity
        generateBackface: true, // Create solid object
        textureResolution: 256 // Basic texture quality
      };
      
      setGenerationStatus("Converting 2D image to simple 3D mesh...");
      const realMesh = await converter.convertImageToMesh(mainImage, options);
      
      setGenerationStatus("Finalizing simple 3D model...");
      await new Promise(resolve => setTimeout(resolve, 400));

      // Use the first uploaded image as the texture
      const textureUrl = URL.createObjectURL(mainImage);
      const processingTime = Date.now() - startTime;

      const generatedModelData = {
        meshData: {
          type: "simple_mesh_generated",
          algorithm: "simple_2d_to_3d_extrusion",
          inputImages: images.length,
          processingTime,
          propertyChanges: [], // Initialize empty array for property changes
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
        realMesh // Include the actual mesh data
      };

      setGeneratedModel(generatedModelData);
      setHasModel(true);
      setGenerationStatus("Simple 2D to 3D conversion completed!");
      
      // Add to history
      if (onModelGenerated) {
        const modelName = `Simple 2D→3D Model ${new Date().toLocaleDateString()}`;
        const imageNames = images.map(img => img.name);
        onModelGenerated(modelName, imageNames, generatedModelData, processingTime);
      }
      
      toast({
        title: "Simple 3D Mesh Generated!",
        description: `Successfully converted 2D image to simple 3D mesh with ${realMesh.vertexCount} vertices and ${realMesh.faceCount} faces.`,
      });

    } catch (error) {
      console.error("Error in simple 2D to 3D conversion:", error);
      setHasModel(false);
      setGeneratedModel(null);
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "Failed to convert 2D image to simple 3D mesh.",
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
  };
};
