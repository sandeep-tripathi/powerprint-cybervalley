
import { useEffect, useRef } from "react";

interface ThreeDCanvasProps {
  isLoading: boolean;
  generationStatus: string;
  uploadedImages: File[];
}

const ThreeDCanvas = ({ isLoading, generationStatus, uploadedImages }: ThreeDCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (uploadedImages.length > 0) {
          // Draw cubes for each uploaded image
          uploadedImages.forEach((image, index) => {
            const spacing = 120;
            const startX = 50 + (index % 3) * spacing; // 3 cubes per row
            const startY = 80 + Math.floor(index / 3) * spacing;
            
            // Draw cube faces with green and blue colors
            drawCube(ctx, startX, startY, image.name);
          });
          
          // Add text
          ctx.fillStyle = '#ffffff';
          ctx.font = '14px Arial';
          ctx.fillText(`3D Models Generated (${uploadedImages.length})`, 50, canvas.height - 30);
        }
      }
    }
  }, [uploadedImages]);

  const drawCube = (ctx: CanvasRenderingContext2D, x: number, y: number, imageName: string) => {
    const size = 60;
    
    // Front face (green)
    ctx.fillStyle = '#22C55E';
    ctx.fillRect(x, y, size, size);
    
    // Right face (blue)
    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    ctx.moveTo(x + size, y);
    ctx.lineTo(x + size + 20, y - 20);
    ctx.lineTo(x + size + 20, y + size - 20);
    ctx.lineTo(x + size, y + size);
    ctx.closePath();
    ctx.fill();
    
    // Top face (lighter blue)
    ctx.fillStyle = '#60A5FA';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 20, y - 20);
    ctx.lineTo(x + size + 20, y - 20);
    ctx.lineTo(x + size, y);
    ctx.closePath();
    ctx.fill();
    
    // Add image name below cube
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';
    const truncatedName = imageName.length > 12 ? imageName.substring(0, 12) + '...' : imageName;
    ctx.fillText(truncatedName, x, y + size + 15);
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">Converting Images to 3D Models...</p>
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
          <p className="text-gray-400 text-sm">Upload images to convert them to 3D models using AI</p>
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
