
interface NotebookTemplate {
  id: string;
  name: string;
  platform: string;
  cells: NotebookCell[];
}

interface NotebookCell {
  cell_type: 'markdown' | 'code';
  source: string[];
  metadata?: any;
}

class NotebookService {
  private templates: { [key: string]: NotebookTemplate } = {
    'computer-vision-basic': {
      id: 'computer-vision-basic',
      name: 'Computer Vision Basics',
      platform: 'colab',
      cells: [
        {
          cell_type: 'markdown',
          source: [
            '# Computer Vision Basics\n',
            '\n',
            'This notebook covers essential computer vision operations including:\n',
            '- Edge Detection using Canny and Sobel operators\n',
            '- Feature Matching with SIFT and ORB\n',
            '- Basic Object Detection\n'
          ]
        },
        {
          cell_type: 'code',
          source: [
            '# Install required packages\n',
            '!pip install opencv-python matplotlib numpy\n',
            '\n',
            'import cv2\n',
            'import numpy as np\n',
            'import matplotlib.pyplot as plt\n',
            'from google.colab import files\n'
          ]
        },
        {
          cell_type: 'code',
          source: [
            '# Upload and load image\n',
            'uploaded = files.upload()\n',
            'image_path = list(uploaded.keys())[0]\n',
            'img = cv2.imread(image_path)\n',
            'img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)\n',
            '\n',
            'plt.figure(figsize=(10, 6))\n',
            'plt.imshow(img_rgb)\n',
            'plt.title("Original Image")\n',
            'plt.axis("off")\n',
            'plt.show()\n'
          ]
        },
        {
          cell_type: 'code',
          source: [
            '# Edge Detection with Canny\n',
            'gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)\n',
            'edges = cv2.Canny(gray, 100, 200)\n',
            '\n',
            'plt.figure(figsize=(15, 5))\n',
            'plt.subplot(1, 3, 1)\n',
            'plt.imshow(gray, cmap="gray")\n',
            'plt.title("Grayscale")\n',
            'plt.axis("off")\n',
            '\n',
            'plt.subplot(1, 3, 2)\n',
            'plt.imshow(edges, cmap="gray")\n',
            'plt.title("Canny Edges")\n',
            'plt.axis("off")\n',
            '\n',
            '# Sobel Edge Detection\n',
            'sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)\n',
            'sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)\n',
            'sobel_combined = np.sqrt(sobel_x**2 + sobel_y**2)\n',
            '\n',
            'plt.subplot(1, 3, 3)\n',
            'plt.imshow(sobel_combined, cmap="gray")\n',
            'plt.title("Sobel Edges")\n',
            'plt.axis("off")\n',
            'plt.tight_layout()\n',
            'plt.show()\n'
          ]
        }
      ]
    },
    'image-processing-advanced': {
      id: 'image-processing-advanced',
      name: 'Advanced Image Processing',
      platform: 'jupyter',
      cells: [
        {
          cell_type: 'markdown',
          source: [
            '# Advanced Image Processing\n',
            '\n',
            'Advanced filtering, enhancement, and transformation techniques:\n',
            '- Gaussian and bilateral filtering\n',
            '- Morphological operations\n',
            '- Histogram equalization and CLAHE\n'
          ]
        },
        {
          cell_type: 'code',
          source: [
            'import cv2\n',
            'import numpy as np\n',
            'import matplotlib.pyplot as plt\n',
            'from skimage import morphology, filters\n',
            'from scipy import ndimage\n'
          ]
        },
        {
          cell_type: 'code',
          source: [
            '# Advanced Filtering Techniques\n',
            'def apply_advanced_filters(image):\n',
            '    # Gaussian blur\n',
            '    gaussian = cv2.GaussianBlur(image, (15, 15), 0)\n',
            '    \n',
            '    # Bilateral filter (edge-preserving)\n',
            '    bilateral = cv2.bilateralFilter(image, 9, 75, 75)\n',
            '    \n',
            '    # Non-local means denoising\n',
            '    nlm_denoised = cv2.fastNlMeansDenoising(image)\n',
            '    \n',
            '    return gaussian, bilateral, nlm_denoised\n'
          ]
        }
      ]
    },
    '3d-conversion-pipeline': {
      id: '3d-conversion-pipeline',
      name: '2D to 3D Conversion',
      platform: 'colab',
      cells: [
        {
          cell_type: 'markdown',
          source: [
            '# 2D to 3D Conversion Pipeline\n',
            '\n',
            'Convert 2D images to 3D models using:\n',
            '- Depth estimation with MiDaS\n',
            '- Point cloud generation\n',
            '- Mesh reconstruction\n'
          ]
        },
        {
          cell_type: 'code',
          source: [
            '# Install required packages\n',
            '!pip install torch torchvision\n',
            '!pip install opencv-python matplotlib\n',
            '!pip install open3d\n',
            '!pip install timm\n',
            '\n',
            'import torch\n',
            'import cv2\n',
            'import numpy as np\n',
            'import open3d as o3d\n',
            'import matplotlib.pyplot as plt\n'
          ]
        },
        {
          cell_type: 'code',
          source: [
            '# Load MiDaS model for depth estimation\n',
            'def load_midas_model():\n',
            '    model = torch.hub.load("intel-isl/MiDaS", "MiDaS")\n',
            '    model.eval()\n',
            '    \n',
            '    midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms")\n',
            '    transform = midas_transforms.dpt_transform\n',
            '    \n',
            '    return model, transform\n',
            '\n',
            'model, transform = load_midas_model()\n'
          ]
        }
      ]
    }
  };

  generateNotebook(templateId: string, platform: string): any {
    const template = this.templates[templateId];
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const notebook = {
      nbformat: 4,
      nbformat_minor: 2,
      metadata: {
        kernelspec: {
          display_name: platform === 'spark' ? 'PySpark' : 'Python 3',
          language: 'python',
          name: platform === 'spark' ? 'pyspark' : 'python3'
        },
        language_info: {
          name: 'python',
          version: '3.8.10'
        },
        colab: platform === 'colab' ? {
          provenance: [],
          toc_visible: true
        } : undefined
      },
      cells: template.cells.map(cell => ({
        ...cell,
        metadata: {},
        execution_count: null,
        outputs: []
      }))
    };

    return notebook;
  }

  downloadNotebook(notebookContent: any, filename: string): void {
    const blob = new Blob([JSON.stringify(notebookContent, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  getColabUrl(templateId: string): string {
    // In a real implementation, this would point to a hosted notebook
    const baseUrl = 'https://colab.research.google.com/github/powerprint-ai/notebooks/blob/main/';
    return `${baseUrl}${templateId}.ipynb`;
  }

  getTemplateCategories(): string[] {
    return ['Computer Vision', 'Image Processing', '3D Conversion'];
  }

  getSupportedPlatforms(): string[] {
    return ['colab', 'jupyter', 'spark'];
  }
}

export const notebookService = new NotebookService();
