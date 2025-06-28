
import { useState } from "react";
import { Shield, CheckCircle, XCircle, AlertTriangle, Printer } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface PrintingValidationProps {
  onValidate: () => Promise<ValidationResult>;
  isLoading?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  recommendations: string[];
}

const PrintingValidation = ({ onValidate, isLoading = false }: PrintingValidationProps) => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [validating, setValidating] = useState(false);
  const { toast } = useToast();

  const handleValidation = async () => {
    setValidating(true);
    try {
      const result = await onValidate();
      setValidationResult(result);
      
      if (result.isValid) {
        toast({
          title: "Model is print-ready!",
          description: "Your 3D model passed all validation checks.",
        });
      } else {
        toast({
          title: "Validation issues found",
          description: "Please review the validation results below.",
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
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Shield className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">3D Printing Validation</h3>
      </div>
      
      <Button
        onClick={handleValidation}
        disabled={validating || isLoading}
        className="w-full"
        variant="outline"
      >
        {validating ? (
          <>
            <Shield className="w-4 h-4 mr-2 animate-pulse" />
            Validating...
          </>
        ) : (
          <>
            <Printer className="w-4 h-4 mr-2" />
            Validate for 3D Printing
          </>
        )}
      </Button>

      {validationResult && (
        <div className="space-y-3">
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            validationResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            {validationResult.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-medium ${
              validationResult.isValid ? 'text-green-800' : 'text-red-800'
            }`}>
              {validationResult.isValid ? 'Print Ready' : 'Issues Found'}
            </span>
          </div>

          {validationResult.errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-red-800 flex items-center">
                <XCircle className="w-4 h-4 mr-1" />
                Errors
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {validationResult.errors.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validationResult.warnings.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-800 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Warnings
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {validationResult.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validationResult.recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Recommendations
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {validationResult.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PrintingValidation;
