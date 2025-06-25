
import { PipelineConfiguration } from "@/types/configuration";

export class ConfigurationService {
  private static readonly STORAGE_KEY = "powerprint_configurations";

  static saveConfiguration(config: Omit<PipelineConfiguration, "id" | "createdAt">): PipelineConfiguration {
    const configurations = this.getAllConfigurations();
    
    const newConfiguration: PipelineConfiguration = {
      ...config,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };

    configurations.push(newConfiguration);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configurations));
    
    return newConfiguration;
  }

  static getAllConfigurations(): PipelineConfiguration[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  static getConfiguration(id: string): PipelineConfiguration | null {
    const configurations = this.getAllConfigurations();
    return configurations.find(config => config.id === id) || null;
  }

  static updateConfiguration(id: string, updates: Partial<PipelineConfiguration>): boolean {
    const configurations = this.getAllConfigurations();
    const index = configurations.findIndex(config => config.id === id);
    
    if (index === -1) return false;
    
    configurations[index] = {
      ...configurations[index],
      ...updates,
      lastUsed: new Date().toISOString()
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configurations));
    return true;
  }

  static deleteConfiguration(id: string): boolean {
    const configurations = this.getAllConfigurations();
    const filtered = configurations.filter(config => config.id !== id);
    
    if (filtered.length === configurations.length) return false;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  static markAsUsed(id: string): void {
    this.updateConfiguration(id, { lastUsed: new Date().toISOString() });
  }
}
