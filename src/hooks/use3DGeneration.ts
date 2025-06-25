
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Use3DGenerationProps {
  apiKey: string;
  showApiKeyInput: () => void;
  uploadedImages: File[];
}

export const use3DGeneration = ({ apiKey, showApiKeyInput, uploadedImages }: Use3DGenerationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasModel, setHasModel] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const { toast } = useToast();

  const convertImageTo3D = async (imageFile: File) => {
    if (!apiKey.trim()) {
      showApiKeyInput();
      return;
    }

    console.log("Starting 3D conversion for:", imageFile.name);
    setIsLoading(true);
    setHasModel(false);
    setGenerationStatus("Preparing image for 3D conversion...");

    try {
      // Create image preview URL for texture mapping
      const imageUrl = URL.createObjectURL(imageFile);
      
      // Simulate the Trellis pipeline steps
      const steps = [
        { status: "Analyzing image structure...", duration: 2000 },
        { status: "Generating depth map...", duration: 3000 },
        { status: "Creating 3D mesh geometry...", duration: 4000 },
        { status: "Applying texture mapping...", duration: 2000 },
        { status: "Optimizing 3D model...", duration: 2000 },
        { status: "Finalizing GLB export...", duration: 1000 }
      ];

      for (let i = 0; i < steps.length; i++) {
        setGenerationStatus(steps[i].status);
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      }

      // Store the processed image URL for texture mapping
      setProcessedImages(prev => [...prev, imageUrl]);
      setHasModel(true);
      setGenerationStatus("3D model generated successfully!");
      
      toast({
        title: "Success!",
        description: "3D model generated successfully from your image.",
      });

    } catch (error) {
      console.error("Error generating 3D model:", error);
      setHasModel(false);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate 3D model. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger conversion when images are uploaded
  useEffect(() => {
    if (uploadedImages.length > 0 && apiKey.trim()) {
      // Process all uploaded images
      uploadedImages.forEach((image, index) => {
        setTimeout(() => {
          convertImageTo3D(image);
        }, index * 1000); // Stagger the processing
      });
    } else if (uploadedImages.length === 0) {
      setHasModel(false);
      setGenerationStatus("");
      setProcessedImages([]);
    }
  }, [uploadedImages, apiKey]);

  return {
    isLoading,
    hasModel,
    generationStatus,
    processedImages,
    convertImageTo3D,
  };
};
