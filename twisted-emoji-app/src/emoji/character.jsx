import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function EnhancedCharacter({ isAnimating }) {
  const headRef = useRef();
  const jawRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const leftPupilRef = useRef();
  const rightPupilRef = useRef();
  const leftEyebrowRef = useRef();
  const rightEyebrowRef = useRef();
  const bodyRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const particlesRef = useRef();
  const auraRef = useRef();
  
  // Create particle system for magical effects
  const particleCount = 50;
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        ],
        speed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Enhanced jaw animation with realistic mouth shapes
    if (isAnimating && jawRef.current) {
      const jawTime = time * 12;
      const jawMovement = Math.sin(jawTime) * 0.4 + Math.sin(jawTime * 1.7) * 0.2;
      jawRef.current.rotation.x = Math.max(0, jawMovement * 0.3);
      jawRef.current.position.y = -0.3 + jawMovement * 0.1;
    } else if (jawRef.current) {
      jawRef.current.rotation.x = THREE.MathUtils.lerp(jawRef.current.rotation.x, 0, 0.15);
      jawRef.current.position.y = THREE.MathUtils.lerp(jawRef.current.position.y, -0.3, 0.1);
    }
    
    // Dynamic head movement with personality
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.7) * 0.2 + Math.sin(time * 1.3) * 0.1;
      headRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      headRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
      headRef.current.position.y = Math.sin(time * 2) * 0.05;
    }
    
    // Sophisticated eye tracking and blinking
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkPhase = Math.sin(time * 0.4);
      const randomBlink = Math.random() < 0.02;
      
      if (blinkPhase > 0.98 || randomBlink) {
        leftEyeRef.current.scale.y = 0.1;
        rightEyeRef.current.scale.y = 0.1;
      } else {
        leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, 1, 0.3);
        rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, 1, 0.3);
      }
    }
    
    // Pupil tracking with smooth movement
    if (leftPupilRef.current && rightPupilRef.current) {
      const lookX = Math.sin(time * 0.8) * 0.05;
      const lookY = Math.cos(time * 0.6) * 0.03;
      leftPupilRef.current.position.x = lookX;
      leftPupilRef.current.position.y = lookY;
      rightPupilRef.current.position.x = lookX;
      rightPupilRef.current.position.y = lookY;
    }
    
    // Expressive eyebrows
    if (leftEyebrowRef.current && rightEyebrowRef.current) {
      const eyebrowMovement = isAnimating ? Math.sin(time * 3) * 0.1 : 0;
      leftEyebrowRef.current.rotation.z = eyebrowMovement;
      rightEyebrowRef.current.rotation.z = -eyebrowMovement;
      leftEyebrowRef.current.position.y = 0.6 + eyebrowMovement * 0.1;
      rightEyebrowRef.current.position.y = 0.6 + eyebrowMovement * 0.1;
    }
    
    // Body animation
    if (bodyRef.current) {
      bodyRef.current.rotation.z = Math.sin(time * 1.2) * 0.03;
      bodyRef.current.position.y = -2 + Math.sin(time * 2.5) * 0.05;
    }
    
    // Arm gesticulation
    if (leftArmRef.current && rightArmRef.current) {
      if (isAnimating) {
        leftArmRef.current.rotation.z = Math.sin(time * 2.5) * 0.3 + 0.5;
        rightArmRef.current.rotation.z = -Math.sin(time * 2.8) * 0.3 - 0.5;
        leftArmRef.current.rotation.x = Math.sin(time * 1.8) * 0.2;
        rightArmRef.current.rotation.x = Math.sin(time * 2.1) * 0.2;
      } else {
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.2, 0.05);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, 0.05);
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.05);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.05);
      }
    }
    
    // Magical particle animation
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        const p = particles[i];
        particle.position.y += p.speed;
        particle.position.x += Math.sin(time + p.phase) * 0.01;
        particle.position.z += Math.cos(time + p.phase) * 0.01;
        
        if (particle.position.y > 4) {
          particle.position.y = -4;
          particle.position.x = (Math.random() - 0.5) * 6;
          particle.position.z = (Math.random() - 0.5) * 6;
        }
        
        const opacity = Math.sin(time * 2 + p.phase) * 0.5 + 0.5;
        particle.material.opacity = opacity * 0.7;
      });
    }
    
    // Glowing aura effect
    if (auraRef.current) {
      auraRef.current.rotation.y = time * 0.5;
      auraRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
    }
  });

  return (
    <group>
      {/* Magical Aura */}
      <mesh ref={auraRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial 
          color="#4A90E2" 
          transparent 
          opacity={0.1} 
          wireframe
        />
      </mesh>
      
      {/* Particle System */}
      <group ref={particlesRef}>
        {particles.map((_, i) => (
          <mesh key={i} position={particles[i].position}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial 
              color={`hsl(${(i * 360 / particleCount)}, 70%, 70%)`} 
              transparent
            />
          </mesh>
        ))}
      </group>
      
      {/* Body */}
      <mesh ref={bodyRef} position={[0, -2, 0]}>
        <cylinderGeometry args={[0.8, 1.2, 2, 16]} />
        <meshStandardMaterial 
          color="#FF6B6B" 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Arms */}
      <mesh ref={leftArmRef} position={[-1.5, -1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 1.5, 12]} />
        <meshStandardMaterial color="#FFD93D" />
      </mesh>
      <mesh ref={rightArmRef} position={[1.5, -1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 1.5, 12]} />
        <meshStandardMaterial color="#FFD93D" />
      </mesh>
      
      {/* Enhanced Head with gradient-like effect */}
      <group ref={headRef} position={[0, 0, 0]}>
        <mesh>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshStandardMaterial 
            color="#FFD700" 
            roughness={0.2} 
            metalness={0.3}
            envMapIntensity={0.8}
          />
        </mesh>
        
        {/* Face highlight */}
        <mesh position={[0, 0.2, 1.1]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial 
            color="#FFED4E" 
            transparent 
            opacity={0.3}
          />
        </mesh>
      </group>
      
      {/* Enhanced Eyes with iris and pupils */}
      <group ref={leftEyeRef} position={[-0.4, 0.3, 1]}>
        {/* Eye white */}
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Iris */}
        <mesh position={[0, 0, 0.15]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#4A90E2" />
        </mesh>
        {/* Pupil */}
        <mesh ref={leftPupilRef} position={[0, 0, 0.16]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Eye shine */}
        <mesh position={[0.03, 0.03, 0.17]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
      
      <group ref={rightEyeRef} position={[0.4, 0.3, 1]}>
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#4A90E2" />
        </mesh>
        <mesh ref={rightPupilRef} position={[0, 0, 0.16]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.03, 0.03, 0.17]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
      
      {/* Eyebrows */}
      <mesh ref={leftEyebrowRef} position={[-0.4, 0.6, 1.1]}>
        <boxGeometry args={[0.3, 0.05, 0.05]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh ref={rightEyebrowRef} position={[0.4, 0.6, 1.1]}>
        <boxGeometry args={[0.3, 0.05, 0.05]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Enhanced Nose */}
      <mesh position={[0, 0, 1.15]}>
        <coneGeometry args={[0.12, 0.25, 8]} />
        <meshStandardMaterial color="#FFB347" roughness={0.4} />
      </mesh>
      
      {/* Enhanced Jaw with better geometry */}
      <group ref={jawRef} position={[0, -0.3, 0]}>
        <mesh position={[0, -0.2, 0.8]}>
          <sphereGeometry args={[0.85, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color="#FFD700" 
            roughness={0.2} 
            metalness={0.3}
          />
        </mesh>
        
        {/* Enhanced Mouth */}
        <mesh position={[0, 0, 1]}>
          <sphereGeometry args={[0.35, 16, 8]} />
          <meshStandardMaterial color="#8B0000" />
        </mesh>
        
        {/* Individual Teeth */}
        {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
          <mesh key={i} position={[x, 0.12, 0.9]}>
            <boxGeometry args={[0.06, 0.08, 0.08]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        ))}
        
        {/* Tongue */}
        <mesh position={[0, -0.1, 0.95]}>
          <sphereGeometry args={[0.2, 16, 8]} />
          <meshStandardMaterial color="#FF69B4" />
        </mesh>
      </group>
    </group>
  );
}

export default EnhancedCharacter;