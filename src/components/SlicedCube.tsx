
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

  return (
    <group scale={scale} rotation={rotation}>
      <mesh ref={cubeRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#7C3AED" 
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
};

export default SlicedCube;
