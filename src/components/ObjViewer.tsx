
import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
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

  // Create the geometry from OBJ data
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    
    // Set vertex positions
    geom.setAttribute('position', new THREE.BufferAttribute(objData.vertices, 3));
    
    // Set faces
    geom.setIndex(new THREE.BufferAttribute(objData.faces, 1));
    
    // Set normals
    if (objData.normals.length > 0) {
      geom.setAttribute('normal', new THREE.BufferAttribute(objData.normals, 3));
    } else {
      geom.computeVertexNormals();
    }
    
    // Set UV coordinates
    if (objData.uvCoordinates.length > 0) {
      geom.setAttribute('uv', new THREE.BufferAttribute(objData.uvCoordinates, 2));
    }
    
    // Center the geometry
    geom.center();
    
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

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} material={meshMaterial} />
    </group>
  );
};

export default ObjViewer;
