
export interface ColabProcessingRequest {
  images: string[]; // Base64 encoded images
  processingOptions: {
    extrusionHeight: number;
    resolution: number;
    generateBackface: boolean;
    textureResolution: number;
  };
}

export interface ColabProcessingResponse {
  success: boolean;
  meshData?: {
    vertices: number[];
    faces: number[];
    normals: number[];
    uvCoordinates: number[];
    boundingBox: {
      min: { x: number; y: number; z: number };
      max: { x: number; y: number; z: number };
    };
  };
  textureData?: string; // Base64 encoded texture
  processingTime?: number;
  error?: string;
}

export interface ColabConfig {
  ngrokUrl: string;
  enabled: boolean;
  fallbackToLocal: boolean;
}

export class ColabIntegrationService {
  private config: ColabConfig = {
    ngrokUrl: '',
    enabled: false,
    fallbackToLocal: true
  };

  constructor() {
    // Load configuration from localStorage
    this.loadConfig();
  }

  setConfig(config: Partial<ColabConfig>): void {
    this.config = { ...this.config, ...config };
    this.saveConfig();
  }

  getConfig(): ColabConfig {
    return { ...this.config };
  }

  private saveConfig(): void {
    localStorage.setItem('colabConfig', JSON.stringify(this.config));
  }

  private loadConfig(): void {
    const saved = localStorage.getItem('colabConfig');
    if (saved) {
      try {
        this.config = { ...this.config, ...JSON.parse(saved) };
      } catch (error) {
        console.warn('Failed to load Colab config:', error);
      }
    }
  }

  async isColabAvailable(): Promise<boolean> {
    if (!this.config.enabled || !this.config.ngrokUrl) {
      return false;
    }

    try {
      const response = await fetch(`${this.config.ngrokUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      return response.ok;
    } catch (error) {
      console.warn('Colab service not available:', error);
      return false;
    }
  }

  async processImagesWithColab(request: ColabProcessingRequest): Promise<ColabProcessingResponse> {
    if (!this.config.enabled || !this.config.ngrokUrl) {
      throw new Error('Colab integration not configured');
    }

    const response = await fetch(`${this.config.ngrokUrl}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(60000), // 60 second timeout for processing
    });

    if (!response.ok) {
      throw new Error(`Colab processing failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async convertImagesToBase64(images: File[]): Promise<string[]> {
    const base64Images: string[] = [];
    
    for (const image of images) {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });
      
      base64Images.push(base64);
    }
    
    return base64Images;
  }
}
