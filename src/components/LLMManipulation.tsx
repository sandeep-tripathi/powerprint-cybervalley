
import { useState } from "react";
import { MessageSquare, Wand2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface LLMManipulationProps {
  onManipulate: (instruction: string) => Promise<void>;
  isLoading?: boolean;
}

const LLMManipulation = ({ onManipulate, isLoading = false }: LLMManipulationProps) => {
  const [instruction, setInstruction] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!instruction.trim()) {
      toast({
        title: "No instruction provided",
        description: "Please enter an instruction for the LLM to manipulate the 3D model.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onManipulate(instruction);
      setInstruction("");
      toast({
        title: "Model manipulation complete",
        description: "The 3D model has been modified according to your instructions.",
      });
    } catch (error) {
      toast({
        title: "Manipulation failed",
        description: "Failed to manipulate the 3D model. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <MessageSquare className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">LLM Model Manipulation</h3>
      </div>
      
      <div className="space-y-3">
        <Textarea
          placeholder="Describe how you want to modify the 3D model (e.g., 'Make the ring thicker', 'Add decorative patterns', 'Scale it up by 50%')"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          rows={3}
          disabled={isLoading}
        />
        
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !instruction.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Apply LLM Manipulation
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LLMManipulation;
