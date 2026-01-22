import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface BackgroundParticlesProps {
  count?: number;
}

export const BackgroundParticles = ({ count = 500 }: BackgroundParticlesProps) => {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { size, camera } = useThree();

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      mouseRef.current.x = (event.clientX / size.width) * 2 - 1;
      mouseRef.current.y = -(event.clientY / size.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spread particles in a large sphere
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 80;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // Slow random velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      // Varied sizes
      sizes[i] = Math.random() * 0.5 + 0.1;

      // Color gradient (cyan to purple)
      const colorMix = Math.random();
      colors[i * 3] = 0.4 + colorMix * 0.5;     // R
      colors[i * 3 + 1] = 0.3 + (1 - colorMix) * 0.4; // G
      colors[i * 3 + 2] = 0.9 + colorMix * 0.1; // B
    }

    return { positions, originalPositions, velocities, sizes, colors };
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const colors = meshRef.current.geometry.attributes.color.array as Float32Array;
    
    // Get mouse world position for interaction
    const mouseWorldX = mouseRef.current.x * 30;
    const mouseWorldY = mouseRef.current.y * 20;
    
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;
      
      // Update positions with velocities
      positions[ix] += particles.velocities[ix];
      positions[iy] += particles.velocities[iy];
      positions[iz] += particles.velocities[iz];

      // Calculate distance from mouse (in XY plane)
      const dx = positions[ix] - mouseWorldX;
      const dy = positions[iy] - mouseWorldY;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);
      
      // Repel particles from cursor
      const influenceRadius = 15;
      if (dist < influenceRadius && dist > 0.1) {
        const force = (influenceRadius - dist) / influenceRadius;
        const repelStrength = force * 0.3;
        positions[ix] += (dx / dist) * repelStrength;
        positions[iy] += (dy / dist) * repelStrength;
        
        // Make nearby particles glow brighter (cyan color boost)
        colors[ix] = Math.min(1, 0.4 + force * 0.6);
        colors[iy] = Math.min(1, 0.8 + force * 0.2);
        colors[iz] = Math.min(1, 0.9 + force * 0.1);
      } else {
        // Gradually return to original color
        const colorMix = (Math.sin(Date.now() * 0.001 + i) + 1) * 0.5;
        colors[ix] = 0.4 + colorMix * 0.2;
        colors[iy] = 0.3 + (1 - colorMix) * 0.3;
        colors[iz] = 0.85;
      }

      // Wrap around boundaries
      if (positions[ix] > 40) positions[ix] = -40;
      if (positions[ix] < -40) positions[ix] = 40;
      if (positions[iy] > 30) positions[iy] = -30;
      if (positions[iy] < -30) positions[iy] = 30;
      if (positions[iz] > 40) positions[iz] = -40;
      if (positions[iz] < -40) positions[iz] = 40;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particles.sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
