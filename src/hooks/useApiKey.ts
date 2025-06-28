
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState("free-algorithm"); // Default to free algorithm
  const [showApiInput, setShowApiInput] = useState(false); // Hide by default since no API key is needed
  const { toast } = useToast();

  const updateApiKey = (newKey: string) => {
    setApiKey(newKey);
    if (newKey.trim()) {
      setShowApiInput(false);
      toast({
        title: "Configuration Updated",
        description: "Using free 2D to 3D conversion algorithm!",
      });
    }
  };

  const showApiKeyInput = () => {
    // For free algorithm, we don't need to show API input
    console.log("Using free algorithm - no API key required");
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
