
export interface MeshGenerationOptions {
  depthStrength: number; // 0-1, how much depth to generate
  smoothingIterations: number; // Number of smoothing passes
  subdivisionLevel: number; // Level of mesh subdivision
  generateBackface: boolean; // Whether to generate back geometry
  textureResolution: number; // Texture resolution (256, 512, 1024, etc.)
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
    console.log('Starting 2D to 3D mesh conversion...');
    
    // Load and analyze the image
    const imageData = await this.loadAndAnalyzeImage(imageFile);
    
    // Generate depth map from image
    const depthMap = this.generateDepthMap(imageData, options.depthStrength);
    
    // Create base mesh geometry
    const baseMesh = this.generateBaseMesh(imageData, depthMap, options);
    
    // Apply smoothing
    const smoothedMesh = this.applySmoothingFilter(baseMesh, options.smoothingIterations);
    
    // Subdivide if needed
    const finalMesh = options.subdivisionLevel > 0 
      ? this.subdivideMesh(smoothedMesh, options.subdivisionLevel)
      : smoothedMesh;
    
    // Generate backface if requested
    if (options.generateBackface) {
      this.addBackfaceGeometry(finalMesh);
    }
    
    // Calculate normals
    this.calculateNormals(finalMesh);
    
    // Generate UV coordinates
    this.generateUVCoordinates(finalMesh, imageData.width, imageData.height);
    
    console.log(`Mesh generated: ${finalMesh.vertexCount} vertices, ${finalMesh.faceCount} faces`);
    
    return finalMesh;
  }

  private async loadAndAnalyzeImage(imageFile: File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Set canvas size to image size
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        
        // Draw image to canvas
        this.ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = this.ctx.getImageData(0, 0, img.width, img.height);
        resolve(imageData);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(imageFile);
    });
  }

  private generateDepthMap(imageData: ImageData, depthStrength: number): Float32Array {
    const { width, height, data } = imageData;
    const depthMap = new Float32Array(width * height);
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];
      
      // Calculate luminance (grayscale) for depth
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      // Apply alpha transparency for depth variation
      const alphaFactor = alpha / 255;
      
      // Generate depth value (inverted so bright areas are raised)
      const depth = (1 - luminance) * depthStrength * alphaFactor;
      
      depthMap[i / 4] = depth;
    }
    
    return depthMap;
  }

  private generateBaseMesh(
    imageData: ImageData, 
    depthMap: Float32Array, 
    options: MeshGenerationOptions
  ): GeneratedMesh {
    const { width, height } = imageData;
    const vertices: number[] = [];
    const faces: number[] = [];
    const uvs: number[] = [];
    
    // Generate vertices
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        const depth = depthMap[index];
        
        // Normalize coordinates to [-1, 1] range
        const normalizedX = (x / width) * 2 - 1;
        const normalizedY = (y / height) * 2 - 1;
        
        vertices.push(normalizedX, normalizedY, depth);
        uvs.push(x / width, 1 - (y / height)); // Flip Y for correct UV mapping
      }
    }
    
    // Generate faces (triangles)
    for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width - 1; x++) {
        const topLeft = y * width + x;
        const topRight = y * width + (x + 1);
        const bottomLeft = (y + 1) * width + x;
        const bottomRight = (y + 1) * width + (x + 1);
        
        // Create two triangles for each quad
        // Triangle 1
        faces.push(topLeft, bottomLeft, topRight);
        // Triangle 2
        faces.push(topRight, bottomLeft, bottomRight);
      }
    }
    
    return {
      vertices: new Float32Array(vertices),
      faces: new Uint32Array(faces),
      normals: new Float32Array(vertices.length), // Will be calculated later
      uvCoordinates: new Float32Array(uvs),
      textureData: imageData,
      vertexCount: vertices.length / 3,
      faceCount: faces.length / 3,
      boundingBox: this.calculateBoundingBox(new Float32Array(vertices))
    };
  }

  private applySmoothingFilter(mesh: GeneratedMesh, iterations: number): GeneratedMesh {
    if (iterations === 0) return mesh;
    
    console.log(`Applying ${iterations} smoothing iterations...`);
    
    let smoothedVertices = new Float32Array(mesh.vertices);
    
    for (let iter = 0; iter < iterations; iter++) {
      const newVertices = new Float32Array(smoothedVertices);
      
      // Apply Laplacian smoothing
      for (let i = 0; i < mesh.vertexCount; i++) {
        const vertexIndex = i * 3;
        const neighbors = this.findVertexNeighbors(i, mesh);
        
        if (neighbors.length > 0) {
          let avgX = 0, avgY = 0, avgZ = 0;
          
          for (const neighbor of neighbors) {
            avgX += smoothedVertices[neighbor * 3];
            avgY += smoothedVertices[neighbor * 3 + 1];
            avgZ += smoothedVertices[neighbor * 3 + 2];
          }
          
          avgX /= neighbors.length;
          avgY /= neighbors.length;
          avgZ /= neighbors.length;
          
          // Blend with original position (0.5 = 50% smoothing)
          const smoothingFactor = 0.5;
          newVertices[vertexIndex] = smoothedVertices[vertexIndex] * (1 - smoothingFactor) + avgX * smoothingFactor;
          newVertices[vertexIndex + 1] = smoothedVertices[vertexIndex + 1] * (1 - smoothingFactor) + avgY * smoothingFactor;
          newVertices[vertexIndex + 2] = smoothedVertices[vertexIndex + 2] * (1 - smoothingFactor) + avgZ * smoothingFactor;
        }
      }
      
      smoothedVertices = newVertices;
    }
    
    return {
      ...mesh,
      vertices: smoothedVertices,
      boundingBox: this.calculateBoundingBox(smoothedVertices)
    };
  }

  private findVertexNeighbors(vertexIndex: number, mesh: GeneratedMesh): number[] {
    const neighbors: Set<number> = new Set();
    
    // Find all faces that contain this vertex
    for (let i = 0; i < mesh.faces.length; i += 3) {
      const v1 = mesh.faces[i];
      const v2 = mesh.faces[i + 1];
      const v3 = mesh.faces[i + 2];
      
      if (v1 === vertexIndex) {
        neighbors.add(v2);
        neighbors.add(v3);
      } else if (v2 === vertexIndex) {
        neighbors.add(v1);
        neighbors.add(v3);
      } else if (v3 === vertexIndex) {
        neighbors.add(v1);
        neighbors.add(v2);
      }
    }
    
    return Array.from(neighbors);
  }

  private subdivideMesh(mesh: GeneratedMesh, levels: number): GeneratedMesh {
    if (levels === 0) return mesh;
    
    console.log(`Subdividing mesh ${levels} levels...`);
    
    // This is a simplified subdivision - in a real implementation,
    // you'd use Loop subdivision or Catmull-Clark subdivision
    let currentMesh = mesh;
    
    for (let level = 0; level < levels; level++) {
      currentMesh = this.performOneSubdivisionLevel(currentMesh);
    }
    
    return currentMesh;
  }

  private performOneSubdivisionLevel(mesh: GeneratedMesh): GeneratedMesh {
    // Simplified subdivision: split each triangle into 4 triangles
    const newVertices: number[] = Array.from(mesh.vertices);
    const newFaces: number[] = [];
    const newUVs: number[] = Array.from(mesh.uvCoordinates);
    
    const edgeVertexMap = new Map<string, number>();
    
    for (let i = 0; i < mesh.faces.length; i += 3) {
      const v1 = mesh.faces[i];
      const v2 = mesh.faces[i + 1];
      const v3 = mesh.faces[i + 2];
      
      // Get or create edge midpoints
      const mid12 = this.getOrCreateEdgeVertex(v1, v2, newVertices, newUVs, mesh, edgeVertexMap);
      const mid23 = this.getOrCreateEdgeVertex(v2, v3, newVertices, newUVs, mesh, edgeVertexMap);
      const mid31 = this.getOrCreateEdgeVertex(v3, v1, newVertices, newUVs, mesh, edgeVertexMap);
      
      // Create 4 new triangles
      newFaces.push(v1, mid12, mid31);
      newFaces.push(mid12, v2, mid23);
      newFaces.push(mid31, mid23, v3);
      newFaces.push(mid12, mid23, mid31);
    }
    
    return {
      vertices: new Float32Array(newVertices),
      faces: new Uint32Array(newFaces),
      normals: new Float32Array(newVertices.length),
      uvCoordinates: new Float32Array(newUVs),
      textureData: mesh.textureData,
      vertexCount: newVertices.length / 3,
      faceCount: newFaces.length / 3,
      boundingBox: this.calculateBoundingBox(new Float32Array(newVertices))
    };
  }

  private getOrCreateEdgeVertex(
    v1: number, 
    v2: number, 
    vertices: number[], 
    uvs: number[], 
    mesh: GeneratedMesh,
    edgeVertexMap: Map<string, number>
  ): number {
    const edgeKey = v1 < v2 ? `${v1}-${v2}` : `${v2}-${v1}`;
    
    if (edgeVertexMap.has(edgeKey)) {
      return edgeVertexMap.get(edgeKey)!;
    }
    
    // Create new vertex at edge midpoint
    const newVertexIndex = vertices.length / 3;
    
    const x = (mesh.vertices[v1 * 3] + mesh.vertices[v2 * 3]) / 2;
    const y = (mesh.vertices[v1 * 3 + 1] + mesh.vertices[v2 * 3 + 1]) / 2;
    const z = (mesh.vertices[v1 * 3 + 2] + mesh.vertices[v2 * 3 + 2]) / 2;
    
    vertices.push(x, y, z);
    
    const u = (mesh.uvCoordinates[v1 * 2] + mesh.uvCoordinates[v2 * 2]) / 2;
    const v = (mesh.uvCoordinates[v1 * 2 + 1] + mesh.uvCoordinates[v2 * 2 + 1]) / 2;
    
    uvs.push(u, v);
    
    edgeVertexMap.set(edgeKey, newVertexIndex);
    return newVertexIndex;
  }

  private addBackfaceGeometry(mesh: GeneratedMesh): void {
    const originalVertexCount = mesh.vertexCount;
    const originalFaceCount = mesh.faceCount;
    
    // Double the arrays to accommodate backface geometry
    const newVertices = new Float32Array(mesh.vertices.length * 2);
    const newFaces = new Uint32Array(mesh.faces.length * 2);
    const newUVs = new Float32Array(mesh.uvCoordinates.length * 2);
    
    // Copy original geometry
    newVertices.set(mesh.vertices);
    newFaces.set(mesh.faces);
    newUVs.set(mesh.uvCoordinates);
    
    // Add backface vertices (offset in Z)
    for (let i = 0; i < mesh.vertices.length; i += 3) {
      const baseIndex = mesh.vertices.length + i;
      newVertices[baseIndex] = mesh.vertices[i];
      newVertices[baseIndex + 1] = mesh.vertices[i + 1];
      newVertices[baseIndex + 2] = mesh.vertices[i + 2] - 0.1; // Offset back slightly
    }
    
    // Add backface UVs
    for (let i = 0; i < mesh.uvCoordinates.length; i++) {
      newUVs[mesh.uvCoordinates.length + i] = mesh.uvCoordinates[i];
    }
    
    // Add backface triangles (reversed winding)
    for (let i = 0; i < mesh.faces.length; i += 3) {
      const baseIndex = mesh.faces.length + i;
      const offset = originalVertexCount;
      
      // Reverse triangle winding for backface
      newFaces[baseIndex] = mesh.faces[i] + offset;
      newFaces[baseIndex + 1] = mesh.faces[i + 2] + offset;
      newFaces[baseIndex + 2] = mesh.faces[i + 1] + offset;
    }
    
    mesh.vertices = newVertices;
    mesh.faces = newFaces;
    mesh.uvCoordinates = newUVs;
    mesh.vertexCount = newVertices.length / 3;
    mesh.faceCount = newFaces.length / 3;
  }

  private calculateNormals(mesh: GeneratedMesh): void {
    const normals = new Float32Array(mesh.vertices.length);
    
    // Initialize all normals to zero
    normals.fill(0);
    
    // Calculate face normals and accumulate vertex normals
    for (let i = 0; i < mesh.faces.length; i += 3) {
      const v1Index = mesh.faces[i] * 3;
      const v2Index = mesh.faces[i + 1] * 3;
      const v3Index = mesh.faces[i + 2] * 3;
      
      // Get triangle vertices
      const v1 = [mesh.vertices[v1Index], mesh.vertices[v1Index + 1], mesh.vertices[v1Index + 2]];
      const v2 = [mesh.vertices[v2Index], mesh.vertices[v2Index + 1], mesh.vertices[v2Index + 2]];
      const v3 = [mesh.vertices[v3Index], mesh.vertices[v3Index + 1], mesh.vertices[v3Index + 2]];
      
      // Calculate face normal using cross product
      const edge1 = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
      const edge2 = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];
      
      const normal = [
        edge1[1] * edge2[2] - edge1[2] * edge2[1],
        edge1[2] * edge2[0] - edge1[0] * edge2[2],
        edge1[0] * edge2[1] - edge1[1] * edge2[0]
      ];
      
      // Accumulate normals for each vertex
      for (let j = 0; j < 3; j++) {
        const vertexIndex = mesh.faces[i + j] * 3;
        normals[vertexIndex] += normal[0];
        normals[vertexIndex + 1] += normal[1];
        normals[vertexIndex + 2] += normal[2];
      }
    }
    
    // Normalize all vertex normals
    for (let i = 0; i < normals.length; i += 3) {
      const length = Math.sqrt(normals[i] * normals[i] + normals[i + 1] * normals[i + 1] + normals[i + 2] * normals[i + 2]);
      if (length > 0) {
        normals[i] /= length;
        normals[i + 1] /= length;
        normals[i + 2] /= length;
      }
    }
    
    mesh.normals = normals;
  }

  private generateUVCoordinates(mesh: GeneratedMesh, imageWidth: number, imageHeight: number): void {
    // UV coordinates are already generated during mesh creation
    // This method can be used for more advanced UV mapping techniques
    console.log(`UV coordinates generated for ${mesh.vertexCount} vertices`);
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
    // Clean up resources
    this.canvas.remove();
  }
}
