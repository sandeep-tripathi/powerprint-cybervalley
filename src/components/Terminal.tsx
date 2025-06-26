import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal as TerminalIcon, X, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const Terminal = () => {
  const [isMinimized, setIsMinimized] = useState(true); // Changed to true for minimized by default
  const [isVisible, setIsVisible] = useState(true);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "PowerPrint Linux Terminal v1.0",
    "Welcome to the PowerPrint development environment!",
    "user@powerprint:~$ "
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDirectory, setCurrentDirectory] = useState("~");
  const [fileSystem, setFileSystem] = useState<{[key: string]: string[]}>({
    "~": ["Documents", "Downloads", "Pictures", "projects"],
    "~/Documents": ["readme.txt", "notes.md"],
    "~/Downloads": ["model.obj", "texture.png"],
    "~/Pictures": ["screenshot.png"],
    "~/projects": ["powerprint-app", "3d-models"],
    "~/projects/powerprint-app": ["src", "package.json", "README.md"],
    "~/projects/3d-models": ["cube.obj", "sphere.obj"]
  });
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

  const executeLinuxCommand = (command: string) => {
    const trimmedCommand = command.trim();
    
    if (!trimmedCommand) return [`user@powerprint:${currentDirectory}$ `];
    
    // Add command to history
    setCommandHistory(prev => [...prev, trimmedCommand]);
    setHistoryIndex(-1);
    
    const output = [`user@powerprint:${currentDirectory}$ ${trimmedCommand}`];
    const args = trimmedCommand.split(' ');
    const cmd = args[0];
    
    try {
      switch (cmd) {
        case "ls":
          const lsPath = args[1] || currentDirectory;
          const files = fileSystem[lsPath] || [];
          if (files.length > 0) {
            output.push(files.join("  "));
          } else {
            output.push("ls: cannot access '" + lsPath + "': No such file or directory");
          }
          break;
          
        case "pwd":
          output.push(currentDirectory);
          break;
          
        case "cd":
          const targetDir = args[1];
          if (!targetDir || targetDir === "~") {
            setCurrentDirectory("~");
          } else if (targetDir === "..") {
            const pathParts = currentDirectory.split('/');
            if (pathParts.length > 1) {
              pathParts.pop();
              const newPath = pathParts.join('/') || "~";
              setCurrentDirectory(newPath);
            }
          } else {
            let newPath;
            if (targetDir.startsWith('/')) {
              newPath = targetDir;
            } else if (targetDir.startsWith('~')) {
              newPath = targetDir;
            } else {
              newPath = currentDirectory === "~" ? `~/${targetDir}` : `${currentDirectory}/${targetDir}`;
            }
            
            if (fileSystem[newPath]) {
              setCurrentDirectory(newPath);
            } else {
              output.push(`cd: ${targetDir}: No such file or directory`);
            }
          }
          break;
          
        case "cat":
          const fileName = args[1];
          if (!fileName) {
            output.push("cat: missing file operand");
          } else if (fileName === "readme.txt") {
            output.push("Welcome to PowerPrint!");
            output.push("This is your AI-powered 3D model generation platform.");
          } else if (fileName === "notes.md") {
            output.push("# Development Notes");
            output.push("- Implement new 3D algorithms");
            output.push("- Optimize rendering performance");
          } else if (fileName === "package.json") {
            output.push("{");
            output.push('  "name": "powerprint-app",');
            output.push('  "version": "1.0.0",');
            output.push('  "description": "AI-powered 3D generation"');
            output.push("}");
          } else {
            output.push(`cat: ${fileName}: No such file or directory`);
          }
          break;
          
        case "mkdir":
          const dirName = args[1];
          if (!dirName) {
            output.push("mkdir: missing operand");
          } else {
            const newDirPath = currentDirectory === "~" ? `~/${dirName}` : `${currentDirectory}/${dirName}`;
            setFileSystem(prev => ({
              ...prev,
              [currentDirectory]: [...(prev[currentDirectory] || []), dirName],
              [newDirPath]: []
            }));
          }
          break;
          
        case "touch":
          const fileName2 = args[1];
          if (!fileName2) {
            output.push("touch: missing file operand");
          } else {
            setFileSystem(prev => ({
              ...prev,
              [currentDirectory]: [...(prev[currentDirectory] || []), fileName2]
            }));
          }
          break;
          
        case "rm":
          const fileToRemove = args[1];
          if (!fileToRemove) {
            output.push("rm: missing operand");
          } else {
            setFileSystem(prev => ({
              ...prev,
              [currentDirectory]: (prev[currentDirectory] || []).filter(f => f !== fileToRemove)
            }));
          }
          break;
          
        case "echo":
          const message = args.slice(1).join(' ');
          output.push(message);
          break;
          
        case "whoami":
          output.push("user");
          break;
          
        case "date":
          output.push(new Date().toString());
          break;
          
        case "uname":
          if (args[1] === "-a") {
            output.push("Linux powerprint 5.15.0 #1 SMP x86_64 GNU/Linux");
          } else {
            output.push("Linux");
          }
          break;
          
        case "ps":
          output.push("  PID TTY          TIME CMD");
          output.push(" 1234 pts/0    00:00:01 bash");
          output.push(" 5678 pts/0    00:00:00 powerprint");
          break;
          
        case "df":
          output.push("Filesystem     1K-blocks    Used Available Use% Mounted on");
          output.push("/dev/sda1       20971520 8388608  12582912  40% /");
          break;
          
        case "free":
          output.push("              total        used        free      shared");
          output.push("Mem:        8192000     4096000     4096000           0");
          output.push("Swap:       2048000           0     2048000");
          break;
          
        case "clear":
          return [
            "PowerPrint Linux Terminal v1.0",
            "Welcome to the PowerPrint development environment!",
            `user@powerprint:${currentDirectory}$ `
          ];
          
        case "help":
          output.push("Available commands:");
          output.push("ls, cd, pwd, cat, mkdir, touch, rm, echo, whoami, date, uname, ps, df, free, clear, help");
          break;
          
        case "exit":
          output.push("logout");
          break;
          
        default:
          output.push(`${cmd}: command not found`);
      }
    } catch (error) {
      output.push("bash: command error occurred");
    }
    
    output.push(`user@powerprint:${currentDirectory}$ `);
    return output;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOutput = executeLinuxCommand(input);
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
                <span className="text-green-400">{`user@powerprint:${currentDirectory}$ `}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-green-400 outline-none font-mono ml-1"
                  placeholder="Enter Linux commands..."
                  autoComplete="off"
                />
              </form>
            </div>
            <div className="bg-gray-800 p-2 text-xs text-gray-300">
              <p>PowerPrint Linux Terminal • Type 'help' for available commands • Arrow keys for history</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Terminal;
