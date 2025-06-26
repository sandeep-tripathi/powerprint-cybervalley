
import { useState, useEffect } from "react";
import { Cloud, Folder, FileText, Download, Eye } from "lucide-react";
import { Button } from "./ui/button";

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webViewLink: string;
  webContentLink?: string;
}

interface GoogleDriveIntegrationProps {
  onFileSelect: (file: GoogleDriveFile) => void;
  acceptedTypes?: string[];
}

const GoogleDriveIntegration = ({ 
  onFileSelect, 
  acceptedTypes = ['model/obj', 'application/octet-stream', 'text/plain'] 
}: GoogleDriveIntegrationProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string>('root');

  // Initialize Google Drive API
  const initializeGapi = async () => {
    try {
      console.log("Initializing Google Drive API...");
      
      // This would typically require Google API credentials
      // For demo purposes, we'll simulate the authentication
      setIsAuthenticated(true);
      console.log("Google Drive API initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Google Drive API:", error);
      setError("Failed to connect to Google Drive. Please check your API configuration.");
    }
  };

  // Authenticate with Google Drive
  const authenticateWithDrive = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Authenticating with Google Drive...");
      
      // Simulate authentication process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsAuthenticated(true);
      await loadFiles();
      
      console.log("Successfully authenticated with Google Drive");
    } catch (error) {
      console.error("Authentication failed:", error);
      setError("Failed to authenticate with Google Drive. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load files from Google Drive
  const loadFiles = async (folderId: string = 'root') => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Loading files from folder: ${folderId}`);
      
      // Simulate API call to get files
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock files data - in real implementation, this would come from Google Drive API
      const mockFiles: GoogleDriveFile[] = [
        {
          id: 'file1',
          name: 'model_example.obj',
          mimeType: 'application/octet-stream',
          size: '2.5 MB',
          modifiedTime: new Date().toISOString(),
          webViewLink: 'https://drive.google.com/file/d/file1/view',
          webContentLink: 'https://drive.google.com/file/d/file1/export'
        },
        {
          id: 'file2',
          name: 'sculpture.obj',
          mimeType: 'text/plain',
          size: '1.8 MB',
          modifiedTime: new Date().toISOString(),
          webViewLink: 'https://drive.google.com/file/d/file2/view',
          webContentLink: 'https://drive.google.com/file/d/file2/export'
        },
        {
          id: 'folder1',
          name: '3D Models',
          mimeType: 'application/vnd.google-apps.folder',
          modifiedTime: new Date().toISOString(),
          webViewLink: 'https://drive.google.com/drive/folders/folder1'
        }
      ];
      
      setFiles(mockFiles);
      setCurrentFolder(folderId);
      console.log(`Loaded ${mockFiles.length} items from Google Drive`);
    } catch (error) {
      console.error("Failed to load files:", error);
      setError("Failed to load files from Google Drive. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter files by accepted types
  const filteredFiles = files.filter(file => {
    if (file.mimeType === 'application/vnd.google-apps.folder') return true;
    return acceptedTypes.some(type => 
      file.mimeType.includes(type) || 
      file.name.toLowerCase().endsWith('.obj') ||
      file.name.toLowerCase().endsWith('.ply') ||
      file.name.toLowerCase().endsWith('.stl')
    );
  });

  const handleFileClick = (file: GoogleDriveFile) => {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      loadFiles(file.id);
    } else {
      onFileSelect(file);
    }
  };

  const formatFileSize = (size: string | undefined) => {
    return size || 'Unknown size';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    initializeGapi();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center">
          <Cloud className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect to Google Drive</h3>
          <p className="text-gray-600 mb-4">
            Access your 3D models stored in Google Drive
          </p>
          
          <Button
            onClick={authenticateWithDrive}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4 mr-2" />
                Connect Google Drive
              </>
            )}
          </Button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Google Drive Files</h3>
        <Button
          onClick={() => loadFiles(currentFolder)}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? (
            <div className="w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            "Refresh"
          )}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No 3D model files found</p>
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => handleFileClick(file)}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-100"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {file.mimeType === 'application/vnd.google-apps.folder' ? (
                  <Folder className="w-6 h-6 text-blue-500" />
                ) : (
                  <FileText className="w-6 h-6 text-purple-500" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {file.mimeType === 'application/vnd.google-apps.folder' 
                    ? 'Folder' 
                    : `${formatFileSize(file.size)} • ${formatDate(file.modifiedTime)}`
                  }
                </p>
              </div>
              
              {file.mimeType !== 'application/vnd.google-apps.folder' && (
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(file.webViewLink, '_blank');
                    }}
                    className="p-1 h-auto"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileSelect(file);
                    }}
                    className="p-1 h-auto"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GoogleDriveIntegration;
