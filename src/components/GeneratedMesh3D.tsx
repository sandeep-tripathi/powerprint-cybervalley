
import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { GeneratedMesh } from "@/services/mesh2DTo3DConverter";

interface GeneratedMesh3DProps {
  meshData: GeneratedMesh;
  animate?: boolean;
  wireframe?: boolean;
  showTexture?: boolean;
  material?: {
    color?: string;
    roughness?: number;
    metalness?: number;
    transparent?: boolean;
    opacity?: number;
  };
}

const GeneratedMesh3D = ({ 
  meshData, 
  animate = true, 
  wireframe = false,
  showTexture = true,
  material = {} 
}: GeneratedMesh3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.Texture | null>(null);

  useFrame((state) => {
    if (animate && meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.y = time * 0.3;
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
  });

  // Create the geometry from mesh data
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    
    // Set vertex positions
    geom.setAttribute('position', new THREE.BufferAttribute(meshData.vertices, 3));
    
    // Set faces
    geom.setIndex(new THREE.BufferAttribute(meshData.faces, 1));
    
    // Set normals
    if (meshData.normals.length > 0) {
      geom.setAttribute('normal', new THREE.BufferAttribute(meshData.normals, 3));
    } else {
      geom.computeVertexNormals();
    }
    
    // Set UV coordinates
    if (meshData.uvCoordinates.length > 0) {
      geom.setAttribute('uv', new THREE.BufferAttribute(meshData.uvCoordinates, 2));
    }
    
    // Center the geometry
    geom.center();
    
    return geom;
  }, [meshData]);

  // Create texture from image data
  useEffect(() => {
    if (meshData.textureData && showTexture) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = meshData.textureData.width;
      canvas.height = meshData.textureData.height;
      
      ctx.putImageData(meshData.textureData, 0, 0);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.flipY = false; // Important for correct UV mapping
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      
      textureRef.current = texture;
    }
    
    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
      }
    };
  }, [meshData.textureData, showTexture]);

  // Create material
  const meshMaterial = useMemo(() => {
    const materialProps = {
      color: material.color || "#8B5CF6",
      roughness: material.roughness ?? 0.4,
      metalness: material.metalness ?? 0.1,
      transparent: material.transparent ?? false,
      opacity: material.opacity ?? 1.0,
      wireframe,
      side: THREE.DoubleSide,
      map: showTexture && textureRef.current ? textureRef.current : null,
    };

    return new THREE.MeshStandardMaterial(materialProps);
  }, [material, wireframe, showTexture, textureRef.current]);

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

export default GeneratedMesh3D;
