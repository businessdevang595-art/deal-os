import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import CityScene from "./CityScene";
import ChaosScene from "./chapters/ChaosScene";
import PropertyScene from "./chapters/PropertyScene";
import BuyerScene from "./chapters/BuyerScene";
import MatchingScene from "./chapters/MatchingScene";
import SiteVisitScene from "./chapters/SiteVisitScene";
import FeedbackScene from "./chapters/FeedbackScene";
import DealRoomScene from "./chapters/DealRoomScene";
import ClosingScene from "./chapters/ClosingScene";

export default function ScrollStory() {
  const scroll = useScroll();
  const cameraGroup = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!cameraGroup.current) return;
    
    // Map scroll offset (0 to 1) to camera position
    const offset = scroll.offset;
    
    // Smoothly animate the camera down into the city
    cameraGroup.current.position.y = THREE.MathUtils.lerp(
      cameraGroup.current.position.y,
      -offset * 35, // move down across the different scenes
      0.1
    );
    
    cameraGroup.current.position.z = THREE.MathUtils.lerp(
      cameraGroup.current.position.z,
      10 - offset * 40, // move forward deeper into scenes
      0.1
    );
  });

  return (
    <group ref={cameraGroup}>
      <CityScene />
      
      <ChaosScene />
      <PropertyScene />
      <BuyerScene />
      <MatchingScene />
      <SiteVisitScene />
      <FeedbackScene />
      <DealRoomScene />
      <ClosingScene />
    </group>
  );
}
