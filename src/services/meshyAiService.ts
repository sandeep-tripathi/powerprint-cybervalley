
export interface MeshyTask {
  id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED';
  progress: number;
  result?: {
    model_urls: {
      glb: string;
      fbx: string;
      usdz: string;
      obj: string;
      mtl: string;
    };
    thumbnail_url: string;
    video_url: string;
  };
  task_error?: {
    message: string;
  };
}

export interface MeshyGenerationRequest {
  image_url: string;
  enable_pbr: boolean;
  surface_mode: 'hard' | 'organic';
  target_polycount: number;
}

export class MeshyAiService {
  private apiKey: string;
  private baseUrl = 'https://api.meshy.ai';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createImageTo3DTask(imageFile: File): Promise<string> {
    // First, we need to upload the image or convert it to base64
    const formData = new FormData();
    formData.append('file', imageFile);

    // Convert image to base64 for the API
    const base64Image = await this.fileToBase64(imageFile);
    
    const response = await fetch(`${this.baseUrl}/v2/image-to-3d`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: base64Image,
        enable_pbr: true,
        surface_mode: 'hard',
        target_polycount: 30000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Meshy API error: ${error.message || response.statusText}`);
    }

    const result = await response.json();
    return result.id;
  }

  async getTaskStatus(taskId: string): Promise<MeshyTask> {
    const response = await fetch(`${this.baseUrl}/v2/image-to-3d/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Meshy API error: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  async waitForCompletion(taskId: string, onProgress?: (progress: number) => void): Promise<MeshyTask> {
    const maxAttempts = 120; // 10 minutes maximum
    let attempts = 0;

    while (attempts < maxAttempts) {
      const task = await this.getTaskStatus(taskId);
      
      if (onProgress) {
        onProgress(task.progress);
      }

      if (task.status === 'SUCCEEDED') {
        return task;
      }

      if (task.status === 'FAILED') {
        throw new Error(`Task failed: ${task.task_error?.message || 'Unknown error'}`);
      }

      // Wait 5 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }

    throw new Error('Task timeout - generation took too long');
  }

  async downloadModel(url: string): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download model: ${response.statusText}`);
    }
    return response.blob();
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
