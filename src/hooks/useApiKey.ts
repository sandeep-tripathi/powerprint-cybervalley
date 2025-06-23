
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState("pp_example123456789abcdefghijk");
  const [showApiInput, setShowApiInput] = useState(false);
  const { toast } = useToast();

  const updateApiKey = (newKey: string) => {
    setApiKey(newKey);
    if (newKey.trim()) {
      setShowApiInput(false);
      toast({
        title: "API Key Updated",
        description: "Your API key has been updated successfully!",
      });
    }
  };

  const showApiKeyInput = () => {
    setShowApiInput(true);
    toast({
      title: "API Key Required",
      description: "Please enter your PowerPrint API key to generate 3D models.",
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
