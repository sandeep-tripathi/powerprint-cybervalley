import { Cpu, Zap, Award, Cloud, Monitor } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ComputeInstanceDropdownProps {
  selectedInstance: string;
  setSelectedInstance: (instance: string) => void;
}

const ComputeInstanceDropdown = ({ selectedInstance, setSelectedInstance }: ComputeInstanceDropdownProps) => {
  const instances = [
    {
      id: "basic",
      name: "Basic",
      description: "2 vCPUs, 8GB RAM",
      icon: Cpu,
      speed: "3-5 min",
      price: "€0.10/run",
      provider: "AWS t3.large"
    },
    {
      id: "pro",
      name: "Pro",
      description: "8 vCPUs, 32GB RAM, GPU",
      icon: Zap,
      speed: "1-2 min",
      price: "€0.50/run",
      provider: "AWS p3.2xlarge",
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "16 vCPUs, 64GB RAM, High-end GPU",
      icon: Award,
      speed: "30-60 sec",
      price: "€2.00/run",
      provider: "AWS p4d.2xlarge"
    },
    {
      id: "local",
      name: "Local Machine",
      description: "Your computer's hardware",
      icon: Monitor,
      speed: "Variable",
      price: "Free",
      provider: "Local processing"
    }
  ];

  const selectedInstanceData = instances.find(i => i.id === selectedInstance);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Compute Instance</h2>
      <div>
        <Select value={selectedInstance} onValueChange={setSelectedInstance}>
          <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white">
            <SelectValue placeholder="Select compute instance..." />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600 z-50">
            {instances.map((instance) => {
              const Icon = instance.icon;
              return (
                <SelectItem 
                  key={instance.id} 
                  value={instance.id}
                  className="text-white hover:bg-slate-700 focus:bg-slate-700"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{instance.name}</span>
                          {instance.popular && (
                            <span className="bg-purple-600 text-xs px-1.5 py-0.5 rounded">Popular</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">{instance.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{instance.price}</div>
                      <div className="text-xs text-gray-400">{instance.speed}</div>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        
        {selectedInstanceData && (
          <div className="mt-2 text-xs text-gray-400">
            {selectedInstanceData.provider} • {selectedInstanceData.speed}
          </div>
        )}
      </div>

      {selectedInstance === "local" && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Monitor className="w-4 h-4 text-green-400" />
            <span className="text-green-300 font-medium text-sm">Local Processing</span>
          </div>
          <p className="text-slate-300 text-xs mb-2">
            Processing will run directly on your computer using available hardware resources.
          </p>
          <p className="text-slate-400 text-xs">
            <strong>Requirements:</strong> Modern browser with WebGL support. Performance depends on your device's CPU/GPU capabilities.
          </p>
        </div>
      )}

      {selectedInstance !== "local" && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Cloud className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-medium text-sm">Cloud Provider Info</span>
          </div>
          <p className="text-slate-300 text-xs">
            Instances are automatically provisioned across AWS, Azure, and Google Cloud for optimal performance.
          </p>
        </div>
      )}
    </div>
  );
};

export default ComputeInstanceDropdown;
