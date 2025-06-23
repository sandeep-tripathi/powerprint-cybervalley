
import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface SlicedCubeProps {
  scale?: [number, number, number];
  rotation?: [number, number, number];
  animate?: boolean;
}

const SlicedCube = ({ scale = [1, 1, 1], rotation = [0, 0, 0], animate = false }: SlicedCubeProps) => {
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (animate && cubeRef.current) {
      const time = state.clock.elapsedTime;
      cubeRef.current.rotation.y = time * 0.5;
      cubeRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
  });

  // Create materials for different faces
  const materials = [
    new THREE.MeshStandardMaterial({ color: "#22C55E", roughness: 0.3, metalness: 0.7 }), // Right - Green
    new THREE.MeshStandardMaterial({ color: "#22C55E", roughness: 0.3, metalness: 0.7 }), // Left - Green
    new THREE.MeshStandardMaterial({ color: "#3B82F6", roughness: 0.3, metalness: 0.7 }), // Top - Blue
    new THREE.MeshStandardMaterial({ color: "#3B82F6", roughness: 0.3, metalness: 0.7 }), // Bottom - Blue
    new THREE.MeshStandardMaterial({ color: "#3B82F6", roughness: 0.3, metalness: 0.7 }), // Front - Blue
    new THREE.MeshStandardMaterial({ color: "#3B82F6", roughness: 0.3, metalness: 0.7 }), // Back - Blue
  ];

  return (
    <group scale={scale} rotation={rotation}>
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
