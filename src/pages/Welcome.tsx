
import { ArrowRight, Cpu, Zap, Award, Globe, Upload, Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Welcome = () => {
  const features = [
    {
      icon: Upload,
      title: "Image to 3D Conversion",
      description: "Transform any image into a detailed 3D model using our advanced AI algorithms. Simply upload your photo and watch it come to life."
    },
    {
      icon: Cpu,
      title: "Multiple AI Models",
      description: "Choose from PowerPrint V2 for fast generation or PowerPrint Pro for ultra-high quality professional models."
    },
    {
      icon: Zap,
      title: "Flexible Computing",
      description: "Scale your processing power from Basic to Enterprise instances, or run models locally on your machine."
    },
    {
      icon: Download,
      title: "Export Ready Models",
      description: "Download your models in popular formats like OBJ, STL, and PLY for 3D printing or further editing."
    },
    {
      icon: Globe,
      title: "REST API Access",
      description: "Integrate PowerPrint into your workflow with our comprehensive REST API and 50 free credits monthly."
    },
    {
      icon: Eye,
      title: "3D Model Viewer",
      description: "Preview and interact with your generated models in real-time using our advanced 3D viewer."
    }
  ];

  const pricingTiers = [
    {
      name: "Basic",
      price: "€0.10/run",
      description: "2 vCPUs, 8GB RAM",
      speed: "3-5 min",
      icon: Cpu
    },
    {
      name: "Pro",
      price: "€0.50/run", 
      description: "8 vCPUs, 32GB RAM, GPU",
      speed: "1-2 min",
      icon: Zap,
      popular: true
    },
    {
      name: "Enterprise",
      price: "€2.00/run",
      description: "16 vCPUs, 64GB RAM, High-end GPU", 
      speed: "30-60 sec",
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
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

        {/* Platform Pricing Banner */}
        <section className="py-8 px-6 bg-slate-800/30">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-purple-300 mb-3">Platform Access</h3>
              <p className="text-slate-300 text-lg mb-4">
                <strong className="text-3xl text-white">€50</strong> one-time platform access
              </p>
              <p className="text-slate-400">
                Complete AI-powered 3D generation platform with REST API access, 
                advanced processing capabilities, and professional 3D model export options.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Everything you need to transform images into professional 3D models
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-300">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-6 bg-slate-800/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Compute Instances</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Choose the perfect processing power for your needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {pricingTiers.map((tier, index) => {
                const Icon = tier.icon;
                return (
                  <div 
                    key={index} 
                    className={`bg-slate-800/50 border rounded-lg p-6 text-center relative ${
                      tier.popular 
                        ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                        : 'border-slate-700'
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full">
                          Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <p className="text-3xl font-bold text-purple-300 mb-2">{tier.price}</p>
                    <p className="text-slate-300 mb-4">{tier.description}</p>
                    <p className="text-slate-400 text-sm">Processing time: {tier.speed}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of creators using PowerPrint to bring their ideas to life
            </p>
            
            <div className="space-y-4">
              <Link 
                to="/"
                className="inline-flex bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl items-center space-x-2"
              >
                <span>Start Creating Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <div className="text-slate-400 text-sm">
                Free API access • 50 credits per month • No credit card required
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Welcome;
