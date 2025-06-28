
import { useRef, useState, useCallback } from "react";
import { Camera, Square, RotateCcw, X, Download, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  capturedImages: File[];
  setCapturedImages: (images: File[]) => void;
}

const CameraCapture = ({ capturedImages, setCapturedImages }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setShowCamera(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [facingMode, toast]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      setShowCamera(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const file = new File([blob], `camera-capture-${timestamp}.jpg`, {
          type: 'image/jpeg'
        });
        setCapturedImages([...capturedImages, file]);
        
        toast({
          title: "Photo Captured!",
          description: "Image captured successfully for 3D generation.",
        });
      }
    }, 'image/jpeg', 0.9);
  }, [capturedImages, setCapturedImages, toast]);

  const switchCamera = useCallback(() => {
    stopCamera();
    setFacingMode(prev => prev === "user" ? "environment" : "user");
    setTimeout(startCamera, 100);
  }, [startCamera, stopCamera]);

  const removeImage = (index: number) => {
    const newImages = capturedImages.filter((_, i) => i !== index);
    setCapturedImages(newImages);
  };

  const downloadImage = (image: File) => {
    const url = URL.createObjectURL(image);
    const a = document.createElement('a');
    a.href = url;
    a.download = image.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Camera Capture Button */}
      <div className="relative group">
        <button
          onClick={startCamera}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
        >
          <Camera className="w-6 h-6" />
          <span>Camera Capture</span>
          <Info className="w-4 h-4 opacity-70" />
        </button>
        
        {/* Hover Information */}
        <div className="absolute bottom-full left-0 right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          <div className="bg-gray-900 text-white text-sm rounded-lg p-3 shadow-lg border border-gray-700">
            <p className="font-medium mb-1">Camera Capture</p>
            <p className="text-gray-300">
              Use your device camera to capture high-quality images for 3D model generation. 
              Supports front and rear cameras with HD resolution.
            </p>
          </div>
        </div>
      </div>

      {/* Camera Interface - Only show when active */}
      {showCamera && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="aspect-video bg-black relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Camera Controls */}
          {isStreaming && (
            <div className="p-4 bg-black/20 flex items-center justify-center space-x-4">
              <button
                onClick={switchCamera}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                title="Switch Camera"
              >
                <RotateCcw className="w-6 h-6 text-white" />
              </button>
              
              <button
                onClick={capturePhoto}
                className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                title="Capture Photo"
              >
                <Square className="w-8 h-8 text-white" />
              </button>
              
              <button
                onClick={stopCamera}
                className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                title="Stop Camera"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Captured Images */}
      {capturedImages.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Captured Images ({capturedImages.length})</h3>
          <div className="grid grid-cols-2 gap-3">
            {capturedImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <Camera className="w-8 h-8 text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {image.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {(image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => downloadImage(image)}
                      className="p-1 hover:bg-blue-500/20 rounded"
                      title="Download"
                    >
                      <Download className="w-4 h-4 text-blue-400" />
                    </button>
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

export default CameraCapture;
