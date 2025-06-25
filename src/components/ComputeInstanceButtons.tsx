
import { Cpu, Zap, Award, Cloud, Check } from "lucide-react";

interface ComputeInstanceButtonsProps {
  selectedInstance: string;
  setSelectedInstance: (instance: string) => void;
}

const ComputeInstanceButtons = ({ selectedInstance, setSelectedInstance }: ComputeInstanceButtonsProps) => {
  const instances = [
    {
      id: "basic-aws",
      name: "Basic",
      description: "2 vCPUs, 8GB RAM",
      icon: Cpu,
      speed: "3-5 min",
      price: "Free",
      provider: "AWS t3.large",
      cloudProvider: "AWS"
    },
    {
      id: "basic-google",
      name: "Basic",
      description: "2 vCPUs, 8GB RAM",
      icon: Cpu,
      speed: "3-5 min",
      price: "Free",
      provider: "Google e2-standard-2",
      cloudProvider: "Google Cloud"
    },
    {
      id: "basic-azure",
      name: "Basic",
      description: "2 vCPUs, 8GB RAM",
      icon: Cpu,
      speed: "3-5 min",
      price: "Free",
      provider: "Azure Standard_D2s_v3",
      cloudProvider: "Azure"
    },
    {
      id: "pro-aws",
      name: "Pro",
      description: "8 vCPUs, 32GB RAM, GPU",
      icon: Zap,
      speed: "1-2 min",
      price: "$0.50/run",
      provider: "AWS p3.2xlarge",
      cloudProvider: "AWS",
      popular: true
    },
    {
      id: "pro-google",
      name: "Pro",
      description: "8 vCPUs, 32GB RAM, GPU",
      icon: Zap,
      speed: "1-2 min",
      price: "$0.50/run",
      provider: "Google n1-standard-8 + T4 GPU",
      cloudProvider: "Google Cloud"
    },
    {
      id: "pro-azure",
      name: "Pro",
      description: "8 vCPUs, 32GB RAM, GPU",
      icon: Zap,
      speed: "1-2 min",
      price: "$0.50/run",
      provider: "Azure Standard_NC8as_T4_v3",
      cloudProvider: "Azure"
    },
    {
      id: "enterprise-aws",
      name: "Enterprise",
      description: "16 vCPUs, 64GB RAM, High-end GPU",
      icon: Award,
      speed: "30-60 sec",
      price: "$2.00/run",
      provider: "AWS p4d.2xlarge",
      cloudProvider: "AWS"
    },
    {
      id: "enterprise-google",
      name: "Enterprise",
      description: "16 vCPUs, 64GB RAM, High-end GPU",
      icon: Award,
      speed: "30-60 sec",
      price: "$2.00/run",
      provider: "Google n1-standard-16 + V100 GPU",
      cloudProvider: "Google Cloud"
    },
    {
      id: "enterprise-azure",
      name: "Enterprise",
      description: "16 vCPUs, 64GB RAM, High-end GPU",
      icon: Award,
      speed: "30-60 sec",
      price: "$2.00/run",
      provider: "Azure Standard_NC24s_v3",
      cloudProvider: "Azure"
    }
  ];

  const selectedInstanceData = instances.find(i => i.id === selectedInstance);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-3">
          Compute Instance
        </label>
        <div className="grid grid-cols-1 gap-2">
          {instances.map((instance) => {
            const Icon = instance.icon;
            const isSelected = selectedInstance === instance.id;
            return (
              <button
                key={instance.id}
                onClick={() => setSelectedInstance(instance.id)}
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                  isSelected
                    ? "bg-purple-600 border-purple-500 text-white"
                    : "bg-slate-800 border-slate-600 text-white hover:bg-slate-700 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{instance.name}</span>
                        <span className="text-xs text-blue-400 bg-blue-900/30 px-1.5 py-0.5 rounded">
                          {instance.cloudProvider}
                        </span>
                        {instance.popular && (
                          <span className="bg-yellow-600 text-xs px-1.5 py-0.5 rounded">Popular</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{instance.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="font-medium">{instance.price}</div>
                      <div className="text-xs text-gray-400">{instance.speed}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {selectedInstanceData && (
          <div className="mt-2 text-xs text-gray-400">
            {selectedInstanceData.provider} • {selectedInstanceData.speed}
          </div>
        )}
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Cloud className="w-4 h-4 text-purple-400" />
          <span className="text-purple-300 font-medium text-sm">Cloud Provider Info</span>
        </div>
        <p className="text-slate-300 text-xs">
          Choose your preferred cloud provider. Instances are automatically provisioned across AWS, Azure, and Google Cloud for optimal performance and availability.
        </p>
      </div>
    </div>
  );
};

export default ComputeInstanceButtons;
