
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal as TerminalIcon, X, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const Terminal = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "Python 3.11.0 (main, Oct 24 2022, 18:26:48) [MSC v.1933 64 bit (AMD64)] on win32",
    "Type \"help\", \"copyright\", \"credits\" or \"license\" for more information.",
    ">>> "
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMinimized]);

  const executePythonCommand = (command: string) => {
    const trimmedCommand = command.trim();
    
    if (!trimmedCommand) return [">>> "];
    
    // Add command to history
    setCommandHistory(prev => [...prev, trimmedCommand]);
    setHistoryIndex(-1);
    
    const output = [`>>> ${trimmedCommand}`];
    
    // Simple Python command simulation
    try {
      switch (true) {
        case trimmedCommand === "help()":
          output.push("Type help() for interactive help, or help(object) for help about object.");
          break;
        case trimmedCommand.startsWith("print("):
          const printMatch = trimmedCommand.match(/print\((.*)\)/);
          if (printMatch) {
            const content = printMatch[1].replace(/['"]/g, '');
            output.push(content);
          }
          break;
        case trimmedCommand === "import numpy as np":
          output.push("# NumPy imported successfully");
          break;
        case trimmedCommand === "import pandas as pd":
          output.push("# Pandas imported successfully");
          break;
        case trimmedCommand === "import matplotlib.pyplot as plt":
          output.push("# Matplotlib imported successfully");
          break;
        case trimmedCommand.includes("="):
          output.push("# Variable assigned");
          break;
        case /^\d+\s*[\+\-\*\/]\s*\d+$/.test(trimmedCommand):
          try {
            const result = eval(trimmedCommand);
            output.push(result.toString());
          } catch {
            output.push("SyntaxError: invalid syntax");
          }
          break;
        case trimmedCommand === "exit()" || trimmedCommand === "quit()":
          output.push("Use Ctrl+C to exit the terminal");
          break;
        case trimmedCommand === "clear":
          return [
            "Python 3.11.0 (main, Oct 24 2022, 18:26:48) [MSC v.1933 64 bit (AMD64)] on win32",
            "Type \"help\", \"copyright\", \"credits\" or \"license\" for more information.",
            ">>> "
          ];
        case trimmedCommand.startsWith("pip install"):
          const package_name = trimmedCommand.replace("pip install ", "");
          output.push(`Collecting ${package_name}`);
          output.push(`Successfully installed ${package_name}`);
          break;
        default:
          if (trimmedCommand.includes("def ") || trimmedCommand.includes("class ") || trimmedCommand.includes("for ") || trimmedCommand.includes("if ")) {
            output.push("... ");
            return output;
          } else {
            output.push(`NameError: name '${trimmedCommand.split(' ')[0]}' is not defined`);
          }
      }
    } catch (error) {
      output.push("SyntaxError: invalid syntax");
    }
    
    output.push(">>> ");
    return output;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOutput = executePythonCommand(input);
    setHistory(prev => [...prev.slice(0, -1), ...newOutput]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <Card className={cn(
        "bg-gray-900 border-gray-700 rounded-t-lg rounded-b-none transition-all duration-300",
        isMinimized ? "h-12" : "h-80"
      )}>
        <CardHeader className="p-2 bg-gray-800 rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-white flex items-center">
              <TerminalIcon className="w-4 h-4 mr-2" />
              Terminal
            </CardTitle>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-gray-700 h-6 w-6 p-0"
              >
                {isMinimized ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="text-white hover:bg-gray-700 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-0 h-64">
            <div 
              ref={terminalRef}
              className="h-48 overflow-y-auto bg-black text-green-400 font-mono text-sm p-3"
              onClick={() => inputRef.current?.focus()}
            >
              {history.slice(0, -1).map((line, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
              <form onSubmit={handleSubmit} className="flex">
                <span className="text-green-400">{">>> "}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-green-400 outline-none font-mono ml-1"
                  placeholder="Enter Python commands..."
                  autoComplete="off"
                />
              </form>
            </div>
            <div className="bg-gray-800 p-2 text-xs text-gray-300">
              <p>PowerPrint Python Terminal • Type Python commands • Use 'clear' to clear screen • Arrow keys for history</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Terminal;
