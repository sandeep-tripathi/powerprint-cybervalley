
import { useState } from "react";
import Header from "@/components/Header";
import CameraCapture from "@/components/CameraCapture";
import ImageUpload from "@/components/ImageUpload";
import Marketplace from "@/components/Marketplace";
import WorkflowSidebar from "@/components/WorkflowSidebar";
import ModelViewer3D from "@/components/ModelViewer3D";
import PricingPage from "@/components/PricingPage";
import GenerationHistory from "@/components/GenerationHistory";
import LinuxTerminal from "@/components/LinuxTerminal";
import { useGenerationHistory } from "@/hooks/useGenerationHistory";
import RestApiDemo from "@/components/RestApiDemo";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <WorkflowSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6 ml-64">
          {activeTab === "generate" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1 space-y-6">
                  <div className="space-y-3">
                    <div className="text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-full font-semibold text-sm mb-2">
                        1
                      </span>
                      <p className="text-white font-medium">Add image to generate</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <CameraCapture 
                        capturedImages={capturedImages}
                        setCapturedImages={setCapturedImages}
                        compact={true}
                      />
                      
                      <ImageUpload 
                        uploadedImages={uploadedImages}
                        setUploadedImages={setUploadedImages}
                        compact={true}
                      />
                    </div>
                  </div>
                  
                  <button 
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!allImages.length}
                    onClick={() => {
                      console.log("Generate button clicked - processing will start automatically");
                    }}
                  >
                    {allImages.length > 0 ? "Processing with Advanced AI..." : "Add Images to Generate"}
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
            <Marketplace />
          )}

          {activeTab === "pricing" && (
            <PricingPage />
          )}

          {activeTab === "history" && (
            <GenerationHistory />
          )}

          {activeTab === "api" && (
            <RestApiDemo />
          )}
        </main>
      </div>
      
      <LinuxTerminal />
    </div>
  );
};

export default Index;
