import { useState } from "react";
import { Download, Eye, Share2, Heart, ShoppingCart, Star, Filter, Search } from "lucide-react";

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  
  const cadModels = [
    {
      id: 1,
      name: "Precision Ball Bearing Assembly",
      category: "mechanical",
      price: "$45.99",
      thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
      downloads: 5240,
      rating: 4.9,
      reviews: 234,
      author: "MechanicalPro",
      description: "High-precision ball bearing assembly with detailed tolerances for industrial applications",
      tags: ["bearing", "mechanical", "industrial", "precision"]
    },
    {
      id: 2,
      name: "Ergonomic Office Chair Model",
      category: "furniture",
      price: "$29.99",
      thumbnail: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
      downloads: 3890,
      rating: 4.7,
      reviews: 156,
      author: "FurnitureDesign Co",
      description: "Complete ergonomic office chair with adjustable components and cushioning details",
      tags: ["chair", "office", "ergonomic", "furniture"]
    },
    {
      id: 3,
      name: "Classical Ionic Column",
      category: "architectural",
      price: "$65.99",
      thumbnail: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop",
      downloads: 2156,
      rating: 4.8,
      reviews: 89,
      author: "ArchitectStudio",
      description: "Detailed classical Ionic column with accurate proportions and ornamental details",
      tags: ["column", "classical", "ionic", "architecture"]
    },
    {
      id: 4,
      name: "iPhone 15 Pro Housing",
      category: "electronics",
      price: "$39.99",
      thumbnail: "https://images.unsplash.com/photo-1616627561235-2fb8a6e7e0b4?w=400&h=300&fit=crop",
      downloads: 7823,
      rating: 4.6,
      reviews: 445,
      author: "TechCAD Solutions",
      description: "Precise iPhone 15 Pro housing model with camera bump and port details",
      tags: ["iphone", "smartphone", "housing", "apple"]
    },
    {
      id: 5,
      name: "Performance Brake Caliper",
      category: "automotive",
      price: "$55.99",
      thumbnail: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
      downloads: 4321,
      rating: 4.5,
      reviews: 178,
      author: "AutoEngineering",
      description: "High-performance brake caliper with cooling fins and mounting provisions",
      tags: ["brake", "caliper", "automotive", "performance"]
    },
    {
      id: 6,
      name: "Diamond Solitaire Ring",
      category: "jewelry",
      price: "$25.99",
      thumbnail: "https://images.unsplash.com/photo-1581833971366-4f24292d2e41?w=400&h=300&fit=crop",
      downloads: 1892,
      rating: 4.9,
      reviews: 67,
      author: "JewelryCAD Pro",
      description: "Elegant solitaire ring setting with prong details for 1-carat diamond",
      tags: ["ring", "diamond", "solitaire", "engagement"]
    },
    {
      id: 7,
      name: "Electric Motor Housing",
      category: "mechanical",
      price: "$42.99",
      thumbnail: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
      downloads: 3654,
      rating: 4.7,
      reviews: 123,
      author: "ElectroMech Design",
      description: "Compact electric motor housing with ventilation slots and mounting flanges",
      tags: ["motor", "housing", "electric", "mechanical"]
    },
    {
      id: 8,
      name: "Modern Desk Lamp",
      category: "furniture",
      price: "$32.99",
      thumbnail: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=400&h=300&fit=crop",
      downloads: 2487,
      rating: 4.4,
      reviews: 91,
      author: "LightingDesign Studio",
      description: "Minimalist desk lamp with adjustable arm and LED housing",
      tags: ["lamp", "desk", "modern", "lighting"]
    },
    {
      id: 9,
      name: "PCB Circuit Board Layout",
      category: "electronics",
      price: "$28.99",
      thumbnail: "https://images.unsplash.com/photo-1581093458791-9d14678d3515?w=400&h=300&fit=crop",
      downloads: 5432,
      rating: 4.8,
      reviews: 267,
      author: "CircuitPro",
      description: "Multi-layer PCB design with component footprints and trace routing",
      tags: ["pcb", "circuit", "electronics", "board"]
    },
    {
      id: 10,
      name: "Art Deco Building Facade",
      category: "architectural",
      price: "$78.99",
      thumbnail: "https://images.unsplash.com/photo-1581833971340-8b5b3c6b1b8a?w=400&h=300&fit=crop",
      downloads: 1234,
      rating: 4.9,
      reviews: 45,
      author: "Heritage Architecture",
      description: "Detailed Art Deco building facade with geometric patterns and ornaments",
      tags: ["facade", "art deco", "building", "ornamental"]
    },
    {
      id: 11,
      name: "Turbocharger Assembly",
      category: "automotive",
      price: "$89.99",
      thumbnail: "https://images.unsplash.com/photo-1581093296284-e4b5b2f4a9d6?w=400&h=300&fit=crop",
      downloads: 2876,
      rating: 4.6,
      reviews: 134,
      author: "TurboTech Engineering",
      description: "Complete turbocharger assembly with impeller, housing, and wastegate",
      tags: ["turbo", "turbocharger", "automotive", "performance"]
    },
    {
      id: 12,
      name: "Vintage Watch Movement",
      category: "jewelry",
      price: "$95.99",
      thumbnail: "https://images.unsplash.com/photo-1616627561233-2fb8a6e7e0b4?w=400&h=300&fit=crop",
      downloads: 987,
      rating: 4.9,
      reviews: 23,
      author: "TimeKeeper Models",
      description: "Intricate vintage watch movement with gears, springs, and jeweled bearings",
      tags: ["watch", "movement", "vintage", "mechanical"]
    }
  ];

  const categories = [
    { id: "all", name: "All Models", count: cadModels.length },
    { id: "mechanical", name: "Mechanical", count: cadModels.filter(m => m.category === "mechanical").length },
    { id: "architectural", name: "Architectural", count: cadModels.filter(m => m.category === "architectural").length },
    { id: "furniture", name: "Furniture", count: cadModels.filter(m => m.category === "furniture").length },
    { id: "electronics", name: "Electronics", count: cadModels.filter(m => m.category === "electronics").length },
    { id: "automotive", name: "Automotive", count: cadModels.filter(m => m.category === "automotive").length },
    { id: "jewelry", name: "Jewelry", count: cadModels.filter(m => m.category === "jewelry").length }
  ];

  const sortOptions = [
    { id: "popular", name: "Most Popular" },
    { id: "newest", name: "Newest" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "rating", name: "Highest Rated" }
  ];

  const filteredAndSortedModels = cadModels
    .filter(model => {
      const matchesCategory = selectedCategory === "all" || model.category === selectedCategory;
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.downloads - a.downloads;
        case "newest":
          return b.id - a.id;
        case "price-low":
          return parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1));
        case "price-high":
          return parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1));
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">3D CAD Marketplace</h1>
          <p className="text-gray-400 mt-2">Discover premium 3D models for your projects</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id} className="bg-slate-800">
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              selectedCategory === category.id
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:text-white hover:bg-white/20"
            }`}
          >
            {category.name}
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedModels.map((model) => (
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
              <h3 className="text-white font-semibold text-lg mb-1 truncate">{model.name}</h3>
              <p className="text-gray-400 text-sm mb-2 line-clamp-2">{model.description}</p>
              <p className="text-purple-300 text-sm mb-3">by {model.author}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-1">
                  {renderStars(model.rating)}
                  <span className="text-gray-400 text-sm ml-2">
                    {model.rating} ({model.reviews})
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{model.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{Math.floor(model.downloads * 0.1)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {model.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedModels.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-4">No models found</h2>
          <p className="text-gray-400">
            {searchTerm 
              ? `No models match your search "${searchTerm}"`
              : `No CAD models found in the ${categories.find(c => c.id === selectedCategory)?.name} category.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
