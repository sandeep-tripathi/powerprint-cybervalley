
import { useState, useRef } from "react";
import { Upload, X, File, Plus, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CADUploadFormProps {
  onUploadComplete?: (model: any) => void;
  onClose?: () => void;
}

const CADUploadForm = ({ onUploadComplete, onClose }: CADUploadFormProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [modelName, setModelName] = useState("");
  const [category, setCategory] = useState("mechanical");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const supportedFormats = ['.stl', '.obj', '.gltf', '.glb', '.ply', '.dae'];

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (supportedFormats.includes(fileExtension)) {
        setUploadedFile(file);
        if (!modelName) {
          setModelName(file.name.replace(/\.[^/.]+$/, ""));
        }
      } else {
        toast({
          title: "Unsupported File Format",
          description: `Please upload one of: ${supportedFormats.join(', ')}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile || !modelName.trim()) return;

    setIsUploading(true);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newModel = {
        id: Date.now(),
        name: modelName,
        category: category,
        thumbnail: "/placeholder.svg",
        downloads: 0,
        likes: 0,
        author: "You",
        date: "Just now",
        file: uploadedFile,
        description: description
      };

      onUploadComplete?.(newModel);
      
      toast({
        title: "Upload Successful!",
        description: `${modelName} has been added to the gallery.`,
      });

      // Reset form
      setUploadedFile(null);
      setModelName("");
      setDescription("");
      onClose?.();

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload CAD model. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Upload CAD Model</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-purple-500/50 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 transition-colors bg-white/5"
        >
          {uploadedFile ? (
            <div className="space-y-3">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
              <div className="flex items-center justify-center space-x-3">
                <File className="w-6 h-6 text-purple-400" />
                <div>
                  <p className="text-white font-medium">{uploadedFile.name}</p>
                  <p className="text-gray-400 text-sm">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="p-1 hover:bg-red-500/20 rounded"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">
                Drop CAD file here or click to browse
              </h4>
              <p className="text-gray-400 mb-2">
                Supported formats: {supportedFormats.join(', ')}
              </p>
              <p className="text-sm text-gray-500">
                Max file size: 50MB
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={supportedFormats.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Model Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">Model Name *</label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Enter model name..."
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="mechanical">Mechanical</option>
              <option value="architectural">Architectural</option>
              <option value="product">Product Design</option>
              <option value="prototypes">Prototypes</option>
              <option value="art">Art & Sculpture</option>
              <option value="jewelry">Jewelry</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description of your model..."
            rows={3}
            className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!uploadedFile || !modelName.trim() || isUploading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
        >
          {isUploading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            "Upload to Gallery"
          )}
        </button>
      </form>
    </div>
  );
};

export default CADUploadForm;
