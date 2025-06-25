
import { useState } from "react";
import { Download, Eye, Share2, Heart, ShoppingCart, Star } from "lucide-react";

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const cadModels = [
    {
      id: 1,
      name: "Precision Gear Assembly",
      category: "mechanical",
      price: "$29.99",
      thumbnail: "/placeholder.svg",
      downloads: 2456,
      rating: 4.8,
      reviews: 127,
      author: "TechCAD Pro",
      description: "High-precision mechanical gear assembly for industrial applications"
    },
    {
      id: 2,
      name: "Modern Office Chair",
      category: "furniture",
      price: "$19.99",
      thumbnail: "/placeholder.svg",
      downloads: 1823,
      rating: 4.6,
      reviews: 89,
      author: "DesignStudio",
      description: "Ergonomic office chair design with adjustable features"
    },
    {
      id: 3,
      name: "Architectural Column",
      category: "architectural",
      price: "$39.99",
      thumbnail: "/placeholder.svg",
      downloads: 987,
      rating: 4.9,
      reviews: 156,
      author: "ArchitectPro",
      description: "Classical architectural column with detailed moldings"
    },
    {
      id: 4,
      name: "Smartphone Housing",
      category: "electronics",
      price: "$24.99",
      thumbnail: "/placeholder.svg",
      downloads: 3421,
      rating: 4.7,
      reviews: 203,
      author: "MobileTech",
      description: "Premium smartphone housing design with precise tolerances"
    },
    {
      id: 5,
      name: "Automotive Brake Disc",
      category: "automotive",
      price: "$34.99",
      thumbnail: "/placeholder.svg",
      downloads: 1567,
      rating: 4.5,
      reviews: 78,
      author: "AutoCAD Experts",
      description: "Performance brake disc with ventilation channels"
    },
    {
      id: 6,
      name: "Jewelry Ring Setting",
      category: "jewelry",
      price: "$15.99",
      thumbnail: "/placeholder.svg",
      downloads: 892,
      rating: 4.8,
      reviews: 45,
      author: "JewelCraft",
      description: "Elegant ring setting for precious stones"
    }
  ];

  const categories = [
    { id: "all", name: "All Models" },
    { id: "mechanical", name: "Mechanical" },
    { id: "architectural", name: "Architectural" },
    { id: "furniture", name: "Furniture" },
    { id: "electronics", name: "Electronics" },
    { id: "automotive", name: "Automotive" },
    { id: "jewelry", name: "Jewelry" }
  ];

  const filteredModels = selectedCategory === "all" 
    ? cadModels 
    : cadModels.filter(model => model.category === selectedCategory);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-400"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">3D CAD Marketplace</h1>
          <p className="text-gray-400 mt-2">Discover premium 3D models for your projects</p>
        </div>
        
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <div key={model.id} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group">
            <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-blue-900/30 relative">
              <img 
                src={model.thumbnail} 
                alt={model.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <Eye className="w-5 h-5 text-white" />
                </button>
                <button className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </button>
                <button className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="absolute top-3 right-3">
                <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {model.price}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-white font-semibold text-lg mb-1">{model.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{model.description}</p>
              <p className="text-purple-300 text-sm mb-3">by {model.author}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-1">
                  {renderStars(model.rating)}
                  <span className="text-gray-400 text-sm ml-2">
                    {model.rating} ({model.reviews})
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{model.downloads}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{Math.floor(model.downloads * 0.1)}</span>
                  </div>
                </div>
                
                <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full capitalize">
                  {model.category}
                </span>
              </div>
              
              <button className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-4">No models found</h2>
          <p className="text-gray-400">
            No CAD models found in the {categories.find(c => c.id === selectedCategory)?.name} category.
          </p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
