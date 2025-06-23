
import { Cpu, Zap, Award, Cloud } from "lucide-react";

interface ComputeInstanceProps {
  selectedInstance: string;
  setSelectedInstance: (instance: string) => void;
}

const ComputeInstance = ({ selectedInstance, setSelectedInstance }: ComputeInstanceProps) => {
  const instances = [
    {
      id: "basic",
      name: "Basic",
      description: "2 vCPUs, 8GB RAM",
      icon: Cpu,
      speed: "3-5 min",
      price: "Free",
      color: "from-gray-500 to-gray-600",
      cloudProvider: "AWS",
      instanceType: "t3.large",
      specs: "Intel Xeon, 2 vCPUs, 8GB RAM"
    },
    {
      id: "pro",
      name: "Pro",
      description: "8 vCPUs, 32GB RAM, GPU",
      icon: Zap,
      speed: "1-2 min",
      price: "$0.50/run",
      color: "from-blue-500 to-cyan-500",
      popular: true,
      cloudProvider: "Azure",
      instanceType: "Standard_NC6s_v3",
      specs: "NVIDIA V100, 6 vCPUs, 112GB RAM"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "16 vCPUs, 64GB RAM, High-end GPU",
      icon: Award,
      speed: "30-60 sec",
      price: "$2.00/run",
      color: "from-purple-500 to-pink-500",
      cloudProvider: "Google Cloud",
      instanceType: "n1-standard-16 + T4",
      specs: "NVIDIA T4, 16 vCPUs, 60GB RAM"
    }
  ];

  const getProviderLogo = (provider: string) => {
    switch (provider) {
      case "AWS":
        return "🟠"; // AWS orange
      case "Azure":
        return "🔵"; // Azure blue
      case "Google Cloud":
        return "🔴"; // Google red
      default:
        return "☁️";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Compute Instance</h2>
      
      <div className="space-y-3">
        {instances.map((instance) => {
          const Icon = instance.icon;
          return (
            <div
              key={instance.id}
              onClick={() => setSelectedInstance(instance.id)}
              className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                selectedInstance === instance.id
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
              }`}
            >
              {instance.popular && (
                <div className="absolute -top-2 left-4">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${instance.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-semibold">{instance.name}</h3>
                      <span className="text-lg">{getProviderLogo(instance.cloudProvider)}</span>
                      <span className="text-xs text-gray-400">{instance.cloudProvider}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{instance.description}</p>
                    <p className="text-gray-500 text-xs">{instance.instanceType} • {instance.specs}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-semibold">{instance.price}</p>
                  <p className="text-gray-400 text-sm">{instance.speed}</p>
                </div>
                
                {selectedInstance === instance.id && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Cloud className="w-4 h-4 text-purple-400" />
          <span className="text-purple-300 font-medium text-sm">Cloud Provider Info</span>
        </div>
        <p className="text-slate-300 text-xs">
          Instances are automatically provisioned across AWS, Azure, and Google Cloud for optimal performance and availability.
        </p>
      </div>
    </div>
  );
};

export default ComputeInstance;
