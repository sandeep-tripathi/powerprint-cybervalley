
import { useState } from "react";
import { Wand2 } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface CompactModelManipulationProps {
  onManipulate: (instruction: string) => Promise<void>;
  isLoading?: boolean;
}

const CompactModelManipulation = ({ onManipulate, isLoading = false }: CompactModelManipulationProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [instruction, setInstruction] = useState("");

  const handleClick = () => {
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (instruction.trim()) {
      await onManipulate(instruction);
      setInstruction("");
      setShowDialog(false);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleClick}
              disabled={isLoading}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Wand2 className="w-4 h-4 mr-1" />
              Model Manipulation
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Use AI to modify the appearance and properties of your 3D model</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Dialog Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Model Manipulation</h3>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Describe how you want to modify the 3D model (e.g., 'Make it metallic gold', 'Change to blue color', 'Add texture')"
              className="w-full h-24 p-3 border rounded-lg resize-none"
              disabled={isLoading}
            />
            <div className="flex space-x-2 mt-4">
              <Button
                onClick={handleSubmit}
                disabled={!instruction.trim() || isLoading}
                className="flex-1"
              >
                {isLoading ? "Processing..." : "Apply Changes"}
              </Button>
              <Button
                onClick={() => setShowDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompactModelManipulation;
