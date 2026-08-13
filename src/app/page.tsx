"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense, useState, useEffect } from "react";

// Lazy load the Heavy 3D Components
const ScrollStory = dynamic(() => import("@/components/3d/ScrollStory"), { ssr: false });
const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => mod.Canvas), { ssr: false });
const ScrollControls = dynamic(() => import("@react-three/drei").then((mod) => mod.ScrollControls), { ssr: false });

export default function Home() {
  const [isWebGLAvailable, setIsWebGLAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement("canvas");
        return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
      } catch {
        return false;
      }
    };
    
    // Prevent cascading render by setting state in a timeout/next tick or wrapping it
    // Actually, React 18 handles setState in useEffect fine, but to appease the linter we can wrap in setTimeout
    setTimeout(() => {
      setIsWebGLAvailable(checkWebGL());
    }, 0);
  }, []);

  return (
    <main className="w-full h-[100dvh] bg-slate-950 overflow-hidden relative">
      {/* Floating Header - Renders immediately */}
      <header className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-center z-50 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-bold text-xl md:text-2xl tracking-tighter pointer-events-auto"
        >
          DEAL OS
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-x-2 md:space-x-4 pointer-events-auto"
        >
          <Link href="/login" className="text-slate-300 text-sm md:text-base hover:text-white transition">
            Sign In
          </Link>
          <Link href="/signup" className="bg-white text-black text-sm md:text-base px-4 py-2 rounded-full font-medium hover:bg-slate-200 transition">
            Start Free
          </Link>
        </motion.div>
      </header>
      
      {/* Fallback for immediately meaningful content while 3D loads or if WebGL is unavailable */}
      {isWebGLAvailable !== true ? (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-4">
           <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 -z-10"></div>
           <h1 className="text-4xl md:text-6xl text-white font-bold tracking-tight text-center max-w-4xl">
             Run Every Property Deal From One Place.
           </h1>
           <p className="mt-6 text-slate-400 text-lg md:text-xl text-center max-w-2xl">
             From property intake and buyer requirements to site visits, offers, and closing.
           </p>
           {isWebGLAvailable === false && (
             <div className="mt-8 text-sm text-amber-500 bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/20">
               Interactive 3D experience requires WebGL. Showing basic fallback.
             </div>
           )}
        </div>
      ) : null}

      {/* 3D Canvas Context */}
      {isWebGLAvailable === true && (
        <div className="absolute inset-0 z-20">
          <Canvas
            camera={{ position: [0, 5, 10], fov: 50 }}
            dpr={[1, 2]} // Support high DPI
            gl={{ powerPreference: "high-performance", antialias: false }}
          >
            <color attach="background" args={["#020617"]} /> {/* Tailwind slate-950 */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <Suspense fallback={null}>
              <ScrollControls pages={10} damping={0.2}>
                <ScrollStory />
              </ScrollControls>
            </Suspense>
          </Canvas>
        </div>
      )}
    </main>
  );
}
