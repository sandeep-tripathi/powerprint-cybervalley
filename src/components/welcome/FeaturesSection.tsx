
import { Upload, Cpu, Zap, Download, Globe, Eye } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Upload,
      title: "Image to 3D Conversion",
      description: "Transform any image into a detailed 3D model using our advanced AI algorithms. Simply upload your photo and watch it come to life."
    },
    {
      icon: Cpu,
      title: "Multiple AI Models",
      description: "Choose from PowerPrint V2 for fast generation or PowerPrint Pro for ultra-high quality professional models."
    },
    {
      icon: Zap,
      title: "Flexible Computing",
      description: "Scale your processing power from Basic to Enterprise instances, or run models locally on your machine."
    },
    {
      icon: Download,
      title: "Export Ready Models",
      description: "Download your models in popular formats like OBJ, STL, and PLY for 3D printing or further editing."
    },
    {
      icon: Globe,
      title: "REST API Access",
      description: "Integrate PowerPrint into your workflow with our comprehensive REST API and 50 free credits monthly."
    },
    {
      icon: Eye,
      title: "3D Model Viewer",
      description: "Preview and interact with your generated models in real-time using our advanced 3D viewer."
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Everything you need to transform single image into professional 3D models
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
