
export interface PipelineConfiguration {
  id: string;
  name: string;
  description?: string;
  selectedModel: string;
  selectedInstance: string;
  apiKey?: string;
  createdAt: string;
  lastUsed?: string;
}

export interface ConfigurationFormData {
  name: string;
  description?: string;
}
