
interface ModelInfoProps {
  uploadedImages: File[];
}

const ModelInfo = ({ uploadedImages }: ModelInfoProps) => {
  if (uploadedImages.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-50/50">
      <div className="grid grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Source</p>
          <p className="text-gray-900 font-medium">PowerPrint AI</p>
        </div>
        <div>
          <p className="text-gray-600">Format</p>
          <p className="text-gray-900 font-medium">PLY/STL/OBJ</p>
        </div>
        <div>
          <p className="text-gray-600">Quality</p>
          <p className="text-gray-900 font-medium">High</p>
        </div>
        <div>
          <p className="text-gray-600">Status</p>
          <p className="text-green-600 font-medium">Generated</p>
        </div>
      </div>
    </div>
  );
};

export default ModelInfo;
