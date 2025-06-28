import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Info } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  uploadedImages: File[];
  setUploadedImages: (images: File[]) => void;
  compact?: boolean;
}

const ImageUpload = ({ uploadedImages, setUploadedImages, compact = false }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPandaOptions, setShowPandaOptions] = useState(false);
  const { toast } = useToast();

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

  const createPandaImageFile = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: blob.type });
      return file;
    } catch (error) {
      console.error("Error creating panda image file:", error);
      return null;
    }
  };

  const selectPandaImage = async (pandaType: string) => {
    // For demo purposes, we'll create a placeholder panda image
    // In a real app, you'd have actual panda images
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a simple panda-like image
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 400);
      
      // Panda face
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(200, 200, 150, 0, 2 * Math.PI);
      ctx.fill();
      
      // Eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(170, 170, 30, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(230, 170, 30, 0, 2 * Math.PI);
      ctx.fill();
      
      // Eye pupils
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(170, 170, 15, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(230, 170, 15, 0, 2 * Math.PI);
      ctx.fill();
      
      // Nose
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(200, 220, 8, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `panda-${pandaType}-${Date.now()}.png`, {
          type: 'image/png'
        });
        setUploadedImages([...uploadedImages, file]);
        setShowPandaOptions(false);
        
        toast({
          title: "Panda Image Added!",
          description: `${pandaType} panda image has been added to your upload queue.`,
        });
      }
    }, 'image/png');
  };

  const handleUploadClick = () => {
    setShowPandaOptions(true);
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="relative group">
        <button
          onClick={handleUploadClick}
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
                Upload existing images from your device or choose a sample panda image for 3D model generation. 
                Supports JPG, PNG, WEBP formats up to 10MB each. Multiple images supported.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Panda Selection Modal */}
      {showPandaOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-white text-lg font-semibold mb-4">Choose Image Source</h3>
            <div className="space-y-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                Upload from Device
              </Button>
              <div className="text-center text-gray-400 text-sm">or choose a sample</div>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() => selectPandaImage("standing")}
                  variant="outline"
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  Standing Panda
                </Button>
              </div>
              <Button
                onClick={() => setShowPandaOptions(false)}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          handleFileSelect(e.target.files);
          setShowPandaOptions(false);
        }}
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
