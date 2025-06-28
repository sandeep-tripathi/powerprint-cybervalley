
import { useRef } from "react";
import { Upload, X, Image as ImageIcon, Info } from "lucide-react";

interface ImageUploadProps {
  uploadedImages: File[];
  setUploadedImages: (images: File[]) => void;
  compact?: boolean;
}

const ImageUpload = ({ uploadedImages, setUploadedImages, compact = false }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).filter(file => 
        file.type.startsWith('image/')
      );
      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="relative group">
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
            compact ? 'py-3 px-4 text-sm' : 'py-4 px-6 space-x-3'
          }`}
        >
          <Upload className={compact ? "w-4 h-4" : "w-6 h-6"} />
          <span>Upload</span>
          {!compact && <Info className="w-4 h-4 opacity-70" />}
        </button>
        
        {/* Hover Information */}
        {!compact && (
          <div className="absolute bottom-full left-0 right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
            <div className="bg-gray-900 text-white text-sm rounded-lg p-3 shadow-lg border border-gray-700">
              <p className="font-medium mb-1">Image Upload</p>
              <p className="text-gray-300">
                Upload existing images from your device for 3D model generation. 
                Supports JPG, PNG, WEBP formats up to 10MB each. Multiple images supported.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-3">
          <h3 className={`font-semibold text-white ${compact ? 'text-sm' : 'text-lg'}`}>
            Uploaded Images ({uploadedImages.length})
          </h3>
          <div className={compact ? "space-y-2" : "grid grid-cols-2 gap-3"}>
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <ImageIcon className={`text-green-400 flex-shrink-0 ${compact ? 'w-6 h-6' : 'w-8 h-8'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-white font-medium truncate ${compact ? 'text-sm' : ''}`}>
                        {image.name}
                      </p>
                      <p className={`text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>
                        {(image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
