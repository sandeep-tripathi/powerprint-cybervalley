
import * as THREE from "three";

const MiniHandMesh = () => {
  return (
    <group scale={[0.15, 0.15, 0.15]} rotation={[0.2, 0.3, 0]}>
      {/* Palm */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.3, 2.5]} />
        <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Thumb */}
      <group position={[-0.8, 0, 0.8]} rotation={[0, 0, 0.3]}>
        <mesh position={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.15, 0.18, 0.8]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.9]}>
          <cylinderGeometry args={[0.12, 0.15, 0.6]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
      
      {/* Index Finger */}
      <group position={[-0.4, 0, 1.5]}>
        <mesh position={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.12, 0.15, 1]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 1.1]}>
          <cylinderGeometry args={[0.1, 0.12, 0.6]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 1.5]}>
          <cylinderGeometry args={[0.08, 0.1, 0.4]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
      
      {/* Middle Finger */}
      <group position={[0, 0, 1.6]}>
        <mesh position={[0, 0, 0.6]}>
          <cylinderGeometry args={[0.12, 0.15, 1.2]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 1.3]}>
          <cylinderGeometry args={[0.1, 0.12, 0.7]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 1.8]}>
          <cylinderGeometry args={[0.08, 0.1, 0.5]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
      
      {/* Ring Finger */}
      <group position={[0.4, 0, 1.5]}>
        <mesh position={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.11, 0.14, 1]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 1.1]}>
          <cylinderGeometry args={[0.09, 0.11, 0.6]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 1.5]}>
          <cylinderGeometry args={[0.07, 0.09, 0.4]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
      
      {/* Pinky Finger */}
      <group position={[0.7, 0, 1.2]} rotation={[0, 0, -0.1]}>
        <mesh position={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.1, 0.12, 0.8]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.9]}>
          <cylinderGeometry args={[0.08, 0.1, 0.5]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 1.2]}>
          <cylinderGeometry args={[0.06, 0.08, 0.3]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
    </group>
  );
};

export default MiniHandMesh;
