
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

interface Panda3DProps {
  animate?: boolean;
}

const Panda3D = ({ animate = true }: Panda3DProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (animate && groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.y = time * 0.3;
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.05;
    }
  });

  // Panda body
  const bodyGeometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);
  
  // Panda head
  const headGeometry = useMemo(() => new THREE.SphereGeometry(0.8, 32, 32), []);
  
  // Panda ears
  const earGeometry = useMemo(() => new THREE.SphereGeometry(0.3, 16, 16), []);
  
  // Panda arms and legs
  const limbGeometry = useMemo(() => new THREE.CylinderGeometry(0.2, 0.25, 0.8, 16), []);
  
  // Panda eyes
  const eyeGeometry = useMemo(() => new THREE.SphereGeometry(0.15, 16, 16), []);
  
  // Panda nose
  const noseGeometry = useMemo(() => new THREE.SphereGeometry(0.05, 8, 8), []);

  // Materials
  const whiteMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#FFFFFF",
    roughness: 0.7,
    metalness: 0.1
  }), []);
  
  const blackMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#000000",
    roughness: 0.8,
    metalness: 0.1
  }), []);

  const pinkMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#FFB6C1",
    roughness: 0.6,
    metalness: 0.1
  }), []);

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh geometry={bodyGeometry} material={whiteMaterial} position={[0, -0.5, 0]} />
      
      {/* Head */}
      <mesh geometry={headGeometry} material={whiteMaterial} position={[0, 0.8, 0]} />
      
      {/* Ears */}
      <mesh geometry={earGeometry} material={blackMaterial} position={[-0.5, 1.3, 0]} />
      <mesh geometry={earGeometry} material={blackMaterial} position={[0.5, 1.3, 0]} />
      
      {/* Eye patches */}
      <mesh geometry={new THREE.SphereGeometry(0.25, 16, 16)} material={blackMaterial} position={[-0.3, 0.9, 0.6]} />
      <mesh geometry={new THREE.SphereGeometry(0.25, 16, 16)} material={blackMaterial} position={[0.3, 0.9, 0.6]} />
      
      {/* Eyes */}
      <mesh geometry={eyeGeometry} material={whiteMaterial} position={[-0.25, 0.95, 0.65]} />
      <mesh geometry={eyeGeometry} material={whiteMaterial} position={[0.25, 0.95, 0.65]} />
      
      {/* Eye pupils */}
      <mesh geometry={new THREE.SphereGeometry(0.05, 8, 8)} material={blackMaterial} position={[-0.25, 0.95, 0.7]} />
      <mesh geometry={new THREE.SphereGeometry(0.05, 8, 8)} material={blackMaterial} position={[0.25, 0.95, 0.7]} />
      
      {/* Nose */}
      <mesh geometry={noseGeometry} material={pinkMaterial} position={[0, 0.75, 0.75]} />
      
      {/* Arms */}
      <mesh geometry={limbGeometry} material={blackMaterial} position={[-0.8, 0.2, 0]} rotation={[0, 0, Math.PI / 6]} />
      <mesh geometry={limbGeometry} material={blackMaterial} position={[0.8, 0.2, 0]} rotation={[0, 0, -Math.PI / 6]} />
      
      {/* Legs */}
      <mesh geometry={limbGeometry} material={blackMaterial} position={[-0.4, -1.2, 0]} />
      <mesh geometry={limbGeometry} material={blackMaterial} position={[0.4, -1.2, 0]} />
      
      {/* Paws */}
      <mesh geometry={new THREE.SphereGeometry(0.15, 16, 16)} material={blackMaterial} position={[-0.4, -1.6, 0]} />
      <mesh geometry={new THREE.SphereGeometry(0.15, 16, 16)} material={blackMaterial} position={[0.4, -1.6, 0]} />
    </group>
  );
};

export default Panda3D;
