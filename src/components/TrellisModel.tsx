
import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";

interface TrellisModelProps {
  modelData: {
    meshData: any;
    textureUrl: string;
    complexity: number;
    vertices: number;
    faces: number;
  };
  animate?: boolean;
}

const TrellisModel = ({ modelData, animate = true }: TrellisModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useFrame((state) => {
    if (animate && groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.y = time * 0.3;
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
  });

  // Load texture
  useEffect(() => {
    if (modelData.textureUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(modelData.textureUrl, (loadedTexture) => {
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.RepeatWrapping;
        setTexture(loadedTexture);
      });
    }
  }, [modelData.textureUrl]);

  // Create a more complex geometry based on the model complexity
  const createTrellisGeometry = () => {
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

  const geometry = createTrellisGeometry();

  const material = texture 
    ? new THREE.MeshStandardMaterial({ 
        map: texture, 
        roughness: 0.2, 
        metalness: 0.8,
        envMapIntensity: 1.0
      })
    : new THREE.MeshStandardMaterial({ 
        color: "#8B5CF6", 
        roughness: 0.2, 
        metalness: 0.8 
      });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main generated model */}
      <mesh geometry={geometry} material={material} />
      
      {/* Additional detail meshes for higher complexity */}
      {modelData.complexity > 4000 && (
        <>
          <mesh position={[0, 2, 0]} scale={[0.3, 0.3, 0.3]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#A855F7" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, -2, 0]} scale={[0.3, 0.3, 0.3]}>
            <cylinderGeometry args={[0.5, 0.8, 1, 8]} />
            <meshStandardMaterial color="#7C3AED" roughness={0.3} metalness={0.7} />
          </mesh>
        </>
      )}
    </group>
  );
};

export default TrellisModel;
