import { useScroll, Text, QuadraticBezierLine } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function MatchingScene() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const lineRef = useRef(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const offset = scroll.offset;
    const visible = offset > 0.45 && offset < 0.65;
    groupRef.current.visible = visible;
  });

  return (
    <group ref={groupRef} position={[0, -10, -20]} visible={false}>
      {/* Property Nodes */}
      <mesh position={[-4, 2, 0]}>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#3b82f6" wireframe />
      </mesh>
      
      {/* Buyer Node */}
      <mesh position={[4, 2, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#8b5cf6" wireframe />
      </mesh>

      <QuadraticBezierLine 
        ref={lineRef}
        start={[-3.5, 2, 0]} 
        end={[3.5, 2, 0]} 
        mid={[0, 4, 0]} 
        color="#06b6d4" 
        lineWidth={3} 
        dashed={true}
      />
      
      <group position={[0, 3, 0]}>
        <Text fontSize={0.6} color="#06b6d4" anchorX="center" anchorY="middle">
          94% MATCH
        </Text>
        <Text fontSize={0.2} color="white" position={[0, -0.5, 0]} anchorX="center" anchorY="middle">
          ✓ Within budget  ✓ Preferred locality
        </Text>
      </group>
    </group>
  );
}
