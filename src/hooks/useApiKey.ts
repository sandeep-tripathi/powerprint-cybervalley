
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState(""); // Start empty for PowerPrint
  const [showApiInput, setShowApiInput] = useState(true); // Show by default since API key is required
  const { toast } = useToast();

  const updateApiKey = (newKey: string) => {
    setApiKey(newKey);
    if (newKey.trim()) {
      setShowApiInput(false);
      toast({
        title: "API Key Updated",
        description: "Your PowerPrint API key has been updated successfully!",
      });
    }
  };

  const showApiKeyInput = () => {
    setShowApiInput(true);
    toast({
      title: "PowerPrint API Key Required",
      description: "Please enter your PowerPrint API key to generate 3D models from camera images.",
      variant: "destructive",
    });
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
