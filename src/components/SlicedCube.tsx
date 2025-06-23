
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
      
      // Main group rotation - slower and more controlled
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.15;
      groupRef.current.rotation.x = Math.cos(time * 0.15) * 0.08;

      // Individual face animations - more precise CAD-like movement
      if (face1Ref.current) {
        face1Ref.current.position.x = 0.5 + Math.sin(time * 0.6) * 0.3;
        face1Ref.current.position.y = Math.cos(time * 0.4) * 0.2;
        face1Ref.current.rotation.z = time * 0.3;
      }

      if (face2Ref.current) {
        face2Ref.current.position.x = -0.5 + Math.cos(time * 0.5) * 0.3;
        face2Ref.current.position.z = Math.sin(time * 0.7) * 0.2;
        face2Ref.current.rotation.x = time * 0.25;
      }

      if (face3Ref.current) {
        face3Ref.current.position.y = 0.5 + Math.sin(time * 0.4) * 0.3;
        face3Ref.current.position.z = Math.cos(time * 0.6) * 0.2;
        face3Ref.current.rotation.y = time * 0.4;
      }

      if (face4Ref.current) {
        face4Ref.current.position.y = -0.5 + Math.sin(time * 0.5 + Math.PI) * 0.3;
        face4Ref.current.position.x = Math.cos(time * 0.3 + Math.PI) * 0.2;
        face4Ref.current.rotation.z = -time * 0.2;
      }

      if (face5Ref.current) {
        face5Ref.current.position.z = 0.5 + Math.sin(time * 0.55 + Math.PI/2) * 0.3;
        face5Ref.current.position.x = Math.cos(time * 0.7 + Math.PI/2) * 0.15;
        face5Ref.current.rotation.x = time * 0.5;
      }

      if (face6Ref.current) {
        face6Ref.current.position.z = -0.5 + Math.cos(time * 0.6 + Math.PI/3) * 0.3;
        face6Ref.current.position.y = Math.sin(time * 0.4 + Math.PI/3) * 0.15;
        face6Ref.current.rotation.y = -time * 0.3;
      }
    }
  });

  // CAD-style material properties
  const cadMaterialProps = {
    roughness: 0.1,
    metalness: 0.8,
    transparent: false,
    opacity: 1,
  };

  return (
    <group ref={groupRef} scale={scale} rotation={rotation}>
      {/* CAD-style cube faces with precise geometry */}
      
      {/* Face 1 - Green (Anodized Aluminum look) */}
      <mesh ref={face1Ref} position={[0.5, 0, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.05]} />
        <meshStandardMaterial 
          color="#2D7D32" 
          {...cadMaterialProps}
        />
        {/* Edge highlight */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.9, 0.9, 0.05)]} />
          <lineBasicMaterial color="#1B5E20" linewidth={2} />
        </lineSegments>
      </mesh>
      
      {/* Face 2 - Grey (Stainless Steel look) */}
      <mesh ref={face2Ref} position={[-0.5, 0, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.05]} />
        <meshStandardMaterial 
          color="#546E7A" 
          {...cadMaterialProps}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.9, 0.9, 0.05)]} />
          <lineBasicMaterial color="#37474F" linewidth={2} />
        </lineSegments>
      </mesh>
      
      {/* Face 3 - Green (Machined Surface) */}
      <mesh ref={face3Ref} position={[0, 0.5, 0]} rotation={[Math.PI/2, 0, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.05]} />
        <meshStandardMaterial 
          color="#388E3C" 
          {...cadMaterialProps}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.9, 0.9, 0.05)]} />
          <lineBasicMaterial color="#1B5E20" linewidth={2} />
        </lineSegments>
      </mesh>
      
      {/* Face 4 - Grey (Cast Iron look) */}
      <mesh ref={face4Ref} position={[0, -0.5, 0]} rotation={[Math.PI/2, 0, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.05]} />
        <meshStandardMaterial 
          color="#455A64" 
          {...cadMaterialProps}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.9, 0.9, 0.05)]} />
          <lineBasicMaterial color="#263238" linewidth={2} />
        </lineSegments>
      </mesh>
      
      {/* Face 5 - Green (Powder Coated) */}
      <mesh ref={face5Ref} position={[0, 0, 0.5]} rotation={[0, Math.PI/2, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.05]} />
        <meshStandardMaterial 
          color="#43A047" 
          {...cadMaterialProps}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.9, 0.9, 0.05)]} />
          <lineBasicMaterial color="#1B5E20" linewidth={2} />
        </lineSegments>
      </mesh>
      
      {/* Face 6 - Grey (Brushed Aluminum) */}
      <mesh ref={face6Ref} position={[0, 0, -0.5]} rotation={[0, Math.PI/2, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.05]} />
        <meshStandardMaterial 
          color="#607D8B" 
          {...cadMaterialProps}
          roughness={0.2}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.9, 0.9, 0.05)]} />
          <lineBasicMaterial color="#37474F" linewidth={2} />
        </lineSegments>
      </mesh>
      
      {/* Central wireframe structure - CAD assembly frame */}
      <mesh>
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshBasicMaterial 
          color="#78909C" 
          wireframe={true}
          transparent={true}
          opacity={0.4}
        />
      </mesh>
      
      {/* CAD-style coordinate system indicators */}
      <group>
        {/* X-axis indicator */}
        <mesh position={[0.7, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} rotation={[0, 0, Math.PI/2]} />
          <meshStandardMaterial color="#E53E3E" metalness={0.8} roughness={0.1} />
        </mesh>
        {/* Y-axis indicator */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial color="#38A169" metalness={0.8} roughness={0.1} />
        </mesh>
        {/* Z-axis indicator */}
        <mesh position={[0, 0, 0.7]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} rotation={[Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#3182CE" metalness={0.8} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
};

export default SlicedCube;
