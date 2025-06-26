
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Terminal, X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LinuxTerminal = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "PowerPrint Linux Terminal v1.0",
    "Welcome to the integrated Linux environment",
    "Type 'help' for available commands",
    ""
  ]);
  const [currentDirectory, setCurrentDirectory] = useState("~");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = {
    help: () => "Available commands: ls, pwd, cd, mkdir, touch, cat, echo, clear, date, whoami, uname",
    ls: () => "Documents  Downloads  Pictures  Videos  powerprint-models/",
    pwd: () => `/home/user/${currentDirectory === "~" ? "" : currentDirectory}`,
    cd: (args: string[]) => {
      if (args.length === 0 || args[0] === "~") {
        setCurrentDirectory("~");
        return "";
      } else if (args[0] === "..") {
        setCurrentDirectory("~");
        return "";
      } else {
        setCurrentDirectory(args[0]);
        return "";
      }
    },
    mkdir: (args: string[]) => args.length > 0 ? `Directory '${args[0]}' created` : "mkdir: missing operand",
    touch: (args: string[]) => args.length > 0 ? `File '${args[0]}' created` : "touch: missing operand",
    cat: (args: string[]) => args.length > 0 ? `Contents of ${args[0]}` : "cat: missing operand",
    echo: (args: string[]) => args.join(" "),
    clear: () => {
      setHistory(["PowerPrint Linux Terminal v1.0", ""]);
      return "";
    },
    date: () => new Date().toString(),
    whoami: () => "powerprint-user",
    uname: () => "Linux powerprint-system 5.15.0 #1 SMP x86_64 GNU/Linux"
  };

  const executeCommand = (command: string) => {
    const [cmd, ...args] = command.trim().split(" ");
    const commandFunc = commands[cmd as keyof typeof commands];
    
    if (commandFunc) {
      const result = commandFunc(args);
      if (result) {
        setHistory(prev => [...prev, `$ ${command}`, result, ""]);
      } else if (cmd !== "clear") {
        setHistory(prev => [...prev, `$ ${command}`, ""]);
      }
    } else if (command.trim()) {
      setHistory(prev => [...prev, `$ ${command}`, `bash: ${cmd}: command not found`, ""]);
    }
    
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
    }
  };

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

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-black border-t border-gray-600 z-50 transition-all duration-300",
      isMinimized ? "h-12" : "h-80"
    )}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-600">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-white text-sm font-medium">Linux Terminal</span>
          <span className="text-gray-400 text-xs">({currentDirectory})</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      {!isMinimized && (
        <div className="h-[calc(100%-48px)] bg-black text-green-400 font-mono text-sm">
          <div
            ref={terminalRef}
            className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600"
          >
            {history.map((line, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {line}
              </div>
            ))}
            <div className="flex items-center">
              <span className="text-green-400">user@powerprint:{currentDirectory}$ </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent border-none outline-none text-green-400 ml-1"
                placeholder=""
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinuxTerminal;
