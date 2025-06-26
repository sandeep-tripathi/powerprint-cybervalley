
import { useState, useEffect } from "react";
import { ParsedObjData } from "@/components/ObjFileParser";

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
    realMesh?: any;
    objData?: ParsedObjData; // Add support for OBJ data
  };
  processingTime: number;
  status: "completed" | "failed";
  type: "powerprint" | "obj"; // Add type to distinguish between generated and uploaded models
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
    processingTime: number,
    type: "powerprint" | "obj" = "powerprint"
  ) => {
    const newItem: GenerationHistoryItem = {
      id: `powerprint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      modelName,
      imageNames,
      modelData,
      processingTime,
      status: "completed",
      type
    };

    setHistory(prev => [newItem, ...prev].slice(0, 50)); // Keep only last 50 items
  };

  const addObjToHistory = (fileName: string, objData: ParsedObjData) => {
    const modelData = {
      meshData: null,
      textureUrl: "",
      complexity: Math.floor(objData.vertices.length / 100), // Rough complexity estimate
      vertices: objData.vertices.length / 3,
      faces: objData.faces.length / 3,
      objData: objData
    };

    addToHistory(
      fileName.replace('.obj', ''),
      [],
      modelData,
      0, // No processing time for uploaded files
      "obj"
    );
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
    addObjToHistory,
    clearHistory,
    removeFromHistory
  };
};
