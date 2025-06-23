
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
  const face1Ref = useRef<THREE.Mesh>(null);
  const face2Ref = useRef<THREE.Mesh>(null);
  const face3Ref = useRef<THREE.Mesh>(null);
  const face4Ref = useRef<THREE.Mesh>(null);
  const face5Ref = useRef<THREE.Mesh>(null);
  const face6Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (animate && groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Main group rotation
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
      groupRef.current.rotation.x = Math.cos(time * 0.2) * 0.1;

      // Individual face animations - flying effect
      if (face1Ref.current) {
        face1Ref.current.position.x = Math.sin(time * 0.8) * 0.5;
        face1Ref.current.position.y = Math.cos(time * 0.6) * 0.3;
        face1Ref.current.rotation.z = time * 0.5;
      }

      if (face2Ref.current) {
        face2Ref.current.position.x = Math.cos(time * 0.7) * 0.4;
        face2Ref.current.position.z = Math.sin(time * 0.9) * 0.3;
        face2Ref.current.rotation.x = time * 0.4;
      }

      if (face3Ref.current) {
        face3Ref.current.position.y = Math.sin(time * 0.5) * 0.4;
        face3Ref.current.position.z = Math.cos(time * 0.8) * 0.3;
        face3Ref.current.rotation.y = time * 0.6;
      }

      if (face4Ref.current) {
        face4Ref.current.position.x = Math.sin(time * 0.6 + Math.PI) * 0.3;
        face4Ref.current.position.y = Math.cos(time * 0.4 + Math.PI) * 0.4;
        face4Ref.current.rotation.z = -time * 0.3;
      }

      if (face5Ref.current) {
        face5Ref.current.position.z = Math.sin(time * 0.7 + Math.PI/2) * 0.4;
        face5Ref.current.position.x = Math.cos(time * 0.9 + Math.PI/2) * 0.2;
        face5Ref.current.rotation.x = time * 0.7;
      }

      if (face6Ref.current) {
        face6Ref.current.position.y = Math.cos(time * 0.8 + Math.PI/3) * 0.3;
        face6Ref.current.position.z = Math.sin(time * 0.5 + Math.PI/3) * 0.2;
        face6Ref.current.rotation.y = -time * 0.4;
      }
    }
  });

  return (
    <group ref={groupRef} scale={scale} rotation={rotation}>
      {/* Flying cube faces with green and grey colors */}
      
      {/* Face 1 - Green */}
      <mesh ref={face1Ref} position={[0.5, 0, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial 
          color="#10B981" 
          roughness={0.2} 
          metalness={0.3}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
      
      {/* Face 2 - Grey */}
      <mesh ref={face2Ref} position={[-0.5, 0, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial 
          color="#6B7280" 
          roughness={0.2} 
          metalness={0.3}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
      
      {/* Face 3 - Green (different shade) */}
      <mesh ref={face3Ref} position={[0, 0.5, 0]} rotation={[Math.PI/2, 0, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial 
          color="#059669" 
          roughness={0.2} 
          metalness={0.3}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
      
      {/* Face 4 - Grey (different shade) */}
      <mesh ref={face4Ref} position={[0, -0.5, 0]} rotation={[Math.PI/2, 0, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial 
          color="#4B5563" 
          roughness={0.2} 
          metalness={0.3}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
      
      {/* Face 5 - Green (lighter) */}
      <mesh ref={face5Ref} position={[0, 0, 0.5]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial 
          color="#34D399" 
          roughness={0.2} 
          metalness={0.3}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
      
      {/* Face 6 - Grey (lighter) */}
      <mesh ref={face6Ref} position={[0, 0, -0.5]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial 
          color="#9CA3AF" 
          roughness={0.2} 
          metalness={0.3}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
      
      {/* Central wireframe cube for structure */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial 
          color="#64748B" 
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

export default SlicedCube;
