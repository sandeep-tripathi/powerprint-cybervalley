
import { useState } from "react";
import Header from "@/components/Header";
import CameraCapture from "@/components/CameraCapture";
import ImageUpload from "@/components/ImageUpload";
import Marketplace from "@/components/Marketplace";
import WorkflowSidebar from "@/components/WorkflowSidebar";
import ModelViewer3D from "@/components/ModelViewer3D";
import PricingPage from "@/components/PricingPage";
import GenerationHistory from "@/components/GenerationHistory";
import Footer from "@/components/Footer";
import LinuxTerminal from "@/components/LinuxTerminal";
import { useGenerationHistory } from "@/hooks/useGenerationHistory";
import RestApiDemo from "@/components/RestApiDemo";
import { Euro } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("generate");
  const [capturedImages, setCapturedImages] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const { addToHistory } = useGenerationHistory();

  const handleModelGenerated = (modelName: string, imageNames: string[], modelData: any, processingTime: number) => {
    addToHistory(modelName, imageNames, modelData, processingTime);
  };

  // Combine captured and uploaded images
  const allImages = [...capturedImages, ...uploadedImages];

  // Platform pricing info component
  const PlatformPricing = () => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-3 mb-2">
        <Euro className="w-5 h-5 text-purple-400" />
        <span className="text-purple-300 font-medium">Free 2D to 3D Conversion</span>
      </div>
      <p className="text-slate-300 text-sm">
        Use our free algorithm to convert 2D images to 3D models. 
        Capture images with your camera or upload existing images to generate 3D models.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <WorkflowSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6 ml-64 pb-20">
          {activeTab === "generate" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Free 2D to 3D Image Conversion
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  Transform your 2D images into 3D models using our free conversion algorithm
                </p>
              </div>

              <PlatformPricing />

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1 space-y-6">
                  <CameraCapture 
                    capturedImages={capturedImages}
                    setCapturedImages={setCapturedImages}
                  />
                  
                  <ImageUpload 
                    uploadedImages={uploadedImages}
                    setUploadedImages={setUploadedImages}
                  />
                  
                  <button 
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!allImages.length}
                    onClick={() => {
                      // The 3D generation will be triggered automatically when images are available
                      console.log("Generate button clicked - processing will start automatically");
                    }}
                  >
                    {allImages.length > 0 ? "Processing with Free Algorithm..." : "Add Images to Generate"}
                  </button>
                </div>

                <div className="xl:col-span-2">
                  <ModelViewer3D 
                    capturedImages={allImages}
                    onModelGenerated={handleModelGenerated}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "marketplace" && (
            <div className="space-y-6">
              <PlatformPricing />
              <Marketplace />
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="space-y-6">
              <PlatformPricing />
              <PricingPage />
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6">
              <PlatformPricing />
              <GenerationHistory />
            </div>
          )}

          {activeTab === "api" && (
            <RestApiDemo />
          )}
        </main>
      </div>
      
      <Footer />
      <LinuxTerminal />
    </div>
  );
};

export default Index;
