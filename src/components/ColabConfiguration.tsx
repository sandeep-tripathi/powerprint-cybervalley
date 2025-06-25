
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Zap, Cloud, AlertCircle, CheckCircle } from "lucide-react";
import { ColabIntegrationService, ColabConfig } from "@/services/colabIntegration";
import { useToast } from "@/hooks/use-toast";

interface ColabConfigurationProps {
  onConfigChange?: (config: ColabConfig) => void;
}

const ColabConfiguration = ({ onConfigChange }: ColabConfigurationProps) => {
  const [config, setConfig] = useState<ColabConfig>({
    ngrokUrl: '',
    enabled: false,
    fallbackToLocal: true
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [colabService] = useState(() => new ColabIntegrationService());
  const { toast } = useToast();

  useEffect(() => {
    const currentConfig = colabService.getConfig();
    setConfig(currentConfig);
  }, [colabService]);

  const handleConfigUpdate = (updates: Partial<ColabConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    colabService.setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    
    try {
      const isAvailable = await colabService.isColabAvailable();
      setConnectionStatus(isAvailable ? 'connected' : 'disconnected');
      
      toast({
        title: isAvailable ? "Connection Successful" : "Connection Failed",
        description: isAvailable 
          ? "Google Colab processing is available"
          : "Could not connect to Google Colab. Check your ngrok URL.",
        variant: isAvailable ? "default" : "destructive",
      });
    } catch (error) {
      setConnectionStatus('disconnected');
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to test connection",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'disconnected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Disconnected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Cloud className="w-5 h-5 text-purple-400" />
          <span>Google Colab Integration</span>
        </CardTitle>
        <CardDescription className="text-slate-300">
          Connect to Google Colab for advanced 2D to 3D processing
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-white">Enable Colab Processing</Label>
            <p className="text-sm text-slate-400">Use Google Colab for 2D to 3D conversion</p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(enabled) => handleConfigUpdate({ enabled })}
          />
        </div>

        {/* Ngrok URL Configuration */}
        <div className="space-y-2">
          <Label htmlFor="ngrokUrl" className="text-white">Ngrok URL</Label>
          <div className="flex space-x-2">
            <Input
              id="ngrokUrl"
              placeholder="https://your-ngrok-url.ngrok.io"
              value={config.ngrokUrl}
              onChange={(e) => handleConfigUpdate({ ngrokUrl: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Button
              onClick={testConnection}
              disabled={isTestingConnection || !config.ngrokUrl}
              variant="outline"
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              {isTestingConnection ? <Zap className="w-4 h-4 animate-pulse" /> : <Settings className="w-4 h-4" />}
              Test
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Your Google Colab ngrok tunnel URL</p>
            {getStatusBadge()}
          </div>
        </div>

        {/* Fallback Option */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-white">Fallback to Local Processing</Label>
            <p className="text-sm text-slate-400">Use local processing if Colab is unavailable</p>
          </div>
          <Switch
            checked={config.fallbackToLocal}
            onCheckedChange={(fallbackToLocal) => handleConfigUpdate({ fallbackToLocal })}
          />
        </div>

        {/* Setup Instructions */}
        <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
          <h4 className="text-white font-medium flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span>Setup Instructions</span>
          </h4>
          <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
            <li>Open your Google Colab notebook</li>
            <li>Install ngrok and create a tunnel to your Flask app</li>
            <li>Copy the ngrok HTTPS URL here</li>
            <li>Test the connection to verify setup</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColabConfiguration;
