import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Sphère principale optimisée
const AnimatedSphere: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotation lente et fluide
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Icosahedron args={[2.2, 15]} scale={1}> {/* radius 2.2, detail 15 pour un bon compromis qualité/perf */}
      <MeshDistortMaterial
        color="#00BFFF"
        attach="material"
        distort={0.35} // Réduction légère de la distorsion pour gagner en perf
        speed={1.5}    // Vitesse de distorsion ralentie
        roughness={0.1}
        metalness={0.1}
        transparent
        opacity={0.85}
      />
    </Icosahedron>
  );
};

// Anneaux orbitaux simplifiés
const OrbitalRings: React.FC = () => {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <torusGeometry args={[3.2, 0.01, 8, 64]} /> {/* Segments réduits */}
        <meshBasicMaterial color="#1A6FC4" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.8, 0.008, 8, 64]} />
        <meshBasicMaterial color="#00BFFF" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

const HeroScene: React.FC = () => {
  // Détection mobile pour simplifier davantage
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="absolute inset-0 z-0">
      {/* 
        dpr={[1, 1.5]} limite la résolution pixel pour gagner en performance 
        sans perte visible de qualité 
      */}
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#00BFFF" />
        
        <AnimatedSphere />
        
        {/* On garde les anneaux seulement sur desktop pour la perf */}
        {!isMobile && <OrbitalRings />}
      </Canvas>
    </div>
  );
};

export default HeroScene;