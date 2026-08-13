import { useScroll, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function ClosingScene() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const offset = scroll.offset;
    const visible = offset > 0.85;
    groupRef.current.visible = visible;
  });

  return (
    <group ref={groupRef} position={[0, -30, -40]} visible={false}>
      <Text fontSize={0.8} color="#10b981" anchorX="center" anchorY="middle" position={[0, 3, 0]}>
        COMPLETE DEAL
      </Text>
      <Text fontSize={0.3} color="white" position={[0, 1.5, 0]} anchorX="center" anchorY="middle">
        From scattered information to one complete workflow.
      </Text>
    </group>
  );
}
