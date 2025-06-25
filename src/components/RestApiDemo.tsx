
import { useState } from "react";
import { PipelineApiService, PipelineSettings, PipelineRequest } from "@/api/pipelineApi";
import { mockApiServer } from "@/api/mockApiServer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Code, Play, Settings, Cloud } from "lucide-react";

const RestApiDemo = () => {
  const [apiResponse, setApiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState("status");
  const [requestBody, setRequestBody] = useState("");
  const { toast } = useToast();

  const apiService = new PipelineApiService();

  // Mock the fetch function to use our mock server
  const originalFetch = window.fetch;
  window.fetch = async (url: string | URL | Request, options?: RequestInit) => {
    const urlString = url.toString();
    const path = urlString.replace(window.location.origin, '');
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.parse(options.body as string) : undefined;

    try {
      const result = await mockApiServer.handleRequest(method, path, body);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };

  const endpoints = [
    {
      id: "status",
      method: "GET",
      path: "/api/status",
      description: "Get API status and available options",
      example: null
    },
    {
      id: "getSettings",
      method: "GET", 
      path: "/api/settings",
      description: "Get current pipeline settings",
      example: null
    },
    {
      id: "updateSettings",
      method: "PUT",
      path: "/api/settings", 
      description: "Update pipeline settings",
      example: JSON.stringify({
        selectedModel: "powerprint-pro",
        selectedInstance: "enterprise",
        apiKey: "pp_new_api_key_here"
      }, null, 2)
    },
    {
      id: "processImages",
      method: "POST",
      path: "/api/pipeline/process",
      description: "Process images through PowerPrint pipeline",
      example: JSON.stringify({
        images: ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."], // Base64 image data
        settings: {
          selectedModel: "powerprint-v2",
          selectedInstance: "pro",
          apiKey: "pp_example123456789abcdefghijk"
        }
      }, null, 2)
    }
  ];

  const executeApiCall = async () => {
    setIsLoading(true);
    setApiResponse("");

    try {
      let result;
      const endpoint = endpoints.find(e => e.id === selectedEndpoint);
      
      if (!endpoint) {
        throw new Error("Invalid endpoint selected");
      }

      switch (selectedEndpoint) {
        case "status":
          result = await apiService.getStatus();
          break;
          
        case "getSettings":
          result = await apiService.getSettings();
          break;
          
        case "updateSettings":
          const updateData = requestBody ? JSON.parse(requestBody) : {};
          result = await apiService.updateSettings(updateData);
          break;
          
        case "processImages":
          const processData = requestBody ? JSON.parse(requestBody) : {
            images: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="],
            settings: {
              selectedModel: "powerprint-v2",
              selectedInstance: "pro",
              apiKey: "pp_example123456789abcdefghijk"
            }
          };
          result = await apiService.processImages(processData);
          break;
          
        default:
          throw new Error("Endpoint not implemented");
      }

      setApiResponse(JSON.stringify(result, null, 2));
      toast({
        title: "API Call Successful",
        description: `${endpoint.method} ${endpoint.path} executed successfully`,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setApiResponse(JSON.stringify({ error: errorMessage }, null, 2));
      toast({
        title: "API Call Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedEndpointData = endpoints.find(e => e.id === selectedEndpoint);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">PowerPrint REST API</h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Access the PowerPrint pipeline and settings through our RESTful API endpoints
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Explorer */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>API Explorer</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Test the PowerPrint REST API endpoints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="endpoint" className="text-white">Select Endpoint</Label>
              <select
                id="endpoint"
                value={selectedEndpoint}
                onChange={(e) => {
                  setSelectedEndpoint(e.target.value);
                  const endpoint = endpoints.find(ep => ep.id === e.target.value);
                  setRequestBody(endpoint?.example || "");
                }}
                className="w-full mt-1 bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
              >
                {endpoints.map((endpoint) => (
                  <option key={endpoint.id} value={endpoint.id}>
                    {endpoint.method} {endpoint.path}
                  </option>
                ))}
              </select>
            </div>

            {selectedEndpointData && (
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedEndpointData.method === 'GET' ? 'bg-green-600' :
                    selectedEndpointData.method === 'POST' ? 'bg-blue-600' :
                    'bg-orange-600'
                  }`}>
                    {selectedEndpointData.method}
                  </span>
                  <code className="text-purple-300">{selectedEndpointData.path}</code>
                </div>
                <p className="text-slate-300 text-sm">{selectedEndpointData.description}</p>
              </div>
            )}

            {selectedEndpointData?.example && (
              <div>
                <Label htmlFor="requestBody" className="text-white">Request Body</Label>
                <Textarea
                  id="requestBody"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="mt-1 bg-slate-700 border-slate-600 text-white font-mono text-sm"
                  rows={8}
                  placeholder="Enter JSON request body..."
                />
              </div>
            )}

            <Button 
              onClick={executeApiCall}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? "Executing..." : "Execute API Call"}
            </Button>
          </CardContent>
        </Card>

        {/* API Response */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Code className="w-5 h-5" />
              <span>API Response</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Response from the PowerPrint API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 rounded-lg p-4 h-96 overflow-auto">
              <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                {apiResponse || "No response yet. Execute an API call to see the response."}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Documentation */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>API Documentation</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Available REST API endpoints for PowerPrint integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {endpoints.map((endpoint) => (
              <div key={endpoint.id} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    endpoint.method === 'GET' ? 'bg-green-600' :
                    endpoint.method === 'POST' ? 'bg-blue-600' :
                    'bg-orange-600'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-purple-300 font-mono">{endpoint.path}</code>
                </div>
                <p className="text-slate-300 text-sm">{endpoint.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-2">
          <Cloud className="w-5 h-5 text-purple-400" />
          <span className="text-purple-300 font-medium">Integration Info</span>
        </div>
        <p className="text-slate-300 text-sm">
          This REST API allows external applications to integrate with the PowerPrint pipeline. 
          Use these endpoints to process images, manage settings, and retrieve processing status programmatically.
        </p>
      </div>
    </div>
  );
};

export default RestApiDemo;
