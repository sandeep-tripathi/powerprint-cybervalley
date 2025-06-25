
import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";

interface SlicedCubeProps {
  scale?: [number, number, number];
  rotation?: [number, number, number];
  position?: [number, number, number];
  animate?: boolean;
  imageUrl?: string;
}

const SlicedCube = ({ 
  scale = [1, 1, 1], 
  rotation = [0, 0, 0], 
  position = [0, 0, 0],
  animate = false,
  imageUrl
}: SlicedCubeProps) => {
  const cubeRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useFrame((state) => {
    if (animate && cubeRef.current) {
      const time = state.clock.elapsedTime;
      cubeRef.current.rotation.y = time * 0.5;
      cubeRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
  });

  // Load texture from image URL
  useEffect(() => {
    if (imageUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(imageUrl, (loadedTexture) => {
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.RepeatWrapping;
        setTexture(loadedTexture);
      });
    }
  }, [imageUrl]);

  // Create materials with texture if available
  const createMaterials = () => {
    if (texture) {
      // Use the uploaded image as texture
      return [
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3, metalness: 0.7 }),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3, metalness: 0.7 }),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3, metalness: 0.7 }),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3, metalness: 0.7 }),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3, metalness: 0.7 }),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3, metalness: 0.7 }),
      ];
    } else {
      // Default colored materials
      return [
        new THREE.MeshStandardMaterial({ color: "#22C55E", roughness: 0.3, metalness: 0.7 }),
        new THREE.MeshStandardMaterial({ color: "#22C55E", roughness: 0.3, metalness: 0.7 }),
        new THREE.MeshStandardMaterial({ color: "#3B82F6", roughness: 0.3, metalness: 0.7 }),
        new THREE.MeshStandardMaterial({ color: "#3B82F6", roughness: 0.3, metalness: 0.7 }),
        new THREE.MeshStandardMaterial({ color: "#3B82F6", roughness: 0.3, metalness: 0.7 }),
        new THREE.MeshStandardMaterial({ color: "#3B82F6", roughness: 0.3, metalness: 0.7 }),
      ];
    }
  };

  const materials = createMaterials();

  return (
    <group scale={scale} rotation={rotation} position={position}>
      <mesh ref={cubeRef}>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        {materials.map((material, index) => (
          <primitive key={index} object={material} attach={`material-${index}`} />
        ))}
      </mesh>
    </group>
  );
};

export default SlicedCube;
