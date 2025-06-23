
import { useState } from "react";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import ModelSelector from "@/components/ModelSelector";
import ComputeInstance from "@/components/ComputeInstance";
import ModelGallery from "@/components/ModelGallery";
import WorkflowSidebar from "@/components/WorkflowSidebar";
import ModelViewer3D from "@/components/ModelViewer3D";

const Index = () => {
  const [activeTab, setActiveTab] = useState("generate");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedInstance, setSelectedInstance] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Header />
      
      <div className="flex">
        <WorkflowSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6 ml-64">
          {activeTab === "generate" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  AI-Powered Image to 3D Model Conversion
                </h1>
                <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                  Transform your images into professional 3D models using PowerPrint's advanced AI technology
                </p>
              </div>

              {/* API Info Banner */}
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div>
                    <h3 className="text-gray-700 font-medium mb-1">Free API Integration</h3>
                    <p className="text-gray-600 text-sm">
                      This app uses PowerPrint's free API (500 credits/month). 
                      Click on your username to generate a new API key instantly!
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1 space-y-6">
                  <ImageUpload 
                    uploadedImages={uploadedImages}
                    setUploadedImages={setUploadedImages}
                  />
                  
                  <ModelSelector 
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                  />
                  
                  <ComputeInstance 
                    selectedInstance={selectedInstance}
                    setSelectedInstance={setSelectedInstance}
                  />
                  
                  <button 
                    className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!uploadedImages.length}
                    onClick={() => {
                      // The 3D generation will be triggered automatically when images are uploaded
                      console.log("Generate button clicked - processing will start automatically");
                    }}
                  >
                    {uploadedImages.length > 0 ? "Processing Image..." : "Upload Image to Generate"}
                  </button>
                </div>

                <div className="xl:col-span-2">
                  <ModelViewer3D uploadedImages={uploadedImages} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <ModelGallery />
          )}

          {activeTab === "history" && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Generation History</h2>
              <p className="text-gray-600">Your recent 3D model generations will appear here</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
