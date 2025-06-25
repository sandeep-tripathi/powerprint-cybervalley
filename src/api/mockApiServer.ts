
import { PipelineSettings, PipelineRequest, PipelineResponse, ApiStatus } from './pipelineApi';

// Mock server that simulates the REST API
export class MockApiServer {
  private settings: PipelineSettings = {
    selectedModel: "powerprint-v2",
    selectedInstance: "pro",
    apiKey: "pp_example123456789abcdefghijk"
  };

  private processingTasks: Map<string, any> = new Map();

  // Simulate API endpoints
  async handleRequest(method: string, path: string, body?: any): Promise<any> {
    console.log(`API Request: ${method} ${path}`, body);

    if (method === 'GET' && path === '/api/status') {
      return this.getStatus();
    }

    if (method === 'GET' && path === '/api/settings') {
      return this.getSettings();
    }

    if (method === 'PUT' && path === '/api/settings') {
      return this.updateSettings(body);
    }

    if (method === 'POST' && path === '/api/pipeline/process') {
      return this.processImages(body);
    }

    if (method === 'GET' && path.startsWith('/api/pipeline/status/')) {
      const taskId = path.split('/').pop();
      return this.getProcessingStatus(taskId!);
    }

    throw new Error(`Endpoint not found: ${method} ${path}`);
  }

  private async getStatus(): Promise<ApiStatus> {
    return {
      version: "1.0.0",
      status: "online",
      supportedModels: [
        "powerprint-v2",
        "powerprint-pro",
        "powerprint-ultra",
        "trellis-v1",
        "custom-vision"
      ],
      supportedInstances: [
        "basic",
        "pro", 
        "enterprise"
      ]
    };
  }

  private async getSettings(): Promise<PipelineSettings> {
    return { ...this.settings };
  }

  private async updateSettings(newSettings: Partial<PipelineSettings>): Promise<{ success: boolean }> {
    this.settings = { ...this.settings, ...newSettings };
    console.log("Settings updated:", this.settings);
    return { success: true };
  }

  private async processImages(request: PipelineRequest): Promise<PipelineResponse> {
    try {
      const startTime = Date.now();
      
      // Simulate processing delay based on instance type
      const delays = {
        basic: 4000,
        pro: 2000,
        enterprise: 1000
      };
      
      const delay = delays[request.settings.selectedInstance as keyof typeof delays] || 3000;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Simulate generating model data
      const processingTime = Date.now() - startTime;
      const complexity = Math.min(request.images.length * 1000 + 2000, 8000);
      const vertices = Math.floor(complexity * 0.8);
      const faces = Math.floor(complexity * 0.6);

      const modelData = {
        meshData: {
          type: "powerprint_generated",
          algorithm: "gaussian_splatting_to_mesh",
          inputImages: request.images.length,
          processingTime,
          model: request.settings.selectedModel,
          instance: request.settings.selectedInstance
        },
        textureUrl: `data:image/png;base64,${request.images[0]}`, // Use first image as texture
        complexity,
        vertices,
        faces
      };

      return {
        success: true,
        modelData,
        processingTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Processing failed"
      };
    }
  }

  private async getProcessingStatus(taskId: string): Promise<any> {
    const task = this.processingTasks.get(taskId);
    if (!task) {
      return {
        status: "failed",
        error: "Task not found"
      };
    }

    return task;
  }
}

// Global mock server instance
export const mockApiServer = new MockApiServer();
