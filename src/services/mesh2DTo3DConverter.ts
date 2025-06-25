
export interface MeshGenerationOptions {
  extrusionHeight: number; // Simple height for extrusion
  resolution: number; // Grid resolution (lower = simpler)
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
    console.log('Starting simple 2D to 3D mesh conversion...');
    
    // Load the image
    const imageData = await this.loadImage(imageFile);
    
    // Create simple extruded mesh
    const mesh = this.createSimpleExtrudedMesh(imageData, options);
    
    // Calculate normals
    this.calculateSimpleNormals(mesh);
    
    console.log(`Simple mesh generated: ${mesh.vertexCount} vertices, ${mesh.faceCount} faces`);
    
    return mesh;
  }

  private async loadImage(imageFile: File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Set canvas size to a fixed resolution for simplicity
        const maxSize = 64; // Keep it simple with low resolution
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
        
        // Draw image to canvas
        this.ctx.drawImage(img, 0, 0, width, height);
        
        // Get image data
        const imageData = this.ctx.getImageData(0, 0, width, height);
        resolve(imageData);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(imageFile);
    });
  }

  private createSimpleExtrudedMesh(
    imageData: ImageData, 
    options: MeshGenerationOptions
  ): GeneratedMesh {
    const { width, height } = imageData;
    const vertices: number[] = [];
    const faces: number[] = [];
    const uvs: number[] = [];
    
    // Create a simple rectangular mesh with front and back faces
    const halfWidth = width / 100; // Normalize size
    const halfHeight = height / 100;
    const extrusionDepth = options.extrusionHeight;
    
    // Front face vertices (z = extrusionDepth/2)
    vertices.push(-halfWidth, -halfHeight, extrusionDepth / 2); // Bottom-left
    vertices.push(halfWidth, -halfHeight, extrusionDepth / 2);  // Bottom-right  
    vertices.push(halfWidth, halfHeight, extrusionDepth / 2);   // Top-right
    vertices.push(-halfWidth, halfHeight, extrusionDepth / 2);  // Top-left
    
    // Back face vertices (z = -extrusionDepth/2)
    vertices.push(-halfWidth, -halfHeight, -extrusionDepth / 2); // Bottom-left
    vertices.push(halfWidth, -halfHeight, -extrusionDepth / 2);  // Bottom-right
    vertices.push(halfWidth, halfHeight, -extrusionDepth / 2);   // Top-right
    vertices.push(-halfWidth, halfHeight, -extrusionDepth / 2);  // Top-left
    
    // UV coordinates for front face
    uvs.push(0, 0); // Bottom-left
    uvs.push(1, 0); // Bottom-right
    uvs.push(1, 1); // Top-right
    uvs.push(0, 1); // Top-left
    
    // UV coordinates for back face
    uvs.push(0, 0); // Bottom-left
    uvs.push(1, 0); // Bottom-right
    uvs.push(1, 1); // Top-right
    uvs.push(0, 1); // Top-left
    
    // Front face triangles
    faces.push(0, 1, 2); // Triangle 1
    faces.push(0, 2, 3); // Triangle 2
    
    // Back face triangles (reversed winding)
    faces.push(4, 6, 5); // Triangle 1
    faces.push(4, 7, 6); // Triangle 2
    
    // Side faces
    // Bottom
    faces.push(0, 4, 5);
    faces.push(0, 5, 1);
    
    // Right
    faces.push(1, 5, 6);
    faces.push(1, 6, 2);
    
    // Top
    faces.push(2, 6, 7);
    faces.push(2, 7, 3);
    
    // Left
    faces.push(3, 7, 4);
    faces.push(3, 4, 0);
    
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

  private calculateSimpleNormals(mesh: GeneratedMesh): void {
    const normals = new Float32Array(mesh.vertices.length);
    
    // Initialize all normals to zero
    normals.fill(0);
    
    // Calculate face normals and assign to vertices
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
      
      // Normalize the normal
      const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
      if (length > 0) {
        normal[0] /= length;
        normal[1] /= length;
        normal[2] /= length;
      }
      
      // Assign to each vertex of the triangle
      for (let j = 0; j < 3; j++) {
        const vertexIndex = mesh.faces[i + j] * 3;
        normals[vertexIndex] = normal[0];
        normals[vertexIndex + 1] = normal[1];
        normals[vertexIndex + 2] = normal[2];
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
    // Clean up resources
    this.canvas.remove();
  }
}
