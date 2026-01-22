import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Connection, Neuron } from '@/types/neural-network';

interface NeuralPulseProps {
  connection: Connection;
  fromNeuron: Neuron;
  toNeuron: Neuron;
  isBackprop: boolean;
  speed?: number;
}

export const NeuralPulse = ({
  connection,
  fromNeuron,
  toNeuron,
  isBackprop,
  speed = 1,
}: NeuralPulseProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(Math.random()); // Random start position
  const glowRef = useRef<THREE.Mesh>(null);

  const { start, end, direction } = useMemo(() => {
    const s = new THREE.Vector3(...fromNeuron.position);
    const e = new THREE.Vector3(...toNeuron.position);
    const d = e.clone().sub(s).normalize();
    return { start: s, end: e, direction: d };
  }, [fromNeuron.position, toNeuron.position]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Update progress based on direction
    const moveSpeed = delta * speed * (0.5 + Math.abs(connection.weight) * 0.5);
    progressRef.current += isBackprop ? -moveSpeed : moveSpeed;

    // Wrap around
    if (progressRef.current > 1) progressRef.current = 0;
    if (progressRef.current < 0) progressRef.current = 1;

    // Calculate position
    const pos = start.clone().lerp(end, progressRef.current);
    meshRef.current.position.copy(pos);

    // Pulse scale animation
    const pulseScale = 1 + Math.sin(Date.now() * 0.008) * 0.3;
    meshRef.current.scale.setScalar(pulseScale);

    // Update glow
    if (glowRef.current) {
      glowRef.current.position.copy(pos);
      glowRef.current.scale.setScalar(pulseScale * 2);
    }
  });

  const color = isBackprop ? '#ef4444' : '#22d3ee';

  return (
    <group>
      {/* Inner bright core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
