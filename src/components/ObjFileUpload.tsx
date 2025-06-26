
import { useState, useRef } from "react";
import { Upload, FileType, X } from "lucide-react";
import { parseObjFile, ParsedObjData } from "./ObjFileParser";
import { Button } from "./ui/button";

interface ObjFileUploadProps {
  onObjLoaded: (objData: ParsedObjData, fileName: string) => void;
  onRemoveObj: () => void;
  uploadedObj?: { data: ParsedObjData; fileName: string } | null;
}

const ObjFileUpload = ({ onObjLoaded, onRemoveObj, uploadedObj }: ObjFileUploadProps) => {
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
      
      // Clear the file input to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error parsing OBJ file:', error);
      setError(error instanceof Error ? error.message : 'Error parsing OBJ file. Please check the file format.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  if (uploadedObj) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-semibold text-gray-900">Uploaded OBJ File</h3>
          <button
            onClick={onRemoveObj}
            className="p-1 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
            title="Remove OBJ file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileType className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">{uploadedObj.fileName}</p>
            <p className="text-xs text-gray-500">
              {(uploadedObj.data.vertices.length / 3).toLocaleString()} vertices
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".obj"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
        className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition-colors bg-purple-50/50"
      >
        {isLoading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-purple-600">Loading OBJ file...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-purple-700">Upload OBJ File</p>
              <p className="text-xs text-purple-500">Click or drag & drop</p>
            </div>
          </div>
        )}
      </div>
      
      <Button
        onClick={handleClick}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="h-8 px-3 text-xs w-full"
      >
        {isLoading ? (
          <>
            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
            Loading...
          </>
        ) : (
          <>
            <Upload className="w-3 h-3 mr-2" />
            Browse OBJ Files
          </>
        )}
      </Button>
      
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ObjFileUpload;
