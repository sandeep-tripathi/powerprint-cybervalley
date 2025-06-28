import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

interface OrnateRingProps {
  animate?: boolean;
}

const OrnateRing = ({ animate = true }: OrnateRingProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const gemRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (animate && groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.y = time * 0.3;
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
    
    // Add subtle gem sparkle
    if (gemRef.current && gemRef.current.material) {
      const time = state.clock.elapsedTime;
      const material = gemRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2;
    }
  });

  // Create ornate ring band with decorative patterns
  const ringGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Outer ring profile
    const outerRadius = 1.2;
    const innerRadius = 0.9;
    
    // Create the ring shape
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    
    const extrudeSettings = {
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.02,
      bevelThickness: 0.02
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // Create decorative filigree details
  const createFiligreePattern = useMemo(() => {
    const filigreeGroup = new THREE.Group();
    
    // Create small decorative spheres around the band
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 8, 8),
        new THREE.MeshStandardMaterial({ 
          color: "#FFD700",
          metalness: 0.9,
          roughness: 0.1 
        })
      );
      sphere.position.set(
        Math.cos(angle) * 1.05,
        Math.sin(angle) * 1.05,
        0.1
      );
      filigreeGroup.add(sphere);
    }
    
    // Add decorative twisted elements
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const curve = new THREE.EllipseCurve(0, 0, 0.15, 0.15, 0, Math.PI * 2);
      const points = curve.getPoints(12);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: "#FFD700" });
      const decorativeLine = new THREE.Line(geometry, material);
      decorativeLine.position.set(
        Math.cos(angle) * 1.05,
        Math.sin(angle) * 1.05,
        0.05
      );
      decorativeLine.scale.set(0.3, 0.3, 0.3);
      filigreeGroup.add(decorativeLine);
    }
    
    return filigreeGroup;
  }, []);

  // Create main gemstone
  const gemGeometry = useMemo(() => {
    return new THREE.ConeGeometry(0.15, 0.25, 8);
  }, []);

  // Create smaller accent gems
  const accentGems = useMemo(() => {
    const gems = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      gems.push({
        position: [Math.cos(angle) * 0.8, Math.sin(angle) * 0.8, 0.1],
        scale: 0.4
      });
    }
    return gems;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Main ring band */}
      <mesh geometry={ringGeometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#DAA520"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>

      {/* Decorative filigree patterns */}
      <primitive object={createFiligreePattern} />

      {/* Main central gemstone */}
      <mesh 
        ref={gemRef}
        geometry={gemGeometry} 
        position={[0, 0, 0.3]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#E8E8E8"
          metalness={0.1}
          roughness={0.0}
          transparent={true}
          opacity={0.9}
          emissive="#DDDDDD"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Accent gemstones */}
      {accentGems.map((gem, index) => (
        <mesh
          key={index}
          geometry={new THREE.SphereGeometry(0.04, 8, 8)}
          position={gem.position}
          scale={[gem.scale, gem.scale, gem.scale]}
        >
          <meshStandardMaterial
            color="#FFFFFF"
            metalness={0.1}
            roughness={0.0}
            transparent={true}
            opacity={0.8}
            emissive="#CCCCCC"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Ornate setting for main gem */}
      <mesh position={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.2, 0.25, 0.1, 8]} />
        <meshStandardMaterial
          color="#B8860B"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

export default OrnateRing;
