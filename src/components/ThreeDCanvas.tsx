
import { useEffect, useRef } from "react";

interface ThreeDCanvasProps {
  isLoading: boolean;
  generationStatus: string;
  uploadedImages: File[];
}

const ThreeDCanvas = ({ isLoading, generationStatus, uploadedImages }: ThreeDCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && uploadedImages.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw a simple 3D-looking cube as placeholder
        ctx.fillStyle = '#4338ca';
        ctx.fillRect(100, 100, 200, 200);
        
        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.moveTo(300, 100);
        ctx.lineTo(350, 50);
        ctx.lineTo(350, 250);
        ctx.lineTo(300, 300);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(150, 50);
        ctx.lineTo(350, 50);
        ctx.lineTo(300, 100);
        ctx.closePath();
        ctx.fill();
        
        // Add text
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.fillText('3D Model Generated', 150, 350);
      }
    }
  }, [uploadedImages]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">Converting Image to 3D Model...</p>
          <p className="text-gray-300 text-sm">{generationStatus}</p>
        </div>
      </div>
    );
  }

  if (uploadedImages.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-2 border-dashed border-gray-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 border border-gray-500 rounded"></div>
          </div>
          <p className="text-white font-medium">Ready for 3D Generation</p>
          <p className="text-gray-400 text-sm">Upload an image to convert it to a 3D model using AI</p>
        </div>
      </div>
    );
  }

  return (
    <canvas 
      ref={canvasRef} 
      width={500} 
      height={400}
      className="w-full h-full bg-gray-900 rounded-lg"
    />
  );
};

export default ThreeDCanvas;
