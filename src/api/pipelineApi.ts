
export interface PipelineSettings {
  selectedModel: string;
  selectedInstance: string;
  apiKey: string;
}

export interface PipelineRequest {
  images: string[]; // Base64 encoded images
  settings: PipelineSettings;
}

export interface PipelineResponse {
  success: boolean;
  modelData?: {
    meshData: any;
    textureUrl: string;
    complexity: number;
    vertices: number;
    faces: number;
  };
  processingTime?: number;
  error?: string;
}

export interface ApiStatus {
  version: string;
  status: "online" | "offline";
  supportedModels: string[];
  supportedInstances: string[];
}

export class PipelineApiService {
  private baseUrl: string;

  constructor(baseUrl: string = window.location.origin) {
    this.baseUrl = baseUrl;
  }

  // Get API status and available options
  async getStatus(): Promise<ApiStatus> {
    const response = await fetch(`${this.baseUrl}/api/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get current pipeline settings
  async getSettings(): Promise<PipelineSettings> {
    const response = await fetch(`${this.baseUrl}/api/settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Update pipeline settings
  async updateSettings(settings: Partial<PipelineSettings>): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/api/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Process images through the pipeline
  async processImages(request: PipelineRequest): Promise<PipelineResponse> {
    const response = await fetch(`${this.baseUrl}/api/pipeline/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get processing status for async operations
  async getProcessingStatus(taskId: string): Promise<{
    status: "pending" | "processing" | "completed" | "failed";
    progress?: number;
    result?: PipelineResponse;
  }> {
    const response = await fetch(`${this.baseUrl}/api/pipeline/status/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
