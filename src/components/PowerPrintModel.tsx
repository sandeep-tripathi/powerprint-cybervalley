
import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
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
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [material, setMaterial] = useState<THREE.Material | null>(null);

  useFrame((state) => {
    if (animate && groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.y = time * 0.3;
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
  });

  // Load texture from uploaded image
  useEffect(() => {
    if (modelData.textureUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        modelData.textureUrl,
        (loadedTexture) => {
          loadedTexture.wrapS = THREE.RepeatWrapping;
          loadedTexture.wrapT = THREE.RepeatWrapping;
          loadedTexture.flipY = false; // Important for proper texture orientation
          setTexture(loadedTexture);
        },
        undefined,
        (error) => {
          console.error("Error loading texture:", error);
          setTexture(null);
        }
      );
    }
  }, [modelData.textureUrl]);

  // Create material when texture loads
  useEffect(() => {
    if (texture) {
      const newMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.3,
        metalness: 0.1,
        envMapIntensity: 1.0,
        side: THREE.DoubleSide // Show texture on both sides
      });
      setMaterial(newMaterial);
    } else {
      const fallbackMaterial = new THREE.MeshStandardMaterial({
        color: "#8B5CF6",
        roughness: 0.2,
        metalness: 0.8
      });
      setMaterial(fallbackMaterial);
    }
  }, [texture]);

  // Create a more complex geometry based on the model complexity
  const createPowerPrintGeometry = () => {
    const complexity = Math.max(1, Math.min(4, modelData.complexity / 2000));
    
    // Create a more sophisticated shape based on complexity
    if (complexity >= 3) {
      // High complexity: Torus knot with proper UV mapping
      const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
      return geometry;
    } else if (complexity >= 2) {
      // Medium complexity: Dodecahedron
      const geometry = new THREE.DodecahedronGeometry(1.2);
      return geometry;
    } else {
      // Lower complexity: Icosahedron
      const geometry = new THREE.IcosahedronGeometry(1.2, 1);
      return geometry;
    }
  };

  const geometry = createPowerPrintGeometry();

  if (!material) {
    return null; // Wait for material to be ready
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main generated model with uploaded image texture */}
      <mesh geometry={geometry} material={material} />
      
      {/* Additional detail meshes for higher complexity */}
      {modelData.complexity > 4000 && material && (
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
