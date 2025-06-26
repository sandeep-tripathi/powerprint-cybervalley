
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ConfigurationService } from "@/services/configurationService";
import { PipelineConfiguration } from "@/types/configuration";
import { Save, Settings, Trash2, Download, Upload } from "lucide-react";

interface ConfigurationManagerProps {
  selectedModel: string;
  selectedInstance: string;
  onConfigurationLoad: (config: PipelineConfiguration) => void;
}

const ConfigurationManager = ({ 
  selectedModel, 
  selectedInstance, 
  onConfigurationLoad 
}: ConfigurationManagerProps) => {
  const [configurations, setConfigurations] = useState<PipelineConfiguration[]>(
    ConfigurationService.getAllConfigurations()
  );
  const { toast } = useToast();

  const refreshConfigurations = () => {
    setConfigurations(ConfigurationService.getAllConfigurations());
  };

  const handleSaveConfiguration = () => {
    if (!selectedModel || !selectedInstance) {
      toast({
        title: "Error",
        description: "Please select both AI model and compute instance",
        variant: "destructive",
      });
      return;
    }

    const timestamp = new Date().toLocaleString();
    const configName = `Config ${timestamp}`;

    const newConfig = ConfigurationService.saveConfiguration({
      name: configName,
      description: `Configuration saved on ${timestamp}`,
      selectedModel,
      selectedInstance
    });

    refreshConfigurations();

    toast({
      title: "Configuration Saved",
      description: `Configuration "${newConfig.name}" has been saved successfully.`,
    });
  };

  const handleLoadConfiguration = (config: PipelineConfiguration) => {
    ConfigurationService.markAsUsed(config.id);
    onConfigurationLoad(config);
    refreshConfigurations();
    
    toast({
      title: "Configuration Loaded",
      description: `Configuration "${config.name}" has been applied.`,
    });
  };

  const handleDeleteConfiguration = (id: string, name: string) => {
    if (ConfigurationService.deleteConfiguration(id)) {
      refreshConfigurations();
      toast({
        title: "Configuration Deleted",
        description: `Configuration "${name}" has been deleted.`,
      });
    }
  };

  const exportConfiguration = (config: PipelineConfiguration) => {
    const exportData = {
      ...config,
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: "application/json" 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `powerprint-config-${config.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Configuration Exported",
      description: `Configuration "${config.name}" has been exported.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Configuration Manager</h3>
        
        <Button 
          onClick={handleSaveConfiguration}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>

      <div className="grid gap-3">
        {configurations.length === 0 ? (
          <Card className="bg-slate-800 border-slate-600">
            <CardContent className="p-4 text-center">
              <Settings className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-300 text-sm">No saved configurations</p>
              <p className="text-slate-400 text-xs">Save your current settings to reuse them later</p>
            </CardContent>
          </Card>
        ) : (
          configurations
            .sort((a, b) => new Date(b.lastUsed || b.createdAt).getTime() - new Date(a.lastUsed || a.createdAt).getTime())
            .map((config) => (
              <Card key={config.id} className="bg-slate-800 border-slate-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center justify-between">
                    <span>{config.name}</span>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => exportConfiguration(config)}
                        className="text-slate-300 hover:text-white h-6 w-6 p-0"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteConfiguration(config.id, config.name)}
                        className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {config.description && (
                    <p className="text-slate-400 text-xs mb-2">{config.description}</p>
                  )}
                  <div className="space-y-1 mb-3">
                    <p className="text-slate-300 text-xs">Model: {config.selectedModel}</p>
                    <p className="text-slate-300 text-xs">Instance: {config.selectedInstance}</p>
                    <p className="text-slate-400 text-xs">
                      {config.lastUsed ? `Last used: ${new Date(config.lastUsed).toLocaleDateString()}` 
                                      : `Created: ${new Date(config.createdAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleLoadConfiguration(config)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-xs"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    Load Configuration
                  </Button>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
};

export default ConfigurationManager;
