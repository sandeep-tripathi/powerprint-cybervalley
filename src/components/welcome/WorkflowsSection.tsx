
import { Camera, Cpu, Eye, Download, Upload, FileText, Scan, Printer } from "lucide-react";

const WorkflowsSection = () => {
  const visionWorkflow = [
    {
      step: 1,
      icon: Camera,
      title: "Capture or Upload",
      description: "Take a photo or upload an existing image of the object you want to convert to 3D"
    },
    {
      step: 2,
      icon: Cpu,
      title: "AI Processing",
      description: "Our advanced AI algorithms analyze the image and generate a detailed 3D mesh"
    },
    {
      step: 3,
      icon: Eye,
      title: "Preview & Edit",
      description: "View your 3D model in our interactive viewer and make adjustments as needed"
    },
    {
      step: 4,
      icon: Download,
      title: "Export",
      description: "Download your model in various formats for 3D printing, gaming, or AR/VR applications"
    }
  ];

  const printingWorkflow = [
    {
      step: 1,
      icon: Upload,
      title: "Generate Model",
      description: "Create your 3D model using our AI-powered image-to-3D conversion technology"
    },
    {
      step: 2,
      icon: FileText,
      title: "Print Validation",
      description: "Automatically check your model for 3D printing compatibility and structural integrity"
    },
    {
      step: 3,
      icon: Scan,
      title: "Prepare for Print",
      description: "Optimize wall thickness, add supports, and configure print settings for your specific printer"
    },
    {
      step: 4,
      icon: Printer,
      title: "Print & Create",
      description: "Export to STL format and send to your 3D printer or professional printing service"
    }
  ];

  return (
    <section className="py-20 px-6 bg-slate-800/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Two Powerful Workflows</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choose the workflow that best fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Vision Workflow */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Vision Workflow</h3>
              <p className="text-slate-300">Perfect for objects, products, and real-world items</p>
            </div>

            <div className="space-y-6">
              {visionWorkflow.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <item.icon className="w-4 h-4 text-blue-400" />
                      <h4 className="text-white font-semibold">{item.title}</h4>
                    </div>
                    <p className="text-slate-300 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Printing Workflow */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Printer className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">3D Printing Workflow</h3>
              <p className="text-slate-300">Optimized for manufacturing and physical production</p>
            </div>

            <div className="space-y-6">
              {printingWorkflow.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <item.icon className="w-4 h-4 text-green-400" />
                      <h4 className="text-white font-semibold">{item.title}</h4>
                    </div>
                    <p className="text-slate-300 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowsSection;
