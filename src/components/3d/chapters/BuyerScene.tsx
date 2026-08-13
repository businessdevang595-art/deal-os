import { useScroll, Sphere, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function BuyerScene() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const offset = scroll.offset;
    const visible = offset > 0.35 && offset < 0.55;
    groupRef.current.visible = visible;

    if (visible && sphereRef.current) {
        sphereRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.1);
    }
  });

  return (
    <group ref={groupRef} position={[0, -5, -15]} visible={false}>
      <mesh ref={sphereRef} position={[2, 1, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#8b5cf6" wireframe />
      </mesh>
      
      <group position={[-3, 2, 0]}>
        <Text fontSize={0.4} color="white" anchorX="left" anchorY="middle">
          Buyer Requirement
        </Text>
        <Text fontSize={0.2} color="#a78bfa" position={[0, -0.5, 0]} anchorX="left" anchorY="middle">
          Budget: ₹75L - ₹85L
        </Text>
      </group>
    </group>
  );
}
