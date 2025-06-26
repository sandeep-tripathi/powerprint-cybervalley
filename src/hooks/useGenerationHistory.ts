
import { useState, useEffect } from "react";

interface GenerationHistoryItem {
  id: string;
  timestamp: Date;
  modelName: string;
  imageNames: string[];
  modelData: {
    meshData: any;
    textureUrl: string;
    complexity: number;
    vertices: number;
    faces: number;
  };
  processingTime: number;
  status: "completed" | "failed";
}

export const useGenerationHistory = () => {
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('powerprint-generation-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsedHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(historyWithDates);
      } catch (error) {
        console.error('Error loading generation history:', error);
      }
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('powerprint-generation-history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (
    modelName: string,
    imageNames: string[],
    modelData: GenerationHistoryItem['modelData'],
    processingTime: number
  ) => {
    const newItem: GenerationHistoryItem = {
      id: `powerprint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      modelName,
      imageNames,
      modelData,
      processingTime,
      status: "completed"
    };

    setHistory(prev => [newItem, ...prev].slice(0, 50)); // Keep only last 50 items
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('powerprint-generation-history');
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  };
};
