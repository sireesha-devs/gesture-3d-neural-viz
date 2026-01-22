import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Connection, Neuron } from '@/types/neural-network';

interface Connection3DProps {
  connection: Connection;
  fromNeuron: Neuron;
  toNeuron: Neuron;
  isActive: boolean;
  animationProgress: number;
  isBackprop: boolean;
  isTraining?: boolean;
}

export const Connection3D = ({
  connection,
  fromNeuron,
  toNeuron,
  isActive,
  animationProgress,
  isBackprop,
  isTraining = false,
}: Connection3DProps) => {
  const [hovered, setHovered] = useState(false);
  const pulseRef = useRef<THREE.Mesh>(null);
  const pulseGlowRef = useRef<THREE.Mesh>(null);
  const prevWeightRef = useRef(connection.weight);
  const weightFlashRef = useRef(0);
  const pulseProgressRef = useRef(Math.random());

  // Create line points
  const points = useMemo(() => {
    return [
      new THREE.Vector3(...fromNeuron.position),
      new THREE.Vector3(...toNeuron.position),
    ];
  }, [fromNeuron.position, toNeuron.position]);

  const { start, end } = useMemo(() => ({
    start: new THREE.Vector3(...fromNeuron.position),
    end: new THREE.Vector3(...toNeuron.position),
  }), [fromNeuron.position, toNeuron.position]);

  // Animate pulse and detect weight changes
  useFrame((_, delta) => {
    // Energy pulse animation
    if (isActive || isTraining) {
      const speed = isActive ? 1.5 : 0.8;
      pulseProgressRef.current += delta * speed * (isBackprop ? -1 : 1);
      
      if (pulseProgressRef.current > 1) pulseProgressRef.current = 0;
      if (pulseProgressRef.current < 0) pulseProgressRef.current = 1;

      if (pulseRef.current) {
        const pos = start.clone().lerp(end, pulseProgressRef.current);
        pulseRef.current.position.copy(pos);
        
        // Pulse scale animation
        const scale = 1 + Math.sin(Date.now() * 0.01) * 0.3;
        pulseRef.current.scale.setScalar(scale);
      }

      if (pulseGlowRef.current) {
        const pos = start.clone().lerp(end, pulseProgressRef.current);
        pulseGlowRef.current.position.copy(pos);
        
        const scale = 1.5 + Math.sin(Date.now() * 0.008) * 0.4;
        pulseGlowRef.current.scale.setScalar(scale);
      }
    }

    // Detect weight change for flash effect
    if (connection.weight !== prevWeightRef.current) {
      weightFlashRef.current = 1;
      prevWeightRef.current = connection.weight;
    }

    // Decay flash effect
    if (weightFlashRef.current > 0) {
      weightFlashRef.current = Math.max(0, weightFlashRef.current - delta * 3);
    }
  });

  // Color based on weight and training state
  const getLineColor = () => {
    if (isTraining && weightFlashRef.current > 0) {
      return '#10b981'; // Green flash for weight update
    }
    if (isActive) {
      return isBackprop ? '#ef4444' : '#22d3ee';
    }
    if (isTraining) {
      const absWeight = Math.abs(connection.weight);
      if (connection.weight > 0) {
        return new THREE.Color().setHSL(0.1, 0.8, 0.4 + absWeight * 0.2).getStyle();
      } else {
        return new THREE.Color().setHSL(0.6, 0.8, 0.4 + absWeight * 0.2).getStyle();
      }
    }
    const normalizedWeight = (connection.weight + 1) / 2;
    return new THREE.Color().setHSL(
      normalizedWeight * 0.15 + 0.55,
      0.6,
      0.4
    ).getStyle();
  };

  const lineOpacity = isActive || isTraining ? 0.8 : Math.abs(connection.weight) * 0.3 + 0.1;
  const lineWidth = isActive ? 2.5 : isTraining ? Math.abs(connection.weight) * 2 + 1 : Math.abs(connection.weight) * 1.5 + 0.5;

  // Midpoint for hover detection
  const midpoint: [number, number, number] = [
    (fromNeuron.position[0] + toNeuron.position[0]) / 2,
    (fromNeuron.position[1] + toNeuron.position[1]) / 2,
    (fromNeuron.position[2] + toNeuron.position[2]) / 2,
  ];

  const pulseColor = isBackprop ? '#ef4444' : '#22d3ee';
  const showPulse = isActive || isTraining;

  return (
    <group>
      {/* Main connection line */}
      <Line
        points={points}
        color={getLineColor()}
        lineWidth={lineWidth}
        transparent
        opacity={lineOpacity}
      />

      {/* Glow line for active connections */}
      {isActive && (
        <Line
          points={points}
          color={pulseColor}
          lineWidth={lineWidth + 2}
          transparent
          opacity={0.3}
        />
      )}

      {/* Invisible mesh for hover detection */}
      <mesh
        position={midpoint}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Animated energy pulse */}
      {showPulse && (
        <>
          <mesh ref={pulseRef}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial
              color={isTraining ? '#10b981' : pulseColor}
              toneMapped={false}
            />
          </mesh>
          <mesh ref={pulseGlowRef}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshBasicMaterial
              color={isTraining ? '#10b981' : pulseColor}
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </>
      )}

      {/* Tooltip on hover */}
      {hovered && (
        <Html position={midpoint} distanceFactor={10}>
          <div className="bg-card/95 backdrop-blur-sm text-card-foreground p-2 rounded-lg shadow-xl border border-border min-w-[120px] pointer-events-none">
            <div className="text-xs font-semibold text-primary mb-1">CONNECTION</div>
            <div className="text-xs space-y-1 text-muted-foreground">
              <div>Weight: {connection.weight.toFixed(4)}</div>
              {isBackprop && <div>Gradient: {connection.gradient.toFixed(4)}</div>}
              {isTraining && <div className="text-green-400">Updating...</div>}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
