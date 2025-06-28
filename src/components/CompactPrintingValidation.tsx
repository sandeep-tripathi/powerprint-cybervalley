
import { useState } from "react";
import { Shield, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  recommendations: string[];
}

interface CompactPrintingValidationProps {
  onValidate: () => Promise<ValidationResult>;
  isLoading?: boolean;
}

const CompactPrintingValidation = ({ onValidate, isLoading = false }: CompactPrintingValidationProps) => {
  const [validating, setValidating] = useState(false);
  const [showResults, setShowResults] = useState(false);
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
            <p>Validate your 3D model for printing compatibility</p>
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

            <Button
              onClick={() => setShowResults(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CompactPrintingValidation;
