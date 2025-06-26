
import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { ParsedObjData } from "./ObjFileParser";

interface ObjViewerProps {
  objData: ParsedObjData;
  animate?: boolean;
  wireframe?: boolean;
  material?: {
    color?: string;
    roughness?: number;
    metalness?: number;
  };
}

const ObjViewer = ({ 
  objData, 
  animate = true, 
  wireframe = false,
  material = {} 
}: ObjViewerProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (animate && meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.y = time * 0.3;
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    console.log("OBJ model clicked!", {
      vertices: objData.vertices.length / 3,
      faces: objData.faces.length / 3,
      point: event.point,
      uv: event.uv
    });
  };

  // Create the geometry from OBJ data
  const geometry = useMemo(() => {
    console.log("Creating geometry from OBJ data...");
    console.log("Vertices length:", objData.vertices.length);
    console.log("Faces length:", objData.faces.length);
    
    const geom = new THREE.BufferGeometry();
    
    try {
      // Set vertex positions
      if (objData.vertices.length > 0) {
        geom.setAttribute('position', new THREE.BufferAttribute(objData.vertices, 3));
        console.log("✓ Position attribute set");
      }
      
      // Set faces (indices)
      if (objData.faces.length > 0) {
        geom.setIndex(new THREE.BufferAttribute(objData.faces, 1));
        console.log("✓ Index attribute set");
      }
      
      // Set normals
      if (objData.normals.length > 0) {
        geom.setAttribute('normal', new THREE.BufferAttribute(objData.normals, 3));
        console.log("✓ Normal attribute set");
      } else {
        geom.computeVertexNormals();
        console.log("✓ Computed vertex normals");
      }
      
      // Set UV coordinates
      if (objData.uvCoordinates.length > 0) {
        geom.setAttribute('uv', new THREE.BufferAttribute(objData.uvCoordinates, 2));
        console.log("✓ UV attribute set");
      }
      
      // Center and scale the geometry
      geom.center();
      
      // Scale to reasonable size
      geom.computeBoundingBox();
      if (geom.boundingBox) {
        const size = geom.boundingBox.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        if (maxDimension > 0) {
          const scale = 2 / maxDimension; // Scale to fit in 2 unit cube
          geom.scale(scale, scale, scale);
          console.log("✓ Geometry scaled by factor:", scale);
        }
      }
      
      console.log("✓ Geometry created successfully");
      
    } catch (error) {
      console.error("Error creating geometry:", error);
      throw error;
    }
    
    return geom;
  }, [objData]);

  // Create material
  const meshMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: material.color || "#8B5CF6",
      roughness: material.roughness ?? 0.4,
      metalness: material.metalness ?? 0.1,
      wireframe,
      side: THREE.DoubleSide,
    });
  }, [material, wireframe]);

  // Clean up geometry on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
      meshMaterial.dispose();
    };
  }, [geometry, meshMaterial]);

  console.log("Rendering OBJ mesh with", objData.vertices.length / 3, "vertices");

  return (
    <group onClick={handleClick}>
      <mesh ref={meshRef} geometry={geometry} material={meshMaterial} />
    </group>
  );
};

export default ObjViewer;
