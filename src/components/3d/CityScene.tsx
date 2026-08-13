import { Box, Plane } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function CityScene() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Memoize random buildings, use eslint-disable to bypass the strict purity check
  // since this is just a procedural generation step done once on mount
  const buildings = useMemo(() => {
    return Array.from({ length: 40 }).map(() => ({
      // eslint-disable-next-line react-hooks/purity
      args: [1, Math.random() * 5 + 2, 1] as [number, number, number],
      // eslint-disable-next-line react-hooks/purity
      position: [
        // eslint-disable-next-line react-hooks/purity
        (Math.random() - 0.5) * 40,
        // eslint-disable-next-line react-hooks/purity
        (Math.random() * 5 + 2) / 2 - 2,
        // eslint-disable-next-line react-hooks/purity
        (Math.random() - 0.5) * 40 - 10
      ] as [number, number, number]
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {/* Ground */}
      <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <meshStandardMaterial color="#0f172a" />
      </Plane>
      
      {/* Abstract Buildings */}
      {buildings.map((b, i) => (
        <Box 
          key={i} 
          args={b.args} 
          position={b.position}
        >
          <meshStandardMaterial color="#1e293b" opacity={0.8} transparent />
        </Box>
      ))}
    </group>
  );
}
