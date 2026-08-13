import { useScroll, Box, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function PropertyScene() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const buildingRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const offset = scroll.offset;
    const visible = offset > 0.2 && offset < 0.4;
    groupRef.current.visible = visible;

    if (visible && buildingRef.current) {
        buildingRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -10]} visible={false}>
      <mesh ref={buildingRef} position={[-2, 1, 0]}>
        <boxGeometry args={[2, 4, 2]} />
        <meshStandardMaterial color="#3b82f6" wireframe />
      </mesh>
      
      <group position={[2, 2, 0]}>
        <Text fontSize={0.4} color="white" anchorX="left" anchorY="middle">
          Structured Property Record
        </Text>
        <Text fontSize={0.2} color="#60a5fa" position={[0, -0.5, 0]} anchorX="left" anchorY="middle">
          3 BHK Apartment • ₹82,00,000
        </Text>
      </group>
    </group>
  );
}
