
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import GeneratedMesh3D from "./GeneratedMesh3D";
import Panda3D from "./Panda3D";

interface PowerPrintModelProps {
  modelData: {
    meshData: any;
    textureUrl: string;
    complexity: number;
    vertices: number;
    faces: number;
    realMesh?: any; // The actual generated mesh data
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

  // Apply size modifications from LLM manipulation
  const scaleModifications = useMemo((): [number, number, number] => {
    const sizeModification = modelData.meshData.sizeModification;
    if (sizeModification) {
      return [sizeModification.scaleX || 1, sizeModification.scaleY || 1, sizeModification.scaleZ || 1];
    }
    return [1, 1, 1];
  }, [modelData.meshData.sizeModification]);

  // Check if this is a default panda model
  const isDefaultPanda = modelData.meshData.type === "default_panda";

  // If this is a default panda, render the Panda3D component with modifications
  if (isDefaultPanda) {
    console.log("Rendering default panda model");
    
    return (
      <group ref={groupRef} position={[0, 0, 0]} scale={scaleModifications}>
        <Panda3D animate={false} />
        
        {/* Apply color modifications as overlay if they exist */}
        {modelData.meshData.colorModification && (
          <mesh position={[0, 0, 0]} scale={[3, 3, 3]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
              color={modelData.meshData.colorModification.primaryColor}
              transparent
              opacity={0.3}
              roughness={modelData.meshData.colorModification.finish === 'metallic' ? 0.1 : 0.7}
              metalness={modelData.meshData.colorModification.finish === 'metallic' ? 0.9 : 0.1}
            />
          </mesh>
        )}
        
        {/* Visual indicator for recent changes */}
        {(modelData.meshData.colorModification || modelData.meshData.sizeModification) && (
          <mesh position={[0, 3, 0]} scale={[0.2, 0.2, 0.2]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial 
              color="#10B981" 
              emissive="#10B981"
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        )}
      </group>
    );
  }

  // If we have real mesh data, use it; otherwise fall back to procedural geometry
  if (modelData.realMesh) {
    console.log("Rendering real 2D→3D converted mesh with", modelData.realMesh.vertexCount, "vertices");
    
    // Create appropriate material properties from color modifications
    let materialProps = {
      color: "#8B5CF6",
      roughness: 0.2,
      metalness: 0.8,
      transparent: false,
      opacity: 1.0,
    };

    // Apply color modifications from LLM manipulation
    const colorModification = modelData.meshData.colorModification;
    if (colorModification) {
      materialProps.color = colorModification.primaryColor || "#8B5CF6";
      materialProps.roughness = colorModification.finish === 'metallic' ? 0.1 : 0.4;
      materialProps.metalness = colorModification.finish === 'metallic' ? 0.9 : 0.3;
      
      if (colorModification.intensity) {
        // Adjust brightness based on intensity
        const color = new THREE.Color(materialProps.color);
        color.multiplyScalar(colorModification.intensity);
        materialProps.color = `#${color.getHexString()}`;
      }
    }

    return (
      <group ref={groupRef} position={[0, 0, 0]} scale={scaleModifications}>
        <GeneratedMesh3D 
          meshData={modelData.realMesh}
          animate={false} // We handle animation at the group level
          material={materialProps}
          showTexture={true}
        />
        
        {/* Visual indicator for recent changes */}
        {(modelData.meshData.colorModification || modelData.meshData.sizeModification) && (
          <mesh position={[0, 3, 0]} scale={[0.2, 0.2, 0.2]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial 
              color="#10B981" 
              emissive="#10B981"
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        )}
      </group>
    );
  }

  // Fallback to procedural geometry if no real mesh data
  const createPowerPrintGeometry = () => {
    const complexity = Math.max(1, Math.min(4, modelData.complexity / 2000));
    
    if (complexity >= 3) {
      return new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    } else if (complexity >= 2) {
      return new THREE.DodecahedronGeometry(1.2);
    } else {
      return new THREE.IcosahedronGeometry(1.2, 1);
    }
  };

  const geometry = createPowerPrintGeometry();

  // Create material with LLM modifications
  const material = useMemo(() => {
    let materialProps = {
      color: "#8B5CF6",
      roughness: 0.2,
      metalness: 0.8,
      envMapIntensity: 1.0,
      side: THREE.DoubleSide,
      transparent: false,
      opacity: 1.0,
      emissive: "#000000",
      emissiveIntensity: 0,
    };

    // Apply color modifications from LLM manipulation
    const colorModification = modelData.meshData.colorModification;
    if (colorModification) {
      materialProps.color = colorModification.primaryColor || "#8B5CF6";
      materialProps.roughness = colorModification.finish === 'metallic' ? 0.1 : 0.4;
      materialProps.metalness = colorModification.finish === 'metallic' ? 0.9 : 0.3;
      materialProps.envMapIntensity = colorModification.finish === 'metallic' ? 1.5 : 1.0;
      
      if (colorModification.intensity) {
        // Adjust brightness based on intensity
        const color = new THREE.Color(materialProps.color);
        color.multiplyScalar(colorModification.intensity);
        materialProps.color = `#${color.getHexString()}`;
      }
    }

    return new THREE.MeshStandardMaterial(materialProps);
  }, [modelData.meshData.colorModification]);

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={scaleModifications}>
      {/* Main generated model with dynamic material */}
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

      {/* Visual indicator for recent changes */}
      {(modelData.meshData.colorModification || modelData.meshData.sizeModification) && (
        <mesh position={[0, 3, 0]} scale={[0.2, 0.2, 0.2]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial 
            color="#10B981" 
            emissive="#10B981"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
    </group>
  );
};

export default PowerPrintModel;
