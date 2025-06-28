
import { useState } from "react";
import { Shield, CheckCircle, Settings, Printer } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  recommendations: string[];
  optimizations?: string[];
}

interface CompactPrintingValidationProps {
  onValidate: () => Promise<ValidationResult>;
  onOptimize?: (instruction: string) => Promise<void>;
  isLoading?: boolean;
}

const CompactPrintingValidation = ({ onValidate, onOptimize, isLoading = false }: CompactPrintingValidationProps) => {
  const [validating, setValidating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showOptimizeDialog, setShowOptimizeDialog] = useState(false);
  const [optimizeInstruction, setOptimizeInstruction] = useState("");
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const { toast } = useToast();

  const handleValidation = async () => {
    setValidating(true);
    try {
      const result = await onValidate();
      setValidationResult(result);
      setShowResults(true);
      
      if (result.isValid) {
        toast({
          title: "Model is print-ready!",
          description: "Your 3D model passed all validation checks.",
        });
      } else {
        toast({
          title: "Validation issues found",
          description: "Please review the validation results.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Validation failed",
        description: "Failed to validate the 3D model for printing.",
        variant: "destructive",
      });
    } finally {
      setValidating(false);
    }
  };

  const handleOptimize = async () => {
    if (optimizeInstruction.trim() && onOptimize) {
      await onOptimize(optimizeInstruction);
      setOptimizeInstruction("");
      setShowOptimizeDialog(false);
      toast({
        title: "Model optimized!",
        description: "Your 3D model has been optimized for printing.",
      });
    }
  };

  const optimizationSuggestions = [
    "Optimize for minimal support structures",
    "Increase wall thickness for durability",
    "Reduce overhangs and bridges",
    "Optimize orientation for printing"
  ];

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleValidation}
              disabled={validating || isLoading}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {validating ? (
                <Shield className="w-4 h-4 mr-1 animate-pulse" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-1" />
              )}
              3D Print Validation
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Validate and optimize your 3D model for printing compatibility</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Results Modal */}
      {showResults && validationResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Validation Results</h3>
            
            <div className={`flex items-center space-x-2 p-3 rounded-lg mb-4 ${
              validationResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              {validationResult.isValid ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Shield className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${
                validationResult.isValid ? 'text-green-800' : 'text-red-800'
              }`}>
                {validationResult.isValid ? 'Print Ready' : 'Issues Found'}
              </span>
            </div>

            {validationResult.errors.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-red-800 mb-2">Errors</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.warnings.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-yellow-800 mb-2">Warnings</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.recommendations.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {validationResult.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex space-x-2">
              {onOptimize && (
                <Button
                  onClick={() => setShowOptimizeDialog(true)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Optimize
                </Button>
              )}
              <Button
                onClick={() => setShowResults(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Optimization Dialog */}
      {showOptimizeDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Optimize for 3D Printing</h3>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick optimizations:</h4>
              <div className="flex flex-wrap gap-2">
                {optimizationSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setOptimizeInstruction(suggestion)}
                    className="text-sm bg-gray-50 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-200 px-3 py-2 rounded-lg transition-colors text-black"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Custom optimization:
              </label>
              <textarea
                value={optimizeInstruction}
                onChange={(e) => setOptimizeInstruction(e.target.value)}
                placeholder="Describe how you want to optimize the model for 3D printing..."
                className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleOptimize}
                disabled={!optimizeInstruction.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Printer className="w-4 h-4 mr-1" />
                Apply Optimization
              </Button>
              <Button
                onClick={() => setShowOptimizeDialog(false)}
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

export default CompactPrintingValidation;
