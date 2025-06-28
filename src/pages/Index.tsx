
import { useState } from "react";
import Header from "@/components/Header";
import CameraCapture from "@/components/CameraCapture";
import ModelSelectorDropdown from "@/components/ModelSelectorDropdown";
import ComputeInstanceDropdown from "@/components/ComputeInstanceDropdown";
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
import ConfigurationManager from "@/components/ConfigurationManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("generate");
  const [capturedImages, setCapturedImages] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedInstance, setSelectedInstance] = useState("");
  const { addToHistory } = useGenerationHistory();

  const handleModelGenerated = (modelName: string, imageNames: string[], modelData: any, processingTime: number) => {
    addToHistory(modelName, imageNames, modelData, processingTime);
  };

  const handleConfigurationLoad = (config: any) => {
    setSelectedModel(config.selectedModel);
    setSelectedInstance(config.selectedInstance);
  };

  // Platform pricing info component
  const PlatformPricing = () => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-3 mb-2">
        <Euro className="w-5 h-5 text-purple-400" />
        <span className="text-purple-300 font-medium">PowerPrint Integration</span>
      </div>
      <p className="text-slate-300 text-sm">
        PowerPrint Platform: Professional camera-to-3D conversion using advanced AI technology. 
        Generate high-quality 3D models directly from camera captures with multiple export formats.
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
                  AI-Powered Camera to 3D Model Conversion
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  Capture images with your camera and transform them into professional 3D models using PowerPrint technology
                </p>
              </div>

              <PlatformPricing />

              {/* PowerPrint Info Banner */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  <div>
                    <h3 className="text-purple-300 font-medium mb-1">PowerPrint Integration</h3>
                    <p className="text-slate-300 text-sm">
                      This app uses PowerPrint's professional image-to-3D conversion service. 
                      Get your API key from{" "}
                      <a 
                        href="https://powerprint.ai/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 underline"
                      >
                        powerprint.ai
                      </a>
                      {" "}to start generating high-quality 3D models from camera captures!
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1 space-y-6">
                  <ModelSelectorDropdown 
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                  />
                  
                  <ComputeInstanceDropdown 
                    selectedInstance={selectedInstance}
                    setSelectedInstance={setSelectedInstance}
                  />

                  <ConfigurationManager
                    selectedModel={selectedModel}
                    selectedInstance={selectedInstance}
                    onConfigurationLoad={handleConfigurationLoad}
                  />
                  
                  <CameraCapture 
                    capturedImages={capturedImages}
                    setCapturedImages={setCapturedImages}
                  />
                  
                  <button 
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!capturedImages.length}
                    onClick={() => {
                      // The 3D generation will be triggered automatically when images are captured
                      console.log("Generate button clicked - processing will start automatically with PowerPrint");
                    }}
                  >
                    {capturedImages.length > 0 ? "Processing with PowerPrint..." : "Capture Image to Generate"}
                  </button>
                </div>

                <div className="xl:col-span-2">
                  <ModelViewer3D 
                    capturedImages={capturedImages}
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
