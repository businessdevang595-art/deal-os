import { useScroll, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function FeedbackScene() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const offset = scroll.offset;
    const visible = offset > 0.65 && offset < 0.85;
    groupRef.current.visible = visible;
  });

  return (
    <group ref={groupRef} position={[0, -20, -30]} visible={false}>
      <group position={[0, 2, 0]}>
        <Text fontSize={0.5} color="#4ade80" anchorX="center" anchorY="middle">
          VERY INTERESTED
        </Text>
        <Text fontSize={0.2} color="white" position={[0, -0.6, 0]} anchorX="center" anchorY="middle">
          Location ★★★★★   Price ★★★☆☆
        </Text>
      </group>
    </group>
  );
}
