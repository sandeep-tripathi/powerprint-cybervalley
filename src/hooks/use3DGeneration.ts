
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
  const { toast } = useToast();

  const convertImageTo3D = async (imageFile: File) => {
    if (!apiKey.trim()) {
      showApiKeyInput();
      return;
    }

    console.log("Starting 3D conversion for:", imageFile.name);
    setIsLoading(true);
    setHasModel(false);
    setGenerationStatus("Uploading image...");

    try {
      // Step 1: Create image to 3D task
      const formData = new FormData();
      formData.append('image_file', imageFile);
      formData.append('enable_pbr', 'true');

      console.log("Sending request to PowerPrint API...");
      setGenerationStatus("Creating 3D generation task...");

      const response = await fetch('https://api.powerprint.ai/v2/image-to-3d', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error:", response.status, errorData);
        throw new Error(`API Error: ${response.status} - ${errorData}`);
      }

      const taskData = await response.json();
      console.log("Task created:", taskData);
      setGenerationStatus("Processing 3D model...");

      // Step 2: Poll for completion
      const taskId = taskData.result;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max

      const pollStatus = async (): Promise<any> => {
        attempts++;
        console.log(`Polling attempt ${attempts}/${maxAttempts}`);
        
        const statusResponse = await fetch(`https://api.powerprint.ai/v2/image-to-3d/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });

        if (!statusResponse.ok) {
          throw new Error(`Status check failed: ${statusResponse.status}`);
        }

        const statusData = await statusResponse.json();
        console.log("Status:", statusData);

        if (statusData.status === 'SUCCEEDED') {
          return statusData;
        } else if (statusData.status === 'FAILED') {
          throw new Error('3D generation failed');
        } else if (attempts >= maxAttempts) {
          throw new Error('Generation timeout');
        } else {
          // Wait 5 seconds before next poll
          setGenerationStatus(`Processing... (${attempts}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 5000));
          return pollStatus();
        }
      };

      const finalResult = await pollStatus();
      console.log("Generation completed:", finalResult);

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
      // Use the first uploaded image
      convertImageTo3D(uploadedImages[0]);
    } else if (uploadedImages.length === 0) {
      setHasModel(false);
      setGenerationStatus("");
    }
  }, [uploadedImages, apiKey]);

  return {
    isLoading,
    hasModel,
    generationStatus,
    convertImageTo3D,
  };
};
