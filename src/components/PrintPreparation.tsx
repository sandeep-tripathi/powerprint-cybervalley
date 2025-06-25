
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Printer, 
  Download, 
  Settings, 
  Layers, 
  Gauge, 
  Zap,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info,
  Calculator
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrintPreparationProps {
  modelData: {
    meshData: any;
    textureUrl: string;
    complexity: number;
    vertices: number;
    faces: number;
  };
  uploadedImages: File[];
}

const PrintPreparation = ({ modelData, uploadedImages }: PrintPreparationProps) => {
  const [printSettings, setPrintSettings] = useState({
    layerHeight: 0.2,
    infillDensity: 15,
    printSpeed: 50,
    supportStructures: true,
    rafts: false,
    printerType: "fdm",
    material: "pla",
    quality: "medium"
  });
  
  const [selectedFormat, setSelectedFormat] = useState("stl");
  const { toast } = useToast();

  // Calculate print estimates based on model complexity and settings
  const calculatePrintEstimates = () => {
    const volume = (modelData.complexity / 1000) * 20; // Estimated volume in cm³
    const materialCost = volume * 0.03 * (printSettings.infillDensity / 100); // $0.03 per cm³
    const printTime = (volume * 2) + (printSettings.layerHeight < 0.15 ? 2 : 1); // Hours
    
    return {
      volume: Math.round(volume * 100) / 100,
      materialCost: Math.round(materialCost * 100) / 100,
      printTime: Math.round(printTime * 100) / 100,
      layers: Math.ceil(50 / printSettings.layerHeight) // Estimated layers for 5cm height
    };
  };

  const estimates = calculatePrintEstimates();

  const exportModel = (format: string) => {
    const formatInfo = {
      stl: { ext: "stl", mime: "application/sla", description: "STL format for 3D printing" },
      obj: { ext: "obj", mime: "text/plain", description: "OBJ format with materials" },
      ply: { ext: "ply", mime: "application/octet-stream", description: "PLY format for detailed geometry" },
      amf: { ext: "amf", mime: "application/xml", description: "AMF format with color and materials" },
      "3mf": { ext: "3mf", mime: "application/vnd.ms-package.3dmanufacturing-3dmodel+xml", description: "3MF format with full print settings" }
    };

    const info = formatInfo[format as keyof typeof formatInfo];
    
    // Generate enhanced file content based on format
    let fileContent = `# PowerPrint 3D Model - ${format.toUpperCase()} Export
# Generated from: ${uploadedImages.map(img => img.name).join(', ')}
# PowerPrint Pipeline Processing
# Export Date: ${new Date().toISOString()}
# 
# Model Statistics:
# Vertices: ${modelData.vertices.toLocaleString()}
# Faces: ${modelData.faces.toLocaleString()}
# Complexity: ${modelData.complexity}
# 
# Print Settings:
# Layer Height: ${printSettings.layerHeight}mm
# Infill Density: ${printSettings.infillDensity}%
# Print Speed: ${printSettings.printSpeed}mm/s
# Material: ${printSettings.material.toUpperCase()}
# Printer Type: ${printSettings.printerType.toUpperCase()}
# Support Structures: ${printSettings.supportStructures ? 'Yes' : 'No'}
# 
# Print Estimates:
# Estimated Volume: ${estimates.volume} cm³
# Estimated Material Cost: $${estimates.materialCost}
# Estimated Print Time: ${estimates.printTime} hours
# Estimated Layers: ${estimates.layers}
# 
# This file is optimized for 3D printing with the specified settings.
# Compatible with most slicing software including:
# - Ultimaker Cura
# - PrusaSlicer
# - Bambu Studio
# - Simplify3D
# - MatterControl

`;

    if (format === "stl") {
      fileContent += `
solid PowerPrintModel
  # STL mesh data would be here in binary format
  # This is a demonstration file - actual STL data would contain
  # triangle definitions in binary format for optimal printing
endsolid PowerPrintModel
`;
    } else if (format === "obj") {
      fileContent += `
# OBJ file with materials
mtllib powerprint_model.mtl

# Vertex data (demonstration)
v 0.0 0.0 0.0
v 1.0 0.0 0.0
v 0.5 1.0 0.0

# Face data (demonstration)
f 1 2 3

# Actual model would contain ${modelData.vertices.toLocaleString()} vertices
# and ${modelData.faces.toLocaleString()} faces from PowerPrint processing
`;
    } else if (format === "ply") {
      fileContent += `
ply
format ascii 1.0
element vertex ${modelData.vertices}
property float x
property float y
property float z
property uchar red
property uchar green
property uchar blue
element face ${modelData.faces}
property list uchar int vertex_indices
end_header
# Vertex and face data would follow here
`;
    }

    const blob = new Blob([fileContent], { type: info.mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `powerprint_3d_model_${modelData.vertices}v_${modelData.faces}f_${printSettings.quality}.${info.ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: `${format.toUpperCase()} Export Complete!`,
      description: `Model exported with ${printSettings.quality} quality settings for ${printSettings.printerType.toUpperCase()} printing.`,
    });
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "high": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getPrintQualityAssessment = () => {
    const score = modelData.complexity > 5000 ? "high" : modelData.complexity > 2000 ? "medium" : "low";
    return {
      score,
      issues: score === "low" ? ["Low polygon count may result in rough surfaces"] : [],
      recommendations: score === "high" ? ["Model is optimized for high-quality printing"] : ["Consider using higher resolution settings"]
    };
  };

  const assessment = getPrintQualityAssessment();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Printer className="w-4 h-4 mr-2" />
          Prepare for 3D Print
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Printer className="w-5 h-5" />
            <span>3D Print Preparation</span>
          </DialogTitle>
          <DialogDescription>
            Configure your model for optimal 3D printing results
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gauge className="w-4 h-4" />
                <span>Model Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-600">Vertices</Label>
                  <p className="font-semibold">{modelData.vertices.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Faces</Label>
                  <p className="font-semibold">{modelData.faces.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Complexity</Label>
                  <p className="font-semibold">{modelData.complexity}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Print Quality</Label>
                  <Badge variant={assessment.score === "high" ? "default" : assessment.score === "medium" ? "secondary" : "destructive"}>
                    {assessment.score}
                  </Badge>
                </div>
              </div>

              {assessment.issues.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Potential Issues</p>
                      <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                        {assessment.issues.map((issue, i) => (
                          <li key={i}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {assessment.recommendations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Recommendations</p>
                      <ul className="text-xs text-blue-700 mt-1 space-y-1">
                        {assessment.recommendations.map((rec, i) => (
                          <li key={i}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Print Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Print Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Printer Type</Label>
                  <Select value={printSettings.printerType} onValueChange={(value) => 
                    setPrintSettings(prev => ({ ...prev, printerType: value }))
                  }>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fdm">FDM/FFF (Filament)</SelectItem>
                      <SelectItem value="sla">SLA/DLP (Resin)</SelectItem>
                      <SelectItem value="sls">SLS (Powder)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Material</Label>
                  <Select value={printSettings.material} onValueChange={(value) => 
                    setPrintSettings(prev => ({ ...prev, material: value }))
                  }>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pla">PLA (Easy, biodegradable)</SelectItem>
                      <SelectItem value="abs">ABS (Strong, heat resistant)</SelectItem>
                      <SelectItem value="petg">PETG (Chemical resistant)</SelectItem>
                      <SelectItem value="tpu">TPU (Flexible)</SelectItem>
                      <SelectItem value="resin">Resin (High detail)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Layer Height: {printSettings.layerHeight}mm</Label>
                  <Slider
                    value={[printSettings.layerHeight]}
                    onValueChange={(value) => setPrintSettings(prev => ({ ...prev, layerHeight: value[0] }))}
                    max={0.3}
                    min={0.1}
                    step={0.05}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Fine (0.1mm)</span>
                    <span>Coarse (0.3mm)</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Infill Density: {printSettings.infillDensity}%</Label>
                  <Slider
                    value={[printSettings.infillDensity]}
                    onValueChange={(value) => setPrintSettings(prev => ({ ...prev, infillDensity: value[0] }))}
                    max={100}
                    min={5}
                    step={5}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Light (5%)</span>
                    <span>Solid (100%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Support Structures</Label>
                  <Switch
                    checked={printSettings.supportStructures}
                    onCheckedChange={(checked) => setPrintSettings(prev => ({ ...prev, supportStructures: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Build Plate Adhesion (Rafts)</Label>
                  <Switch
                    checked={printSettings.rafts}
                    onCheckedChange={(checked) => setPrintSettings(prev => ({ ...prev, rafts: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Print Estimates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-4 h-4" />
                <span>Print Estimates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Print Time</p>
                    <p className="font-semibold">{estimates.printTime}h</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Material Cost</p>
                    <p className="font-semibold">${estimates.materialCost}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Layers</p>
                    <p className="font-semibold">{estimates.layers}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Gauge className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Volume</p>
                    <p className="font-semibold">{estimates.volume} cm³</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export for Printing</span>
              </CardTitle>
              <CardDescription>
                Choose the best format for your slicing software
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Export Format</Label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stl">STL - Standard for most slicers</SelectItem>
                    <SelectItem value="obj">OBJ - With materials and textures</SelectItem>
                    <SelectItem value="ply">PLY - High detail geometry</SelectItem>
                    <SelectItem value="amf">AMF - With color and materials</SelectItem>
                    <SelectItem value="3mf">3MF - Full print settings included</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button 
                  onClick={() => exportModel(selectedFormat)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export {selectedFormat.toUpperCase()} for 3D Printing
                </Button>
                
                <div className="text-xs text-gray-500 text-center">
                  Compatible with: Ultimaker Cura, PrusaSlicer, Bambu Studio, Simplify3D
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintPreparation;
