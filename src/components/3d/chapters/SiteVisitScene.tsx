import { useScroll, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function SiteVisitScene() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const offset = scroll.offset;
    const visible = offset > 0.55 && offset < 0.75;
    groupRef.current.visible = visible;
  });

  return (
    <group ref={groupRef} position={[0, -15, -25]} visible={false}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#f97316" wireframe />
      </mesh>
      
      <group position={[3, 2, 0]}>
        <Text fontSize={0.4} color="white" anchorX="left" anchorY="middle">
          SITE VISIT
        </Text>
        <Text fontSize={0.2} color="#fdba74" position={[0, -0.5, 0]} anchorX="left" anchorY="middle">
          Saturday, 10:30 AM
        </Text>
      </group>
    </group>
  );
}
