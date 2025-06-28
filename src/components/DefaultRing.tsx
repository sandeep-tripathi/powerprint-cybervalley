
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

interface DefaultRingProps {
  animate?: boolean;
}

const DefaultRing = ({ animate = true }: DefaultRingProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (animate && meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.y = time * 0.5;
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    }
  });

  // Create ring geometry
  const geometry = useMemo(() => {
    return new THREE.RingGeometry(0.8, 1.2, 32, 8);
  }, []);

  // Create material with gradient-like appearance
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#8B5CF6",
      roughness: 0.3,
      metalness: 0.7,
      side: THREE.DoubleSide,
    });
  }, []);

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} material={material} />
    </group>
  );
};

export default DefaultRing;
