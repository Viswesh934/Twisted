import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function EnhancedCharacter({ isAnimating = true, currentEmotion = { emotion: 'joy', sentiment_score: 0.8 } }) {
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
  const mouthRef = useRef();
  const noseRef = useRef();
  const innerAuraRef = useRef();
  const haloRef = useRef();
  const floatingGemsRef = useRef();

  // Enhanced particle system with multiple types
  const particleCount = 80;
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ],
        speed: Math.random() * 0.015 + 0.005,
        phase: Math.random() * Math.PI * 2,
        size: Math.random() * 0.03 + 0.01,
        type: Math.random() > 0.7 ? 'star' : 'sphere'
      });
    }
    return temp;
  }, []);

  // Floating gems around the character
  const gems = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      temp.push({
        position: [Math.cos(angle) * 3, Math.sin(i) * 0.5, Math.sin(angle) * 3],
        baseAngle: angle,
        floatPhase: Math.random() * Math.PI * 2
      });
    }
    return temp;
  }, []);

  // Enhanced emotion parameters with more sophisticated colors
  const getEmotionParams = (emotion) => {
    const params = {
      neutral: {
        eyebrowHeight: 0,
        eyebrowAngle: 0,
        eyeScale: 1,
        mouthCurve: 0,
        headTilt: 0,
        bodyColor: "#FF8A95",
        bodyGradient: "#FFB3BA",
        auraColor: "#7DD3FC",
        auraIntensity: 0.15,
        glowIntensity: 0.3
      },
      joy: {
        eyebrowHeight: 0.15,
        eyebrowAngle: -0.25,
        eyeScale: 0.85,
        mouthCurve: 0.4,
        headTilt: 0.12,
        bodyColor: "#FFD700",
        bodyGradient: "#FFF4A3",
        auraColor: "#FBBF24",
        auraIntensity: 0.4,
        glowIntensity: 0.6
      },
      anger: {
        eyebrowHeight: -0.15,
        eyebrowAngle: 0.5,
        eyeScale: 1.25,
        mouthCurve: -0.25,
        headTilt: -0.08,
        bodyColor: "#EF4444",
        bodyGradient: "#FCA5A5",
        auraColor: "#DC2626",
        auraIntensity: 0.5,
        glowIntensity: 0.7
      },
      sadness: {
        eyebrowHeight: -0.08,
        eyebrowAngle: -0.4,
        eyeScale: 1.15,
        mouthCurve: -0.5,
        headTilt: -0.25,
        bodyColor: "#60A5FA",
        bodyGradient: "#BFDBFE",
        auraColor: "#3B82F6",
        auraIntensity: 0.25,
        glowIntensity: 0.4
      },
      surprise: {
        eyebrowHeight: 0.4,
        eyebrowAngle: 0,
        eyeScale: 1.6,
        mouthCurve: 0.15,
        headTilt: 0.08,
        bodyColor: "#FB923C",
        bodyGradient: "#FED7AA",
        auraColor: "#F97316",
        auraIntensity: 0.35,
        glowIntensity: 0.5
      },
      fear: {
        eyebrowHeight: 0.25,
        eyebrowAngle: 0.3,
        eyeScale: 1.5,
        mouthCurve: -0.15,
        headTilt: -0.15,
        bodyColor: "#C084FC",
        bodyGradient: "#E9D5FF",
        auraColor: "#A855F7",
        auraIntensity: 0.2,
        glowIntensity: 0.35
      },
      disgust: {
        eyebrowHeight: -0.12,
        eyebrowAngle: 0.4,
        eyeScale: 0.95,
        mouthCurve: -0.4,
        headTilt: 0.15,
        bodyColor: "#84CC16",
        bodyGradient: "#BEF264",
        auraColor: "#65A30D",
        auraIntensity: 0.25,
        glowIntensity: 0.4
      }
    };

    return params[emotion] || params.neutral;
  };

  const emotionParams = getEmotionParams(currentEmotion.emotion);
  const emotionIntensity = Math.min(1, Math.abs(currentEmotion.sentiment_score));

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Smoother jaw animation with natural speech patterns
    if (isAnimating && jawRef.current) {
      const jawTime = time * 10;
      const primaryJaw = Math.sin(jawTime) * 0.35;
      const secondaryJaw = Math.sin(jawTime * 1.3) * 0.15;
      const tertiaryJaw = Math.sin(jawTime * 2.1) * 0.08;
      const jawMovement = primaryJaw + secondaryJaw + tertiaryJaw;
      
      jawRef.current.rotation.x = Math.max(0, jawMovement * 0.25);
      jawRef.current.position.y = -0.3 + Math.abs(jawMovement) * 0.08;
    } else if (jawRef.current) {
      jawRef.current.rotation.x = THREE.MathUtils.lerp(jawRef.current.rotation.x, 0, 0.12);
      jawRef.current.position.y = THREE.MathUtils.lerp(jawRef.current.position.y, -0.3, 0.08);
    }

    // Enhanced head movement with emotion-based personality
    if (headRef.current) {
      const baseRotationY = Math.sin(time * 0.6) * 0.15 + Math.sin(time * 1.1) * 0.08;
      const baseRotationX = Math.sin(time * 0.4) * 0.08 + Math.cos(time * 0.7) * 0.05;
      const baseRotationZ = Math.sin(time * 0.25) * 0.04;
      const breathingY = Math.sin(time * 1.8) * 0.03;

      headRef.current.rotation.y = baseRotationY * (1 + emotionIntensity * 0.3);
      headRef.current.rotation.x = baseRotationX;
      headRef.current.rotation.z = baseRotationZ + (emotionParams.headTilt * emotionIntensity);
      headRef.current.position.y = breathingY;
    }

    // Enhanced eye animation with natural blinking
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkCycle = Math.sin(time * 0.3);
      const randomBlink = Math.random() < 0.015;
      const microBlink = Math.sin(time * 8) * 0.02;
      const targetScale = (emotionParams.eyeScale * emotionIntensity + (1 - emotionIntensity)) + microBlink;

      if (blinkCycle > 0.95 || randomBlink) {
        leftEyeRef.current.scale.y = 0.05;
        rightEyeRef.current.scale.y = 0.05;
      } else {
        leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, targetScale, 0.15);
        rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, targetScale, 0.15);
      }
      
      leftEyeRef.current.scale.x = leftEyeRef.current.scale.z = targetScale;
      rightEyeRef.current.scale.x = rightEyeRef.current.scale.z = targetScale;
    }

    // Sophisticated pupil tracking with emotion-based behavior
    if (leftPupilRef.current && rightPupilRef.current) {
      const lookX = Math.sin(time * 0.7) * 0.04 + Math.sin(time * 1.3) * 0.02;
      const lookY = Math.cos(time * 0.5) * 0.025 + Math.cos(time * 0.9) * 0.015;
      
      const emotionMultiplier = currentEmotion.emotion === 'fear' ? 1.8 : 
                               currentEmotion.emotion === 'surprise' ? 1.4 : 1;

      leftPupilRef.current.position.x = lookX * emotionMultiplier;
      leftPupilRef.current.position.y = lookY * emotionMultiplier;
      rightPupilRef.current.position.x = lookX * emotionMultiplier;
      rightPupilRef.current.position.y = lookY * emotionMultiplier;
    }

    // Dynamic eyebrow animation
    if (leftEyebrowRef.current && rightEyebrowRef.current) {
      const baseMovement = isAnimating ? Math.sin(time * 2.5) * 0.03 : 0;
      const emotionBrowHeight = emotionParams.eyebrowHeight * emotionIntensity;
      const emotionBrowAngle = emotionParams.eyebrowAngle * emotionIntensity;

      leftEyebrowRef.current.rotation.z = baseMovement + emotionBrowAngle;
      rightEyebrowRef.current.rotation.z = -baseMovement - emotionBrowAngle;
      leftEyebrowRef.current.position.y = 0.65 + baseMovement * 0.08 + emotionBrowHeight;
      rightEyebrowRef.current.position.y = 0.65 + baseMovement * 0.08 + emotionBrowHeight;
    }

    // Enhanced mouth animation
    if (mouthRef.current) {
      const targetScaleY = 1 + (emotionParams.mouthCurve * emotionIntensity * 0.6);
      const breathingScale = 1 + Math.sin(time * 1.5) * 0.02;
      
      mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, targetScaleY, 0.08);
      mouthRef.current.scale.x = breathingScale;

      if (emotionParams.mouthCurve > 0) {
        mouthRef.current.position.y = THREE.MathUtils.lerp(mouthRef.current.position.y, 0.08, 0.08);
      } else if (emotionParams.mouthCurve < 0) {
        mouthRef.current.position.y = THREE.MathUtils.lerp(mouthRef.current.position.y, -0.08, 0.08);
      } else {
        mouthRef.current.position.y = THREE.MathUtils.lerp(mouthRef.current.position.y, 0, 0.08);
      }
    }

    // Enhanced body animation with breathing
    if (bodyRef.current) {
      const breathing = Math.sin(time * 1.2) * 0.02;
      const sway = Math.sin(time * 0.8) * 0.02;
      
      bodyRef.current.rotation.z = sway;
      bodyRef.current.position.y = -2 + breathing;
      bodyRef.current.scale.y = 1 + breathing * 0.5;

      const targetColor = new THREE.Color(emotionParams.bodyColor);
      if (bodyRef.current.material.color) {
        bodyRef.current.material.color.lerp(targetColor, 0.03);
      }
    }

    // Sophisticated arm animation
    if (leftArmRef.current && rightArmRef.current) {
      if (isAnimating) {
        const intensity = 1 + emotionIntensity * 0.4;
        const armTime = time * 2.2;
        
        leftArmRef.current.rotation.z = Math.sin(armTime) * 0.25 * intensity + 0.4;
        rightArmRef.current.rotation.z = -Math.sin(armTime + 0.5) * 0.25 * intensity - 0.4;
        leftArmRef.current.rotation.x = Math.sin(armTime * 0.8) * 0.15 * intensity;
        rightArmRef.current.rotation.x = Math.sin(armTime * 0.8 + 1) * 0.15 * intensity;
        
        // Add shoulder movement
        leftArmRef.current.position.y = -1.5 + Math.sin(armTime * 1.5) * 0.05;
        rightArmRef.current.position.y = -1.5 + Math.sin(armTime * 1.5 + 0.3) * 0.05;
      } else {
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.15, 0.04);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.15, 0.04);
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.04);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.04);
      }
    }

    // Enhanced magical particles
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        const p = particles[i];
        const speedMultiplier = 1 + emotionIntensity * 0.5;
        
        particle.position.y += p.speed * speedMultiplier;
        particle.position.x += Math.sin(time * 2 + p.phase) * 0.008;
        particle.position.z += Math.cos(time * 2 + p.phase) * 0.008;

        if (particle.position.y > 5) {
          particle.position.y = -5;
          particle.position.x = (Math.random() - 0.5) * 8;
          particle.position.z = (Math.random() - 0.5) * 8;
        }

        const opacity = (Math.sin(time * 3 + p.phase) * 0.3 + 0.7) * (0.6 + emotionIntensity * 0.4);
        particle.material.opacity = opacity;

        const emotionColor = new THREE.Color(emotionParams.auraColor);
        particle.material.color.lerp(emotionColor, 0.05);
        
        // Pulsing size effect
        const sizeMultiplier = 1 + Math.sin(time * 4 + p.phase) * 0.3;
        particle.scale.setScalar(sizeMultiplier);
      });
    }

    // Enhanced aura effects
    if (auraRef.current) {
      auraRef.current.rotation.y = time * 0.3;
      auraRef.current.rotation.x = Math.sin(time * 0.7) * 0.1;
      const auraScale = 1 + Math.sin(time * 2) * 0.08 + emotionIntensity * 0.15;
      auraRef.current.scale.setScalar(auraScale);

      const targetColor = new THREE.Color(emotionParams.auraColor);
      if (auraRef.current.material.color) {
        auraRef.current.material.color.lerp(targetColor, 0.03);
        auraRef.current.material.opacity = emotionParams.auraIntensity * (1 + emotionIntensity * 0.3);
      }
    }

    // Inner aura
    if (innerAuraRef.current) {
      innerAuraRef.current.rotation.y = -time * 0.5;
      innerAuraRef.current.rotation.z = time * 0.2;
      const innerScale = 0.8 + Math.sin(time * 2.5) * 0.1 + emotionIntensity * 0.1;
      innerAuraRef.current.scale.setScalar(innerScale);
    }

    // Floating halo
    if (haloRef.current) {
      haloRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      haloRef.current.rotation.z = time * 0.8;
      haloRef.current.position.y = 1.8 + Math.sin(time * 1.5) * 0.1;
      
      const haloIntensity = emotionParams.glowIntensity * (0.7 + emotionIntensity * 0.3);
      haloRef.current.material.opacity = haloIntensity;
    }

    // Floating gems
    if (floatingGemsRef.current) {
      floatingGemsRef.current.children.forEach((gem, i) => {
        const g = gems[i];
        const radius = 3.2 + Math.sin(time * 0.8 + g.floatPhase) * 0.4;
        const height = Math.sin(time * 1.2 + g.floatPhase) * 0.8;
        const angle = g.baseAngle + time * 0.3;
        
        gem.position.x = Math.cos(angle) * radius;
        gem.position.z = Math.sin(angle) * radius;
        gem.position.y = height;
        
        gem.rotation.x = time * 1.5 + i;
        gem.rotation.y = time * 2 + i * 0.5;
        gem.rotation.z = time * 0.8 + i * 0.3;
        
        const glowScale = 1 + Math.sin(time * 3 + i) * 0.2;
        gem.scale.setScalar(glowScale * 0.15);
      });
    }
  });

  return (
    <group>
      {/* Outer magical aura */}
      <mesh ref={auraRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial
          color={emotionParams.auraColor}
          transparent
          opacity={emotionParams.auraIntensity}
          wireframe
        />
      </mesh>

      {/* Inner glowing aura */}
      <mesh ref={innerAuraRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.2, 16, 16]} />
        <meshBasicMaterial
          color={emotionParams.auraColor}
          transparent
          opacity={emotionParams.auraIntensity * 0.3}
          wireframe
        />
      </mesh>


      {/* Floating gems */}
      <group ref={floatingGemsRef}>
        {gems.map((_, i) => (
          <mesh key={i}>
            <octahedronGeometry args={[0.15, 2]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#FF69B4" : "#00CED1"}
              metalness={0.8}
              roughness={0.1}
              emissive={i % 2 === 0 ? "#FF1493" : "#008B8B"}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Enhanced particle system */}
      <group ref={particlesRef}>
        {particles.map((p, i) => (
          <mesh key={i} position={p.position}>
            {p.type === 'star' ? (
              <octahedronGeometry args={[p.size, 1]} />
            ) : (
              <sphereGeometry args={[p.size, 8, 8]} />
            )}
            <meshBasicMaterial
              color={emotionParams.auraColor}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Enhanced body with gradient effect */}
      <mesh ref={bodyRef} position={[0, -2, 0]}>
        <cylinderGeometry args={[0.85, 1.25, 2.2, 32]} />
        <meshStandardMaterial
          color={emotionParams.bodyColor}
          roughness={0.2}
          metalness={0.3}
          emissive={emotionParams.bodyColor}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Enhanced arms with better proportions */}
      <mesh ref={leftArmRef} position={[-1.6, -1.5, 0]}>
        <cylinderGeometry args={[0.18, 0.28, 1.6, 16]} />
        <meshStandardMaterial
          color="#FFED4A"
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
      <mesh ref={rightArmRef} position={[1.6, -1.5, 0]}>
        <cylinderGeometry args={[0.18, 0.28, 1.6, 16]} />
        <meshStandardMaterial
          color="#FFED4A"
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Premium head with subtle details */}
      <group ref={headRef} position={[0, 0, 0]}>
        <mesh>
          <sphereGeometry args={[1.25, 64, 64]} />
          <meshStandardMaterial
            color="#FFF8DC"
            roughness={0.15}
            metalness={0.4}
            emissive="#FFF8DC"
            emissiveIntensity={0.05}
          />
        </mesh>

        {/* Subtle face glow */}
        <mesh position={[0, 0.15, 1.15]}>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshBasicMaterial
            color="#FFFACD"
            transparent
            opacity={0.2}
          />
        </mesh>
      </group>

      {/* Beautiful enhanced eyes */}
      <group ref={leftEyeRef} position={[-0.42, 0.32, 1.05]}>
        <mesh>
          <sphereGeometry args={[0.19, 20, 20]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0, 0, 0.16]}>
          <sphereGeometry args={[0.13, 20, 20]} />
          <meshStandardMaterial
            color="#6BB6FF"
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
        <mesh ref={leftPupilRef} position={[0, 0, 0.17]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.035, 0.035, 0.18]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.02, -0.02, 0.175]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#E6F3FF" />
        </mesh>
      </group>

      <group ref={rightEyeRef} position={[0.42, 0.32, 1.05]}>
        <mesh>
          <sphereGeometry args={[0.19, 20, 20]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0, 0, 0.16]}>
          <sphereGeometry args={[0.13, 20, 20]} />
          <meshStandardMaterial
            color="#6BB6FF"
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
        <mesh ref={rightPupilRef} position={[0, 0, 0.17]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.035, 0.035, 0.18]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.02, -0.02, 0.175]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#E6F3FF" />
        </mesh>
      </group>

      {/* Refined eyebrows */}
      <mesh ref={leftEyebrowRef} position={[-0.42, 0.65, 1.15]}>
        <boxGeometry args={[0.35, 0.06, 0.08]} />
        <meshStandardMaterial
          color="#D2691E"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      <mesh ref={rightEyebrowRef} position={[0.42, 0.65, 1.15]}>
        <boxGeometry args={[0.35, 0.06, 0.08]} />
        <meshStandardMaterial
          color="#D2691E"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Enhanced mouth */}
      <mesh ref={mouthRef} position={[0, -0.28, 1.15]}>
        <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
        <meshStandardMaterial
          color="#FF69B4"
          roughness={0.3}
          metalness={0.2}
          emissive="#FF1493"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Refined nose */}
      <mesh ref={noseRef} position={[0, 0.08, 1.22]}>
        <coneGeometry args={[0.08, 0.28, 16]} />
        <meshStandardMaterial
          color="#FFF8DC"
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Jaw component */}
      <group ref={jawRef} position={[0, -0.3, 0]}>
        <mesh position={[0, 0, 1.1]}>
          <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial
            color="#FFF8DC"
            roughness={0.15}
            metalness={0.4}
          />
        </mesh>
      </group>

 
    </group>
  );
}