
import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface SlicedCubeProps {
  scale?: [number, number, number];
  rotation?: [number, number, number];
  animate?: boolean;
}

const SlicedCube = ({ scale = [1, 1, 1], rotation = [0, 0, 0], animate = false }: SlicedCubeProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (animate && groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={scale} rotation={rotation}>
      {/* Left half - Red */}
      <mesh position={[-0.25, 0, 0]}>
        <boxGeometry args={[0.5, 1, 1]} />
        <meshStandardMaterial color="#DC2626" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Right half - Blue */}
      <mesh position={[0.25, 0, 0]}>
        <boxGeometry args={[0.5, 1, 1]} />
        <meshStandardMaterial color="#2563EB" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Small gap/slice effect - darker edge */}
      <mesh position={[0, 0, 0]} scale={[0.05, 1.02, 1.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1F2937" roughness={0.8} metalness={0.1} />
      </mesh>
    </group>
  );
};

export default SlicedCube;
