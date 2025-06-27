
import { useState } from "react";
import { useApiKey } from "@/hooks/useApiKey";
import { useMeshy3DGeneration } from "@/hooks/useMeshy3DGeneration";
import ApiStatus from "@/components/ApiStatus";
import ViewerControls from "@/components/ViewerControls";
import ThreeDCanvas from "@/components/ThreeDCanvas";
import ModelInfo from "@/components/ModelInfo";
import ModelPropertyEditor from "@/components/ModelPropertyEditor";
import ObjFileUpload from "@/components/ObjFileUpload";
import { ParsedObjData } from "@/components/ObjFileParser";

interface ModelViewer3DProps {
  capturedImages?: File[];
  onModelGenerated?: (modelName: string, imageNames: string[], modelData: any, processingTime: number) => void;
}

const ModelViewer3D = ({ capturedImages = [], onModelGenerated }: ModelViewer3DProps) => {
  const [uploadedObj, setUploadedObj] = useState<{ data: ParsedObjData; fileName: string } | null>(null);

  const {
    apiKey,
    setApiKey,
    showApiInput,
    setShowApiInput,
    updateApiKey,
    showApiKeyInput,
  } = useApiKey();

  const {
    isLoading,
    hasModel,
    generationStatus,
    generationProgress,
    generatedModel,
    updateGeneratedModel,
  } = useMeshy3DGeneration({
    apiKey,
    showApiKeyInput,
    capturedImages,
    onModelGenerated,
  });

  const handleObjLoaded = (objData: ParsedObjData, fileName: string) => {
    setUploadedObj({ data: objData, fileName });
  };

  const handleRemoveObj = () => {
    setUploadedObj(null);
  };

  const resetView = () => {
    console.log("Reset view");
  };

  const downloadModel = () => {
    if (!generatedModel?.modelUrls) return;

    // Download OBJ file
    const link = document.createElement('a');
    link.href = generatedModel.modelUrls.obj;
    link.download = `meshy-model-${Date.now()}.obj`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Meshy AI 3D model downloaded");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">3D Model Viewer</h2>
          <p className="text-sm text-purple-300">
            Meshy AI Camera-to-3D Generation • Real-time Image Capture • Professional 3D Models • Multiple Export Formats
          </p>
        </div>
        
        <ViewerControls
          hasModel={hasModel || !!uploadedObj}
          uploadedImages={capturedImages}
          generatedModel={generatedModel}
          onResetView={resetView}
          onDownloadOBJ={downloadModel}
        />
      </div>

      <ApiStatus
        showApiInput={showApiInput}
        apiKey={apiKey}
        setApiKey={setApiKey}
        updateApiKey={updateApiKey}
        setShowApiInput={setShowApiInput}
      />

      {/* OBJ File Upload */}
      <ObjFileUpload
        onObjLoaded={handleObjLoaded}
        onRemoveObj={handleRemoveObj}
        uploadedObj={uploadedObj}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="aspect-video bg-black relative">
          <ThreeDCanvas
            isLoading={isLoading}
            generationStatus={generationStatus}
            uploadedImages={capturedImages}
            generatedModel={generatedModel}
            uploadedObj={uploadedObj}
          />
          
          {/* Progress indicator for Meshy AI */}
          {isLoading && generationProgress > 0 && (
            <div className="absolute bottom-4 right-4 bg-black/70 rounded-lg p-3 text-white">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">{generationProgress}%</span>
              </div>
              <div className="w-32 h-1 bg-gray-600 rounded-full mt-2">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <ModelInfo uploadedImages={capturedImages} />
      </div>

      {/* Property Editor - Only show when model is generated */}
      {generatedModel && !isLoading && (
        <ModelPropertyEditor
          generatedModel={generatedModel}
          onModelUpdate={updateGeneratedModel}
        />
      )}

      <div className="text-xs text-purple-200 space-y-1">
        <p>• Powered by Meshy AI • Camera-based Image Capture • Professional 3D Mesh Generation • Multiple Export Formats</p>
        <p>• Real-time generation progress • High-quality texture synthesis • Export: GLB, FBX, USDZ, OBJ, MTL • Ready for 3D printing</p>
        {generatedModel && (
          <>
            <p>• Model Stats: {generatedModel.vertices.toLocaleString()} vertices, {generatedModel.faces.toLocaleString()} faces, Complexity: {generatedModel.complexity}</p>
            {generatedModel.modelUrls && (
              <p>• Available formats: GLB, FBX, USDZ, OBJ+MTL • Thumbnail and preview video included</p>
            )}
          </>
        )}
        {uploadedObj && (
          <p>• OBJ File: {uploadedObj.fileName} • {(uploadedObj.data.vertices.length / 3).toLocaleString()} vertices</p>
        )}
      </div>
    </div>
  );
};

export default ModelViewer3D;
