
import { useState } from "react";
import { Download, Eye, Share2, Heart, Plus } from "lucide-react";
import CADUploadForm from "./CADUploadForm";

const ModelGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [models, setModels] = useState([
    {
      id: 1,
      name: "Gear Assembly",
      category: "mechanical",
      thumbnail: "/placeholder.svg",
      downloads: 1234,
      likes: 89,
      author: "John Doe",
      date: "2 days ago"
    },
    {
      id: 2,
      name: "Modern Chair",
      category: "product",
      thumbnail: "/placeholder.svg",
      downloads: 856,
      likes: 156,
      author: "Jane Smith",
      date: "5 days ago"
    },
    {
      id: 3,
      name: "Building Framework",
      category: "architectural",
      thumbnail: "/placeholder.svg",
      downloads: 432,
      likes: 67,
      author: "Mike Johnson",
      date: "1 week ago"
    },
    {
      id: 4,
      name: "Phone Prototype",
      category: "prototypes",
      thumbnail: "/placeholder.svg",
      downloads: 789,
      likes: 234,
      author: "Sarah Wilson",
      date: "3 days ago"
    },
    {
      id: 5,
      name: "Engine Component",
      category: "mechanical",
      thumbnail: "/placeholder.svg",
      downloads: 567,
      likes: 123,
      author: "Tom Brown",
      date: "4 days ago"
    },
    {
      id: 6,
      name: "Lamp Design",
      category: "product",
      thumbnail: "/placeholder.svg",
      downloads: 345,
      likes: 78,
      author: "Lisa Davis",
      date: "6 days ago"
    }
  ]);

  const categories = [
    { id: "all", name: "All Models" },
    { id: "mechanical", name: "Mechanical" },
    { id: "architectural", name: "Architectural" },
    { id: "product", name: "Product Design" },
    { id: "prototypes", name: "Prototypes" },
    { id: "art", name: "Art & Sculpture" },
    { id: "jewelry", name: "Jewelry" }
  ];

  const filteredModels = selectedCategory === "all" 
    ? models 
    : models.filter(model => model.category === selectedCategory);

  const handleUploadComplete = (newModel: any) => {
    setModels(prev => [newModel, ...prev]);
    setShowUploadForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Model Gallery</h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Upload CAD</span>
          </button>
          
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-purple-600 text-white"
                    : "bg-white/10 text-gray-300 hover:text-white hover:bg-white/20"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <CADUploadForm
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowUploadForm(false)}
        />
      )}

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <div key={model.id} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
            <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-blue-900/30 relative group">
              <img 
                src={model.thumbnail} 
                alt={model.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <Eye className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <Download className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2">{model.name}</h3>
              <p className="text-gray-400 text-sm mb-3">by {model.author} • {model.date}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{model.downloads}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{model.likes}</span>
                  </div>
                </div>
                
                <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full capitalize">
                  {model.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredModels.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-4">No models found</h2>
          <p className="text-gray-400 mb-6">
            {selectedCategory === "all" 
              ? "Be the first to upload a CAD model to the gallery!" 
              : `No models found in the ${categories.find(c => c.id === selectedCategory)?.name} category.`
            }
          </p>
          <button
            onClick={() => setShowUploadForm(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Upload Your First Model</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ModelGallery;
