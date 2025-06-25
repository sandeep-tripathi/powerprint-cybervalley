
import * as THREE from "three";

export interface ParsedObjData {
  vertices: Float32Array;
  faces: Uint32Array;
  normals: Float32Array;
  uvCoordinates: Float32Array;
  boundingBox: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };
}

export const parseObjFile = (objContent: string): ParsedObjData => {
  const lines = objContent.split('\n');
  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const faces: number[] = [];
  
  // Temporary arrays for parsing
  const vertexPositions: number[][] = [];
  const vertexNormals: number[][] = [];
  const vertexUVs: number[][] = [];

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    
    if (parts[0] === 'v') {
      // Vertex position
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const z = parseFloat(parts[3]);
      vertexPositions.push([x, y, z]);
    } else if (parts[0] === 'vn') {
      // Vertex normal
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const z = parseFloat(parts[3]);
      vertexNormals.push([x, y, z]);
    } else if (parts[0] === 'vt') {
      // Texture coordinate
      const u = parseFloat(parts[1]);
      const v = parseFloat(parts[2]);
      vertexUVs.push([u, v]);
    } else if (parts[0] === 'f') {
      // Face
      const faceVertices = parts.slice(1);
      
      // Convert face to triangles if it's a quad
      if (faceVertices.length === 3) {
        // Triangle
        for (const vertex of faceVertices) {
          const indices = vertex.split('/');
          const vertexIndex = parseInt(indices[0]) - 1; // OBJ is 1-indexed
          const uvIndex = indices[1] ? parseInt(indices[1]) - 1 : -1;
          const normalIndex = indices[2] ? parseInt(indices[2]) - 1 : -1;
          
          // Add vertex position
          if (vertexIndex >= 0 && vertexIndex < vertexPositions.length) {
            vertices.push(...vertexPositions[vertexIndex]);
          }
          
          // Add UV coordinates
          if (uvIndex >= 0 && uvIndex < vertexUVs.length) {
            uvs.push(...vertexUVs[uvIndex]);
          } else {
            uvs.push(0, 0); // Default UV
          }
          
          // Add normal
          if (normalIndex >= 0 && normalIndex < vertexNormals.length) {
            normals.push(...vertexNormals[normalIndex]);
          } else {
            normals.push(0, 0, 1); // Default normal
          }
          
          faces.push(faces.length / 3);
        }
      } else if (faceVertices.length === 4) {
        // Quad - convert to two triangles
        const quadIndices = [];
        for (const vertex of faceVertices) {
          const indices = vertex.split('/');
          const vertexIndex = parseInt(indices[0]) - 1;
          quadIndices.push(vertexIndex);
        }
        
        // Triangle 1: 0, 1, 2
        // Triangle 2: 0, 2, 3
        const triangles = [
          [quadIndices[0], quadIndices[1], quadIndices[2]],
          [quadIndices[0], quadIndices[2], quadIndices[3]]
        ];
        
        for (const triangle of triangles) {
          for (const vertexIndex of triangle) {
            if (vertexIndex >= 0 && vertexIndex < vertexPositions.length) {
              vertices.push(...vertexPositions[vertexIndex]);
              uvs.push(0, 0); // Default UV for quad conversion
              normals.push(0, 0, 1); // Default normal
              faces.push(faces.length / 3);
            }
          }
        }
      }
    }
  }

  // Calculate bounding box
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
    vertices: new Float32Array(vertices),
    faces: new Uint32Array(faces),
    normals: new Float32Array(normals),
    uvCoordinates: new Float32Array(uvs),
    boundingBox: {
      min: { x: minX, y: minY, z: minZ },
      max: { x: maxX, y: maxY, z: maxZ }
    }
  };
};
