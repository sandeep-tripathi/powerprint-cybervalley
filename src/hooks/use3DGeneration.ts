
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mesh2DTo3DConverter, MeshGenerationOptions, GeneratedMesh } from "@/services/mesh2DTo3DConverter";
import { ColabIntegrationService, ColabProcessingRequest } from "@/services/colabIntegration";

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
  const [processingMethod, setProcessingMethod] = useState<'colab' | 'local'>('local');
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
  const [colabService] = useState(() => new ColabIntegrationService());

  // Function to update the generated model
  const updateGeneratedModel = (updatedModel: any) => {
    setGeneratedModel(updatedModel);
    console.log("Model updated with new properties:", updatedModel);
  };

  const processImagesWithColab = async (images: File[]): Promise<any> => {
    console.log("Starting Colab-based 2D to 3D conversion...");
    setProcessingMethod('colab');
    setGenerationStatus("Connecting to Google Colab...");

    // Convert images to base64
    const base64Images = await colabService.convertImagesToBase64(images);
    
    const request: ColabProcessingRequest = {
      images: base64Images,
      processingOptions: {
        extrusionHeight: 0.2,
        resolution: 64, // Higher resolution for Colab
        generateBackface: true,
        textureResolution: 512
      }
    };

    setGenerationStatus("Sending images to Colab for processing...");
    const response = await colabService.processImagesWithColab(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Colab processing failed');
    }

    setGenerationStatus("Processing results from Colab...");
    
    // Convert Colab response to our mesh format
    const realMesh: GeneratedMesh = {
      vertices: new Float32Array(response.meshData!.vertices),
      faces: new Uint32Array(response.meshData!.faces),
      normals: new Float32Array(response.meshData!.normals),
      uvCoordinates: new Float32Array(response.meshData!.uvCoordinates),
      textureData: null, // Will be set from base64 if available
      vertexCount: response.meshData!.vertices.length / 3,
      faceCount: response.meshData!.faces.length / 3,
      boundingBox: response.meshData!.boundingBox
    };

    // Handle texture data if provided
    let textureUrl = '';
    if (response.textureData) {
      const blob = await fetch(`data:image/png;base64,${response.textureData}`).then(r => r.blob());
      textureUrl = URL.createObjectURL(blob);
    } else {
      // Fallback to original image
      textureUrl = URL.createObjectURL(images[0]);
    }

    return {
      meshData: {
        type: "colab_mesh_generated",
        algorithm: "colab_2d_to_3d_advanced",
        inputImages: images.length,
        processingTime: response.processingTime || 0,
        propertyChanges: [],
        realMeshStats: {
          vertexCount: realMesh.vertexCount,
          faceCount: realMesh.faceCount,
          hasTexture: response.textureData !== null,
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
      // Check if Colab is available and enabled
      const colabConfig = colabService.getConfig();
      const useColab = colabConfig.enabled && await colabService.isColabAvailable();
      
      if (useColab) {
        console.log("Using Google Colab for processing");
        try {
          generatedModelData = await processImagesWithColab(images);
        } catch (colabError) {
          console.warn("Colab processing failed:", colabError);
          
          if (colabConfig.fallbackToLocal) {
            console.log("Falling back to local processing");
            toast({
              title: "Colab Unavailable",
              description: "Falling back to local processing...",
              variant: "default",
            });
            generatedModelData = await processImagesWithLocalPipeline(images);
          } else {
            throw colabError;
          }
        }
      } else {
        console.log("Using local processing");
        generatedModelData = await processImagesWithLocalPipeline(images);
      }

      setGeneratedModel(generatedModelData);
      setHasModel(true);
      
      const finalProcessingTime = Date.now() - startTime;
      setGenerationStatus(`2D to 3D conversion completed using ${processingMethod} processing!`);
      
      // Add to history
      if (onModelGenerated) {
        const modelName = `${processingMethod === 'colab' ? 'Colab' : 'Local'} 2D→3D Model ${new Date().toLocaleDateString()}`;
        const imageNames = images.map(img => img.name);
        onModelGenerated(modelName, imageNames, generatedModelData, finalProcessingTime);
      }
      
      toast({
        title: `3D Mesh Generated with ${processingMethod === 'colab' ? 'Google Colab' : 'Local Processing'}!`,
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
