
import { useState, useRef } from "react";
import { Upload, FileType, X } from "lucide-react";
import { parseObjFile, ParsedObjData } from "./ObjFileParser";

interface ObjFileUploadProps {
  onObjLoaded: (objData: ParsedObjData, fileName: string) => void;
  onRemoveObj: () => void;
  uploadedObj?: { data: ParsedObjData; fileName: string } | null;
}

const ObjFileUpload = ({ onObjLoaded, onRemoveObj, uploadedObj }: ObjFileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.obj')) {
      setError('Please select a valid .obj file');
      return;
    }

    console.log("Loading OBJ file:", file.name, "Size:", file.size, "bytes");
    setIsLoading(true);
    setError(null);
    
    try {
      const text = await file.text();
      console.log("File content loaded, length:", text.length);
      
      const objData = parseObjFile(text);
      console.log("OBJ data parsed successfully:", objData);
      
      onObjLoaded(objData, file.name);
    } catch (error) {
      console.error('Error parsing OBJ file:', error);
      setError(error instanceof Error ? error.message : 'Error parsing OBJ file. Please check the file format.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const objFile = files.find(file => file.name.toLowerCase().endsWith('.obj'));
    
    if (objFile) {
      handleFileSelect(objFile);
    } else {
      setError('No .obj file found in dropped files');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  if (uploadedObj) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Uploaded OBJ File</h3>
          <button
            onClick={onRemoveObj}
            className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
            title="Remove OBJ file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileType className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{uploadedObj.fileName}</p>
            <p className="text-sm text-gray-500">
              {(uploadedObj.data.vertices.length / 3).toLocaleString()} vertices
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload OBJ File</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-purple-500 bg-purple-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".obj"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isDragging ? "bg-purple-100" : "bg-gray-100"
          }`}>
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className={`w-6 h-6 ${isDragging ? "text-purple-600" : "text-gray-500"}`} />
            )}
          </div>
          
          <div>
            <p className="font-medium text-gray-900 mb-1">
              {isLoading ? "Processing OBJ file..." : "Upload OBJ File"}
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop or click to select a .obj file
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>• Supports standard Wavefront OBJ format</p>
        <p>• Automatically centers and scales the model</p>
        <p>• Compatible with most 3D modeling software exports</p>
      </div>
    </div>
  );
};

export default ObjFileUpload;
