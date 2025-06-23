
import { Cpu, Zap, Award, Cloud, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ComputeInstanceProps {
  selectedInstance: string;
  setSelectedInstance: (instance: string) => void;
}

const ComputeInstance = ({ selectedInstance, setSelectedInstance }: ComputeInstanceProps) => {
  const [selectedProviders, setSelectedProviders] = useState<{[key: string]: string}>({
    basic: "AWS",
    pro: "Azure", 
    enterprise: "Google Cloud"
  });

  const instances = [
    {
      id: "basic",
      name: "Basic",
      description: "2 vCPUs, 8GB RAM",
      icon: Cpu,
      speed: "3-5 min",
      price: "Free",
      color: "from-gray-500 to-gray-600",
      providers: {
        "AWS": { instanceType: "t3.large", specs: "Intel Xeon, 2 vCPUs, 8GB RAM" },
        "Azure": { instanceType: "Standard_B2s", specs: "Intel Xeon, 2 vCPUs, 4GB RAM" },
        "Google Cloud": { instanceType: "e2-standard-2", specs: "Intel Skylake, 2 vCPUs, 8GB RAM" }
      }
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
      providers: {
        "AWS": { instanceType: "p3.2xlarge", specs: "NVIDIA V100, 8 vCPUs, 61GB RAM" },
        "Azure": { instanceType: "Standard_NC6s_v3", specs: "NVIDIA V100, 6 vCPUs, 112GB RAM" },
        "Google Cloud": { instanceType: "n1-standard-8 + T4", specs: "NVIDIA T4, 8 vCPUs, 30GB RAM" }
      }
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "16 vCPUs, 64GB RAM, High-end GPU",
      icon: Award,
      speed: "30-60 sec",
      price: "$2.00/run",
      color: "from-purple-500 to-pink-500",
      providers: {
        "AWS": { instanceType: "p4d.2xlarge", specs: "NVIDIA A100, 8 vCPUs, 96GB RAM" },
        "Azure": { instanceType: "Standard_NC24rs_v3", specs: "NVIDIA V100, 24 vCPUs, 448GB RAM" },
        "Google Cloud": { instanceType: "n1-standard-16 + A100", specs: "NVIDIA A100, 16 vCPUs, 60GB RAM" }
      }
    }
  ];

  const getProviderLogo = (provider: string) => {
    switch (provider) {
      case "AWS":
        return "🟠";
      case "Azure":
        return "🔵";
      case "Google Cloud":
        return "🔴";
      default:
        return "☁️";
    }
  };

  const handleProviderChange = (instanceId: string, provider: string) => {
    setSelectedProviders(prev => ({
      ...prev,
      [instanceId]: provider
    }));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Compute Instance</h2>
      
      <div className="space-y-3">
        {instances.map((instance) => {
          const Icon = instance.icon;
          const currentProvider = selectedProviders[instance.id];
          const currentProviderData = instance.providers[currentProvider];
          
          return (
            <div
              key={instance.id}
              className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                selectedInstance === instance.id
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
              }`}
              onClick={() => setSelectedInstance(instance.id)}
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
                      
                      <Popover>
                        <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs border border-white/20 hover:border-white/40"
                          >
                            <span className="text-lg mr-1">{getProviderLogo(currentProvider)}</span>
                            <span className="text-gray-300">{currentProvider}</span>
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-slate-800 border-slate-700" onClick={(e) => e.stopPropagation()}>
                          <div className="space-y-3">
                            <h4 className="font-medium text-white">Select Cloud Provider</h4>
                            <RadioGroup 
                              value={currentProvider} 
                              onValueChange={(value) => handleProviderChange(instance.id, value)}
                            >
                              {Object.entries(instance.providers).map(([provider, data]) => (
                                <div key={provider} className="flex items-start space-x-3 p-2 rounded border border-slate-600 hover:border-slate-500">
                                  <RadioGroupItem value={provider} id={`${instance.id}-${provider}`} className="mt-1" />
                                  <div className="flex-1">
                                    <label htmlFor={`${instance.id}-${provider}`} className="flex items-center space-x-2 cursor-pointer">
                                      <span className="text-lg">{getProviderLogo(provider)}</span>
                                      <span className="text-white font-medium">{provider}</span>
                                    </label>
                                    <p className="text-xs text-gray-400 mt-1">{data.instanceType}</p>
                                    <p className="text-xs text-gray-500">{data.specs}</p>
                                  </div>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <p className="text-gray-400 text-sm">{instance.description}</p>
                    <p className="text-gray-500 text-xs">{currentProviderData.instanceType} • {currentProviderData.specs}</p>
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
