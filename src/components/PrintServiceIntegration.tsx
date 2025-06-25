
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ExternalLink, 
  Truck, 
  MapPin, 
  Star,
  Clock,
  DollarSign,
  Package,
  Shield
} from "lucide-react";

interface PrintServiceIntegrationProps {
  modelData: {
    meshData: any;
    textureUrl: string;
    complexity: number;
    vertices: number;
    faces: number;
  };
}

const PrintServiceIntegration = ({ modelData }: PrintServiceIntegrationProps) => {
  const [selectedService, setSelectedService] = useState<string>("");

  const printServices = [
    {
      id: "craftcloud",
      name: "Craftcloud",
      logo: "🔥",
      description: "Global network of verified 3D printing services",
      rating: 4.8,
      estimatedPrice: "$12-25",
      deliveryTime: "3-7 days",
      materials: ["PLA", "ABS", "PETG", "Resin", "Metal"],
      features: ["Instant quote", "Quality guarantee", "Global shipping"],
      url: "https://craftcloud3d.com"
    },
    {
      id: "shapeways",
      name: "Shapeways",
      logo: "🏭",
      description: "Professional 3D printing marketplace",
      rating: 4.6,
      estimatedPrice: "$15-35",
      deliveryTime: "5-10 days",
      materials: ["Nylon", "Steel", "Brass", "Ceramics", "Precious metals"],
      features: ["Premium materials", "Professional finish", "Design support"],
      url: "https://shapeways.com"
    },
    {
      id: "printful",
      name: "Printful",
      logo: "📦",
      description: "On-demand printing and fulfillment",
      rating: 4.7,
      estimatedPrice: "$8-20",
      deliveryTime: "2-5 days",
      materials: ["PLA", "ABS", "PETG", "TPU"],
      features: ["Fast delivery", "Bulk pricing", "API integration"],
      url: "https://printful.com"
    },
    {
      id: "local",
      name: "Local Print Shops",
      logo: "🏪",
      description: "Find nearby 3D printing services",
      rating: 4.5,
      estimatedPrice: "$5-15",
      deliveryTime: "1-3 days",
      materials: ["PLA", "ABS", "PETG"],
      features: ["Same-day pickup", "Personal consultation", "Support local business"],
      url: "#"
    }
  ];

  const getComplexityPricing = (basePrice: string, complexity: number) => {
    const [min, max] = basePrice.replace('$', '').split('-').map(Number);
    const multiplier = complexity > 5000 ? 1.5 : complexity > 2000 ? 1.2 : 1;
    return `$${Math.round(min * multiplier)}-${Math.round(max * multiplier)}`;
  };

  const openPrintService = (service: any) => {
    if (service.url === "#") {
      // For local services, could integrate with a local service finder API
      alert("Feature coming soon: Integration with local 3D printing services near you!");
      return;
    }
    
    // Open the service in a new tab
    window.open(service.url, '_blank');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
          <Truck className="w-4 h-4 mr-2" />
          Print Service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Truck className="w-5 h-5" />
            <span>3D Print Services</span>
          </DialogTitle>
          <DialogDescription>
            Get your PowerPrint model professionally printed and delivered
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Package className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900">Your Model Details</h3>
                <div className="text-sm text-blue-700 mt-1 space-y-1">
                  <p>• Complexity: {modelData.complexity} ({modelData.complexity > 5000 ? 'High' : modelData.complexity > 2000 ? 'Medium' : 'Low'} detail)</p>
                  <p>• Geometry: {modelData.vertices.toLocaleString()} vertices, {modelData.faces.toLocaleString()} faces</p>
                  <p>• Recommended for: {modelData.complexity > 5000 ? 'SLA/DLP (high detail)' : 'FDM (standard quality)'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {printServices.map((service) => (
              <Card key={service.id} className="relative hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{service.logo}</span>
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">{service.rating}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-gray-600">Estimated Cost</p>
                        <p className="font-semibold">{getComplexityPricing(service.estimatedPrice, modelData.complexity)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-gray-600">Delivery</p>
                        <p className="font-semibold">{service.deliveryTime}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Available Materials</p>
                    <div className="flex flex-wrap gap-1">
                      {service.materials.map((material) => (
                        <Badge key={material} variant="outline" className="text-xs">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Features</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <Button 
                    onClick={() => openPrintService(service)}
                    className="w-full"
                    variant={service.id === "craftcloud" ? "default" : "outline"}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Get Quote from {service.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Need Help Choosing?</h3>
                <div className="text-sm text-gray-600 mt-1 space-y-2">
                  <p>• <strong>High Detail Models:</strong> Choose SLA/DLP services (Shapeways, Craftcloud)</p>
                  <p>• <strong>Functional Parts:</strong> FDM printing with strong materials (Printful, Local shops)</p>
                  <p>• <strong>Budget-Friendly:</strong> Local services often offer competitive pricing</p>
                  <p>• <strong>Fast Delivery:</strong> Local shops for same-day, Printful for quick shipping</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintServiceIntegration;
