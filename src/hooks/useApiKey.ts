
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState("vision-ai-enabled"); // Default to vision AI
  const [showApiInput, setShowApiInput] = useState(false); // Hide by default since vision AI is integrated
  const { toast } = useToast();

  const updateApiKey = (newKey: string) => {
    setApiKey(newKey);
    if (newKey.trim()) {
      setShowApiInput(false);
      toast({
        title: "Configuration Updated",
        description: "Using advanced vision language models for 3D generation!",
      });
    }
  };

  const showApiKeyInput = () => {
    // For vision AI, we don't need to show API input
    console.log("Using integrated vision AI models - no API key required");
  };

  return {
    apiKey,
    setApiKey,
    showApiInput,
    setShowApiInput,
    updateApiKey,
    showApiKeyInput,
  };
};
