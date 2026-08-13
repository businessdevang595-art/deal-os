import { useScroll, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function DealRoomScene() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const offset = scroll.offset;
    const visible = offset > 0.75 && offset < 0.95;
    groupRef.current.visible = visible;
  });

  return (
    <group ref={groupRef} position={[0, -25, -35]} visible={false}>
      <Text fontSize={0.6} color="#fb7185" anchorX="center" anchorY="middle" position={[0, 3, 0]}>
        DEAL ROOM
      </Text>
      <Text fontSize={0.2} color="white" position={[0, 2, 0]} anchorX="center" anchorY="middle">
        Qualified → Matched → Site Visit → Offer → Negotiation → Closing
      </Text>
      
      <mesh position={[-2, 0, 0]}>
         <boxGeometry args={[1.5, 3, 1.5]} />
         <meshStandardMaterial color="#3b82f6" wireframe opacity={0.3} transparent />
      </mesh>

      <mesh position={[2, 0, 0]}>
         <sphereGeometry args={[0.8, 32, 32]} />
         <meshStandardMaterial color="#8b5cf6" wireframe opacity={0.3} transparent />
      </mesh>
    </group>
  );
}
