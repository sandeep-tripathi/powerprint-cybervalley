
import { useState } from "react";
import { Wand2, Palette, Ruler } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface CompactModelManipulationProps {
  onManipulate: (instruction: string, type: 'color' | 'size') => Promise<void>;
  isLoading?: boolean;
}

const CompactModelManipulation = ({ onManipulate, isLoading = false }: CompactModelManipulationProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [manipulationType, setManipulationType] = useState<'color' | 'size'>('color');

  const handleClick = () => {
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (instruction.trim()) {
      await onManipulate(instruction, manipulationType);
      setInstruction("");
      setShowDialog(false);
    }
  };

  const colorSuggestions = ["Make it red", "Change to blue", "Make it golden", "Turn it green"];
  const sizeSuggestions = ["Make it bigger", "Make it smaller", "Double the size", "Make it 50% smaller"];

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
              AI Manipulation
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Use AI to change the color and size of your 3D model</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Dialog Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">AI Model Manipulation</h3>
            
            {/* Type Selection */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setManipulationType('color')}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  manipulationType === 'color' 
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Palette className="w-4 h-4 mr-1" />
                Color
              </button>
              <button
                onClick={() => setManipulationType('size')}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  manipulationType === 'size' 
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Ruler className="w-4 h-4 mr-1" />
                Size
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {(manipulationType === 'color' ? colorSuggestions : sizeSuggestions).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInstruction(suggestion)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder={`Describe how you want to change the ${manipulationType} (e.g., '${manipulationType === 'color' ? 'Make it bright red with gold accents' : 'Make it 3 times bigger'}')`}
              className="w-full h-20 p-3 border rounded-lg resize-none text-sm"
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
