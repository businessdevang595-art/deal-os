import { useScroll, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function ChaosScene() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const offset = scroll.offset;
    // Show between 0.1 and 0.2
    const visible = offset > 0.05 && offset < 0.25;
    groupRef.current.visible = visible;
    
    if (visible) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 2, -5]} visible={false}>
      <Text fontSize={0.5} color="white" anchorX="center" anchorY="middle">
        Scattered Information
      </Text>
      <Text fontSize={0.2} color="#94a3b8" position={[0, -0.6, 0]} anchorX="center" anchorY="middle">
        WhatsApp • Spreadsheets • Notes
      </Text>
    </group>
  );
}
