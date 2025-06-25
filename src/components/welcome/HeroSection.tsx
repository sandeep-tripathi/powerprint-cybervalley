
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/ed6b11f1-8d40-4c15-8421-e00e55a0f5c7.png" 
            alt="PowerPrint Logo" 
            className="h-16 w-auto mx-auto mb-6"
          />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">PowerPrint</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
          Transform your images into professional 3D models using cutting-edge AI technology. 
          From concept to creation in minutes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <span>Start Generating</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <button className="border border-slate-600 text-white hover:bg-slate-800 font-semibold py-4 px-8 rounded-xl transition-all duration-300">
            View Documentation
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
