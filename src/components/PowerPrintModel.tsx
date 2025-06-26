
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import GeneratedMesh3D from "./GeneratedMesh3D";

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

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    console.log("PowerPrint model clicked!", {
      vertices: modelData.vertices,
      faces: modelData.faces,
      complexity: modelData.complexity,
      point: event.point,
      uv: event.uv
    });
  };

  // If we have real mesh data, use it; otherwise fall back to procedural geometry
  if (modelData.realMesh) {
    console.log("Rendering real 2D→3D converted mesh with", modelData.realMesh.vertexCount, "vertices");
    
    // Analyze property changes and create appropriate material properties
    const propertyChanges = modelData.meshData.propertyChanges || [];
    const lastChange = propertyChanges[propertyChanges.length - 1] || "";
    
    // Default material properties
    let materialProps = {
      color: "#8B5CF6",
      roughness: 0.2,
      metalness: 0.8,
      transparent: false,
      opacity: 1.0,
    };

    // Apply changes based on the most recent property change
    if (lastChange.toLowerCase().includes("metallic") || lastChange.toLowerCase().includes("gold")) {
      materialProps.color = "#FFD700";
      materialProps.metalness = 0.9;
      materialProps.roughness = 0.1;
    } else if (lastChange.toLowerCase().includes("blue")) {
      materialProps.color = "#3B82F6";
      materialProps.metalness = 0.3;
      materialProps.roughness = 0.4;
    } else if (lastChange.toLowerCase().includes("red")) {
      materialProps.color = "#EF4444";
      materialProps.metalness = 0.3;
      materialProps.roughness = 0.4;
    } else if (lastChange.toLowerCase().includes("transparent") || lastChange.toLowerCase().includes("glass")) {
      materialProps.color = "#FFFFFF";
      materialProps.transparent = true;
      materialProps.opacity = 0.3;
      materialProps.metalness = 0.0;
      materialProps.roughness = 0.0;
    } else if (lastChange.toLowerCase().includes("stone") || lastChange.toLowerCase().includes("rough")) {
      materialProps.color = "#78716C";
      materialProps.roughness = 0.9;
      materialProps.metalness = 0.0;
    } else if (lastChange.toLowerCase().includes("shiny") || lastChange.toLowerCase().includes("mirror")) {
      materialProps.metalness = 1.0;
      materialProps.roughness = 0.0;
    } else if (lastChange.toLowerCase().includes("matte")) {
      materialProps.roughness = 1.0;
      materialProps.metalness = 0.0;
    }

    return (
      <group ref={groupRef} position={[0, 0, 0]} onClick={handleClick}>
        <GeneratedMesh3D 
          meshData={modelData.realMesh}
          animate={false} // We handle animation at the group level
          material={materialProps}
          showTexture={true}
        />
        
        {/* Visual indicator for recent changes */}
        {propertyChanges.length > 0 && (
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

  // Analyze property changes and create appropriate material
  const material = useMemo(() => {
    const propertyChanges = modelData.meshData.propertyChanges || [];
    const lastChange = propertyChanges[propertyChanges.length - 1] || "";
    
    // Default material properties
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

    // Apply changes based on the most recent property change
    if (lastChange.toLowerCase().includes("metallic") || lastChange.toLowerCase().includes("gold")) {
      materialProps.color = "#FFD700";
      materialProps.metalness = 0.9;
      materialProps.roughness = 0.1;
      materialProps.envMapIntensity = 1.5;
    } else if (lastChange.toLowerCase().includes("blue")) {
      materialProps.color = "#3B82F6";
      materialProps.metalness = 0.3;
      materialProps.roughness = 0.4;
    } else if (lastChange.toLowerCase().includes("red")) {
      materialProps.color = "#EF4444";
      materialProps.metalness = 0.3;
      materialProps.roughness = 0.4;
    } else if (lastChange.toLowerCase().includes("transparent") || lastChange.toLowerCase().includes("glass")) {
      materialProps.color = "#FFFFFF";
      materialProps.transparent = true;
      materialProps.opacity = 0.3;
      materialProps.metalness = 0.0;
      materialProps.roughness = 0.0;
      materialProps.envMapIntensity = 2.0;
    } else if (lastChange.toLowerCase().includes("stone") || lastChange.toLowerCase().includes("rough")) {
      materialProps.color = "#78716C";
      materialProps.roughness = 0.9;
      materialProps.metalness = 0.0;
    } else if (lastChange.toLowerCase().includes("shiny") || lastChange.toLowerCase().includes("mirror")) {
      materialProps.metalness = 1.0;
      materialProps.roughness = 0.0;
      materialProps.envMapIntensity = 2.0;
    } else if (lastChange.toLowerCase().includes("matte")) {
      materialProps.roughness = 1.0;
      materialProps.metalness = 0.0;
      materialProps.envMapIntensity = 0.5;
    }

    // Check for multiple changes to combine effects
    propertyChanges.forEach((change: string) => {
      if (change.toLowerCase().includes("detail") || change.toLowerCase().includes("complexity")) {
        materialProps.emissive = "#4C1D95";
        materialProps.emissiveIntensity = 0.1;
      }
    });

    return new THREE.MeshStandardMaterial(materialProps);
  }, [modelData.meshData.propertyChanges]);

  return (
    <group ref={groupRef} position={[0, 0, 0]} onClick={handleClick}>
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
      {modelData.meshData.propertyChanges && modelData.meshData.propertyChanges.length > 0 && (
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
