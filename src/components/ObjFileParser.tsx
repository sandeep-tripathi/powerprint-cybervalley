
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
  console.log("Starting OBJ file parsing...");
  const lines = objContent.split('\n');
  
  // Store raw OBJ data
  const vertexPositions: number[][] = [];
  const vertexNormals: number[][] = [];
  const vertexUVs: number[][] = [];
  
  // Final arrays for Three.js
  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const faces: number[] = [];

  // Parse OBJ file line by line
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    
    if (parts[0] === 'v') {
      // Vertex position
      const x = parseFloat(parts[1]) || 0;
      const y = parseFloat(parts[2]) || 0;
      const z = parseFloat(parts[3]) || 0;
      vertexPositions.push([x, y, z]);
    } else if (parts[0] === 'vn') {
      // Vertex normal
      const x = parseFloat(parts[1]) || 0;
      const y = parseFloat(parts[2]) || 0;
      const z = parseFloat(parts[3]) || 1;
      vertexNormals.push([x, y, z]);
    } else if (parts[0] === 'vt') {
      // Texture coordinate
      const u = parseFloat(parts[1]) || 0;
      const v = parseFloat(parts[2]) || 0;
      vertexUVs.push([u, v]);
    } else if (parts[0] === 'f') {
      // Face - convert to triangles
      const faceVertices = parts.slice(1);
      
      if (faceVertices.length >= 3) {
        // Parse face vertices
        const faceData = faceVertices.map(vertex => {
          const indices = vertex.split('/');
          return {
            vertexIndex: parseInt(indices[0]) - 1, // OBJ is 1-indexed
            uvIndex: indices[1] ? parseInt(indices[1]) - 1 : -1,
            normalIndex: indices[2] ? parseInt(indices[2]) - 1 : -1
          };
        });

        // Convert face to triangles (triangulate if needed)
        for (let i = 1; i < faceData.length - 1; i++) {
          const triangle = [faceData[0], faceData[i], faceData[i + 1]];
          
          for (const vertexData of triangle) {
            const vertexIndex = vertexData.vertexIndex;
            
            // Add vertex position
            if (vertexIndex >= 0 && vertexIndex < vertexPositions.length) {
              vertices.push(...vertexPositions[vertexIndex]);
            } else {
              console.warn("Invalid vertex index:", vertexIndex);
              vertices.push(0, 0, 0);
            }
            
            // Add UV coordinates
            if (vertexData.uvIndex >= 0 && vertexData.uvIndex < vertexUVs.length) {
              uvs.push(...vertexUVs[vertexData.uvIndex]);
            } else {
              uvs.push(0, 0);
            }
            
            // Add normal
            if (vertexData.normalIndex >= 0 && vertexData.normalIndex < vertexNormals.length) {
              normals.push(...vertexNormals[vertexData.normalIndex]);
            } else {
              normals.push(0, 0, 1);
            }
            
            // Add face index
            faces.push(Math.floor(vertices.length / 3) - 1);
          }
        }
      }
    }
  }

  console.log("OBJ parsing complete:");
  console.log("- Original vertices:", vertexPositions.length);
  console.log("- Final vertices:", vertices.length / 3);
  console.log("- Faces:", faces.length / 3);
  console.log("- Has normals:", vertexNormals.length > 0);
  console.log("- Has UVs:", vertexUVs.length > 0);

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

  // Handle empty geometry
  if (vertices.length === 0) {
    console.error("No vertices found in OBJ file");
    throw new Error("Invalid OBJ file: No vertices found");
  }

  const boundingBox = {
    min: { x: minX, y: minY, z: minZ },
    max: { x: maxX, y: maxY, z: maxZ }
  };

  console.log("Bounding box:", boundingBox);

  return {
    vertices: new Float32Array(vertices),
    faces: new Uint32Array(faces),
    normals: new Float32Array(normals),
    uvCoordinates: new Float32Array(uvs),
    boundingBox
  };
};
