
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

  const handleQuickSuggestion = async (suggestion: string) => {
    setInstruction(suggestion);
    // Immediately apply the suggestion
    await onManipulate(suggestion, manipulationType);
    setInstruction("");
    setShowDialog(false);
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
          <div className="bg-white p-8 rounded-xl max-w-lg w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-gray-900">AI Model Manipulation</h3>
            
            {/* Type Selection */}
            <div className="flex space-x-3 mb-6">
              <button
                onClick={() => setManipulationType('color')}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all ${
                  manipulationType === 'color' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Palette className="w-5 h-5 mr-2" />
                Color Changes
              </button>
              <button
                onClick={() => setManipulationType('size')}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all ${
                  manipulationType === 'size' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Ruler className="w-5 h-5 mr-2" />
                Size Changes
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick suggestions:</h4>
              <div className="flex flex-wrap gap-2">
                {(manipulationType === 'color' ? colorSuggestions : sizeSuggestions).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="text-sm bg-gray-50 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-200 px-3 py-2 rounded-lg transition-colors text-black"
                    disabled={isLoading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Describe your changes:
              </label>
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder={`Tell me how you want to change the ${manipulationType}...\n\nExample: "${manipulationType === 'color' ? 'Make it bright red with gold accents and a metallic finish' : 'Make it 3 times bigger and add more detail'}"`}
                className="w-full h-24 p-4 border border-gray-300 rounded-lg resize-none text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleSubmit}
                disabled={!instruction.trim() || isLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 py-3"
              >
                {isLoading ? "Processing..." : "Apply Changes"}
              </Button>
              <Button
                onClick={() => setShowDialog(false)}
                variant="outline"
                className="flex-1 py-3"
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
