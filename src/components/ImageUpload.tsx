
import { useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  uploadedImages: File[];
  setUploadedImages: (images: File[]) => void;
}

const ImageUpload = ({ uploadedImages, setUploadedImages }: ImageUploadProps) => {
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
      <h2 className="text-2xl font-bold text-white mb-4">Upload Images</h2>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-purple-500/50 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors bg-white/5 backdrop-blur-sm"
      >
        <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Drag & drop images here
        </h3>
        <p className="text-gray-400 mb-4">
          or click to browse files
        </p>
        <p className="text-sm text-gray-500">
          Supports: JPG, PNG, WEBP (Max 10MB each)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {uploadedImages.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Uploaded Images ({uploadedImages.length})</h3>
          <div className="grid grid-cols-2 gap-3">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <ImageIcon className="w-8 h-8 text-purple-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {image.name}
                      </p>
                      <p className="text-gray-400 text-sm">
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
