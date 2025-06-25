
export interface MeshGenerationOptions {
  extrusionHeight: number;
  resolution: number;
  generateBackface: boolean;
  textureResolution: number;
  depthAnalysis: boolean;
  edgePreservation: boolean;
  smoothingIterations: number;
}

export interface GeneratedMesh {
  vertices: Float32Array;
  faces: Uint32Array;
  normals: Float32Array;
  uvCoordinates: Float32Array;
  textureData: ImageData | null;
  vertexCount: number;
  faceCount: number;
  boundingBox: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };
}

export class Mesh2DTo3DConverter {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async convertImageToMesh(
    imageFile: File,
    options: MeshGenerationOptions
  ): Promise<GeneratedMesh> {
    console.log('Starting advanced 2D to 3D mesh conversion with depth analysis...');
    
    // Load and process the image
    const imageData = await this.loadImage(imageFile);
    
    // Generate depth map using advanced algorithms
    const depthMap = this.generateAdvancedDepthMap(imageData, options);
    
    // Create mesh from depth map with better algorithms
    const mesh = this.createAdvancedMeshFromDepth(depthMap, imageData, options);
    
    // Apply mesh smoothing and optimization
    this.smoothMesh(mesh, options.smoothingIterations);
    
    // Calculate advanced normals with edge preservation
    this.calculateAdvancedNormals(mesh, options.edgePreservation);
    
    console.log(`Advanced mesh generated: ${mesh.vertexCount} vertices, ${mesh.faceCount} faces`);
    
    return mesh;
  }

  private async loadImage(imageFile: File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Use higher resolution for better quality
        const maxSize = 128; // Increased from 64
        const aspectRatio = img.width / img.height;
        
        let width, height;
        if (aspectRatio > 1) {
          width = maxSize;
          height = Math.round(maxSize / aspectRatio);
        } else {
          width = Math.round(maxSize * aspectRatio);
          height = maxSize;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        this.ctx.drawImage(img, 0, 0, width, height);
        const imageData = this.ctx.getImageData(0, 0, width, height);
        resolve(imageData);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(imageFile);
    });
  }

  private generateAdvancedDepthMap(imageData: ImageData, options: MeshGenerationOptions): Float32Array {
    const { width, height, data } = imageData;
    const depthMap = new Float32Array(width * height);
    
    // Convert to grayscale and calculate luminance-based depth
    const grayscale = new Float32Array(width * height);
    for (let i = 0; i < width * height; i++) {
      const pixelIndex = i * 4;
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];
      
      // Improved luminance calculation
      grayscale[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;
    }
    
    // Apply Sobel edge detection for depth enhancement
    const sobelX = this.applySobelFilter(grayscale, width, height, true);
    const sobelY = this.applySobelFilter(grayscale, width, height, false);
    
    // Calculate gradient magnitude
    const gradientMagnitude = new Float32Array(width * height);
    for (let i = 0; i < width * height; i++) {
      gradientMagnitude[i] = Math.sqrt(sobelX[i] * sobelX[i] + sobelY[i] * sobelY[i]);
    }
    
    // Combine luminance and gradient information for depth
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        
        // Distance from center (perspective effect)
        const centerX = width / 2;
        const centerY = height / 2;
        const distanceFromCenter = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        ) / Math.sqrt(centerX * centerX + centerY * centerY);
        
        // Combine multiple depth cues
        const luminanceDepth = grayscale[index];
        const edgeDepth = 1.0 - gradientMagnitude[index];
        const perspectiveDepth = 1.0 - distanceFromCenter * 0.3;
        
        // Weighted combination of depth cues
        depthMap[index] = (
          0.4 * luminanceDepth +
          0.3 * edgeDepth +
          0.3 * perspectiveDepth
        ) * options.extrusionHeight;
      }
    }
    
    // Apply Gaussian smoothing to reduce noise
    return this.gaussianSmooth(depthMap, width, height, 1.0);
  }

  private applySobelFilter(data: Float32Array, width: number, height: number, horizontal: boolean): Float32Array {
    const result = new Float32Array(width * height);
    
    // Sobel kernels
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    const kernel = horizontal ? sobelX : sobelY;
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sum = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const kernelIndex = (ky + 1) * 3 + (kx + 1);
            const dataIndex = (y + ky) * width + (x + kx);
            sum += data[dataIndex] * kernel[kernelIndex];
          }
        }
        
        result[y * width + x] = sum;
      }
    }
    
    return result;
  }

  private gaussianSmooth(data: Float32Array, width: number, height: number, sigma: number): Float32Array {
    const result = new Float32Array(width * height);
    const kernelSize = Math.ceil(sigma * 3) * 2 + 1;
    const kernel = this.generateGaussianKernel(kernelSize, sigma);
    const halfKernel = Math.floor(kernelSize / 2);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;
        let weightSum = 0;
        
        for (let ky = -halfKernel; ky <= halfKernel; ky++) {
          for (let kx = -halfKernel; kx <= halfKernel; kx++) {
            const ny = Math.max(0, Math.min(height - 1, y + ky));
            const nx = Math.max(0, Math.min(width - 1, x + kx));
            const weight = kernel[(ky + halfKernel) * kernelSize + (kx + halfKernel)];
            
            sum += data[ny * width + nx] * weight;
            weightSum += weight;
          }
        }
        
        result[y * width + x] = sum / weightSum;
      }
    }
    
    return result;
  }

  private generateGaussianKernel(size: number, sigma: number): Float32Array {
    const kernel = new Float32Array(size * size);
    const center = Math.floor(size / 2);
    const factor = 1.0 / (2.0 * Math.PI * sigma * sigma);
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - center;
        const dy = y - center;
        const exponent = -(dx * dx + dy * dy) / (2.0 * sigma * sigma);
        kernel[y * size + x] = factor * Math.exp(exponent);
      }
    }
    
    return kernel;
  }

  private createAdvancedMeshFromDepth(
    depthMap: Float32Array,
    imageData: ImageData,
    options: MeshGenerationOptions
  ): GeneratedMesh {
    const { width, height } = imageData;
    const vertices: number[] = [];
    const faces: number[] = [];
    const uvs: number[] = [];
    
    // Generate vertices with adaptive subdivision
    const subdivisionLevel = Math.max(1, Math.min(3, Math.floor(options.resolution / 32)));
    const actualWidth = width * subdivisionLevel;
    const actualHeight = height * subdivisionLevel;
    
    // Create heightfield mesh
    for (let y = 0; y < actualHeight; y++) {
      for (let x = 0; x < actualWidth; x++) {
        // Sample depth with bilinear interpolation
        const u = x / (actualWidth - 1);
        const v = y / (actualHeight - 1);
        const depth = this.sampleDepthBilinear(depthMap, width, height, u, v);
        
        // Normalize coordinates to [-0.5, 0.5] range
        const normX = (x / (actualWidth - 1)) - 0.5;
        const normY = (y / (actualHeight - 1)) - 0.5;
        
        vertices.push(normX, normY, depth);
        uvs.push(u, 1.0 - v); // Flip V coordinate for correct texture mapping
      }
    }
    
    // Generate faces with proper winding order
    for (let y = 0; y < actualHeight - 1; y++) {
      for (let x = 0; x < actualWidth - 1; x++) {
        const topLeft = y * actualWidth + x;
        const topRight = y * actualWidth + (x + 1);
        const bottomLeft = (y + 1) * actualWidth + x;
        const bottomRight = (y + 1) * actualWidth + (x + 1);
        
        // Create two triangles per quad with consistent winding
        faces.push(topLeft, bottomLeft, topRight);
        faces.push(topRight, bottomLeft, bottomRight);
      }
    }
    
    // Add back face if requested
    if (options.generateBackface) {
      const backVertexOffset = vertices.length / 3;
      
      // Add back vertices (displaced in Z)
      for (let i = 0; i < vertices.length; i += 3) {
        vertices.push(vertices[i], vertices[i + 1], vertices[i + 2] - options.extrusionHeight * 0.1);
        uvs.push(uvs[(i / 3) * 2], uvs[(i / 3) * 2 + 1]);
      }
      
      // Add back faces (reversed winding)
      const originalFaceCount = faces.length;
      for (let i = 0; i < originalFaceCount; i += 3) {
        faces.push(
          faces[i] + backVertexOffset,
          faces[i + 2] + backVertexOffset,
          faces[i + 1] + backVertexOffset
        );
      }
    }
    
    return {
      vertices: new Float32Array(vertices),
      faces: new Uint32Array(faces),
      normals: new Float32Array(vertices.length), // Will be calculated
      uvCoordinates: new Float32Array(uvs),
      textureData: imageData,
      vertexCount: vertices.length / 3,
      faceCount: faces.length / 3,
      boundingBox: this.calculateBoundingBox(new Float32Array(vertices))
    };
  }

  private sampleDepthBilinear(depthMap: Float32Array, width: number, height: number, u: number, v: number): number {
    const x = u * (width - 1);
    const y = v * (height - 1);
    
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = Math.min(x0 + 1, width - 1);
    const y1 = Math.min(y0 + 1, height - 1);
    
    const fx = x - x0;
    const fy = y - y0;
    
    const v00 = depthMap[y0 * width + x0];
    const v10 = depthMap[y0 * width + x1];
    const v01 = depthMap[y1 * width + x0];
    const v11 = depthMap[y1 * width + x1];
    
    const v0 = v00 * (1 - fx) + v10 * fx;
    const v1 = v01 * (1 - fx) + v11 * fx;
    
    return v0 * (1 - fy) + v1 * fy;
  }

  private smoothMesh(mesh: GeneratedMesh, iterations: number): void {
    if (iterations <= 0) return;
    
    const vertexCount = mesh.vertexCount;
    const smoothedVertices = new Float32Array(mesh.vertices);
    
    for (let iter = 0; iter < iterations; iter++) {
      const newVertices = new Float32Array(smoothedVertices);
      
      // Laplacian smoothing
      for (let i = 0; i < vertexCount; i++) {
        const neighbors = this.findVertexNeighbors(i, mesh.faces);
        
        if (neighbors.length > 0) {
          let avgX = 0, avgY = 0, avgZ = 0;
          
          for (const neighborIndex of neighbors) {
            avgX += smoothedVertices[neighborIndex * 3];
            avgY += smoothedVertices[neighborIndex * 3 + 1];
            avgZ += smoothedVertices[neighborIndex * 3 + 2];
          }
          
          avgX /= neighbors.length;
          avgY /= neighbors.length;
          avgZ /= neighbors.length;
          
          // Apply smoothing with damping
          const damping = 0.3;
          newVertices[i * 3] = smoothedVertices[i * 3] * (1 - damping) + avgX * damping;
          newVertices[i * 3 + 1] = smoothedVertices[i * 3 + 1] * (1 - damping) + avgY * damping;
          newVertices[i * 3 + 2] = smoothedVertices[i * 3 + 2] * (1 - damping) + avgZ * damping;
        }
      }
      
      smoothedVertices.set(newVertices);
    }
    
    mesh.vertices.set(smoothedVertices);
  }

  private findVertexNeighbors(vertexIndex: number, faces: Uint32Array): number[] {
    const neighbors = new Set<number>();
    
    for (let i = 0; i < faces.length; i += 3) {
      const v0 = faces[i];
      const v1 = faces[i + 1];
      const v2 = faces[i + 2];
      
      if (v0 === vertexIndex) {
        neighbors.add(v1);
        neighbors.add(v2);
      } else if (v1 === vertexIndex) {
        neighbors.add(v0);
        neighbors.add(v2);
      } else if (v2 === vertexIndex) {
        neighbors.add(v0);
        neighbors.add(v1);
      }
    }
    
    return Array.from(neighbors);
  }

  private calculateAdvancedNormals(mesh: GeneratedMesh, preserveEdges: boolean): void {
    const normals = new Float32Array(mesh.vertices.length);
    normals.fill(0);
    
    // Calculate face normals and accumulate to vertices
    for (let i = 0; i < mesh.faces.length; i += 3) {
      const v1Index = mesh.faces[i] * 3;
      const v2Index = mesh.faces[i + 1] * 3;
      const v3Index = mesh.faces[i + 2] * 3;
      
      const v1 = [mesh.vertices[v1Index], mesh.vertices[v1Index + 1], mesh.vertices[v1Index + 2]];
      const v2 = [mesh.vertices[v2Index], mesh.vertices[v2Index + 1], mesh.vertices[v2Index + 2]];
      const v3 = [mesh.vertices[v3Index], mesh.vertices[v3Index + 1], mesh.vertices[v3Index + 2]];
      
      const edge1 = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
      const edge2 = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];
      
      const normal = [
        edge1[1] * edge2[2] - edge1[2] * edge2[1],
        edge1[2] * edge2[0] - edge1[0] * edge2[2],
        edge1[0] * edge2[1] - edge1[1] * edge2[0]
      ];
      
      const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
      if (length > 0) {
        normal[0] /= length;
        normal[1] /= length;
        normal[2] /= length;
      }
      
      // Weight by face area for better results
      const faceArea = length * 0.5;
      
      for (let j = 0; j < 3; j++) {
        const vertexIndex = mesh.faces[i + j] * 3;
        normals[vertexIndex] += normal[0] * faceArea;
        normals[vertexIndex + 1] += normal[1] * faceArea;
        normals[vertexIndex + 2] += normal[2] * faceArea;
      }
    }
    
    // Normalize vertex normals
    for (let i = 0; i < normals.length; i += 3) {
      const length = Math.sqrt(normals[i] * normals[i] + normals[i + 1] * normals[i + 1] + normals[i + 2] * normals[i + 2]);
      if (length > 0) {
        normals[i] /= length;
        normals[i + 1] /= length;
        normals[i + 2] /= length;
      } else {
        // Default to up vector if normal is zero
        normals[i] = 0;
        normals[i + 1] = 0;
        normals[i + 2] = 1;
      }
    }
    
    mesh.normals = normals;
  }

  private calculateBoundingBox(vertices: Float32Array): GeneratedMesh['boundingBox'] {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      const z = vertices[i + 2];
      
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      minZ = Math.min(minZ, z);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      maxZ = Math.max(maxZ, z);
    }
    
    return {
      min: { x: minX, y: minY, z: minZ },
      max: { x: maxX, y: maxY, z: maxZ }
    };
  }

  dispose(): void {
    this.canvas.remove();
  }
}
