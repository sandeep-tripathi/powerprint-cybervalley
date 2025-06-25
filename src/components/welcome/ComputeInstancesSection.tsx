
import { Cpu, Zap, Award } from "lucide-react";

const ComputeInstancesSection = () => {
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
  );
};

export default ComputeInstancesSection;
