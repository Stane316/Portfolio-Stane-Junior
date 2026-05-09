import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// Sphère principale qui distord et tourne
const AnimatedSphere: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={2.5}>
        <icosahedronGeometry args={[1, 4]} /> {/* Haute densité pour distorsion lisse */}
        <MeshDistortMaterial
          color="#00BFFF"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
};

// Anneaux orbitaux décoratifs
const OrbitalRings: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#1A6FC4" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[4.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#00BFFF" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

// Composant principal de la scène
const HeroScene: React.FC = () => {
  // Détection mobile pour simplifier la scène
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00BFFF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#1A6FC4" />
        
        <AnimatedSphere />
        
        {!isMobile && (
          <>
            <OrbitalRings />
            <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
          </>
        )}
      </Canvas>
    </div>
  );
};

export default HeroScene;