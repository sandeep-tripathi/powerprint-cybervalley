
import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface PowerPrintModelProps {
  modelData: {
    meshData: any;
    textureUrl: string;
    complexity: number;
    vertices: number;
    faces: number;
  };
  animate?: boolean;
}

const PowerPrintModel = ({ modelData, animate = true }: PowerPrintModelProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (animate && groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.y = time * 0.3;
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
  });

  // Create a more complex geometry based on the model complexity
  const createPowerPrintGeometry = () => {
    const complexity = Math.max(1, Math.min(4, modelData.complexity / 2000));
    
    // Create a more sophisticated shape based on complexity
    if (complexity >= 3) {
      // High complexity: Torus knot
      return new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    } else if (complexity >= 2) {
      // Medium complexity: Dodecahedron
      return new THREE.DodecahedronGeometry(1.2);
    } else {
      // Lower complexity: Icosahedron
      return new THREE.IcosahedronGeometry(1.2, 1);
    }
  };

  const geometry = createPowerPrintGeometry();

  // Create material without texture - pure geometry visualization
  const material = new THREE.MeshStandardMaterial({
    color: "#8B5CF6",
    roughness: 0.2,
    metalness: 0.8,
    envMapIntensity: 1.0,
    side: THREE.DoubleSide
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main generated model without texture */}
      <mesh geometry={geometry} material={material} />
      
      {/* Additional detail meshes for higher complexity */}
      {modelData.complexity > 4000 && (
        <>
          <mesh position={[0, 2, 0]} scale={[0.3, 0.3, 0.3]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial 
              color="#A855F7" 
              roughness={0.3} 
              metalness={0.7}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh position={[0, -2, 0]} scale={[0.3, 0.3, 0.3]}>
            <cylinderGeometry args={[0.5, 0.8, 1, 8]} />
            <meshStandardMaterial 
              color="#7C3AED" 
              roughness={0.3} 
              metalness={0.7}
              transparent
              opacity={0.8}
            />
          </mesh>
        </>
      )}
    </group>
  );
};

export default PowerPrintModel;
