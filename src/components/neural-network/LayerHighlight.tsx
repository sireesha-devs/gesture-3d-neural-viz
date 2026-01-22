import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Layer } from '@/types/neural-network';

interface LayerHighlightProps {
  layer: Layer;
  isActive: boolean;
  isBackprop: boolean;
}

export const LayerHighlight = ({ layer, isActive, isBackprop }: LayerHighlightProps) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const opacityRef = useRef(0);

  // Calculate layer bounds
  const bounds = {
    x: layer.neurons[0]?.position[0] || 0,
    minY: Math.min(...layer.neurons.map(n => n.position[1])),
    maxY: Math.max(...layer.neurons.map(n => n.position[1])),
    z: 0,
  };

  const height = bounds.maxY - bounds.minY + 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;

  useFrame((_, delta) => {
    // Smooth opacity transition
    const targetOpacity = isActive ? 0.6 : 0;
    opacityRef.current += (targetOpacity - opacityRef.current) * delta * 5;

    if (ringRef.current) {
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = opacityRef.current * 0.3;
      
      // Subtle rotation
      ringRef.current.rotation.y += delta * 0.3;
    }

    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = opacityRef.current * 0.15;
      
      // Pulse scale
      const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.05;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const color = isBackprop ? '#ef4444' : '#22d3ee';

  if (opacityRef.current < 0.01 && !isActive) return null;

  return (
    <group position={[bounds.x, centerY, bounds.z]}>
      {/* Highlight ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[height / 2 + 1, 0.05, 8, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ambient glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[height / 2 + 1.5, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
