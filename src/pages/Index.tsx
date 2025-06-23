
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="flex">
        <WorkflowSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6 ml-64">
          {activeTab === "generate" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Create Amazing 3D CAD Models
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Transform your images into professional 3D CAD models using advanced AI technology
                </p>
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
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    disabled={!uploadedImages.length || !selectedModel || !selectedInstance}
                  >
                    Generate 3D Model
                  </button>
                </div>

                <div className="xl:col-span-2">
                  <ModelViewer3D />
                </div>
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <ModelGallery />
          )}

          {activeTab === "history" && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-white mb-4">Generation History</h2>
              <p className="text-gray-400">Your recent 3D model generations will appear here</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
