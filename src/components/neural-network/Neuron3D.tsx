import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Neuron } from '@/types/neural-network';

interface Neuron3DProps {
  neuron: Neuron;
  isActive: boolean;
  isHighlighted: boolean;
  animationProgress: number;
  isBackprop: boolean;
  layerType: string;
}

export const Neuron3D = ({
  neuron,
  isActive,
  isHighlighted,
  animationProgress,
  isBackprop,
  layerType,
}: Neuron3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animate scale and glow based on activation
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isActive ? 1 + animationProgress * 0.5 : 1;
      const currentScale = meshRef.current.scale.x;
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(currentScale, targetScale, 0.1)
      );
    }

    // Animate inner glow
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = isActive ? 0.4 + animationProgress * 0.4 : hovered ? 0.2 : 0;
      material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.1);
      
      // Pulse effect
      const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.1;
      glowRef.current.scale.setScalar(pulse);
    }

    // Animate outer glow for bloom effect
    if (outerGlowRef.current) {
      const material = outerGlowRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = isActive ? 0.2 + animationProgress * 0.3 : 0;
      material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.08);
      
      const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.15;
      outerGlowRef.current.scale.setScalar(pulse);
    }
  });

  // Color based on state
  const getColor = () => {
    if (isBackprop && isActive) {
      return new THREE.Color().setHSL(0, 0.8, 0.5 + animationProgress * 0.3); // Red for backprop
    }
    if (isActive) {
      return new THREE.Color().setHSL(0.55, 0.9, 0.5 + animationProgress * 0.3); // Cyan for forward
    }
    if (isHighlighted) {
      return new THREE.Color().setHSL(0.15, 0.9, 0.6); // Orange for highlighted
    }
    // Base colors by layer type
    switch (layerType) {
      case 'input':
        return new THREE.Color().setHSL(0.3, 0.6, 0.5);
      case 'output':
        return new THREE.Color().setHSL(0.8, 0.6, 0.5);
      case 'conv':
        return new THREE.Color().setHSL(0.6, 0.6, 0.5);
      case 'pool':
        return new THREE.Color().setHSL(0.45, 0.6, 0.5);
      default:
        return new THREE.Color().setHSL(0.55, 0.5, 0.4);
    }
  };

  const color = getColor();

  return (
    <group position={neuron.position}>
      {/* Main neuron sphere */}
      <Sphere
        ref={meshRef}
        args={[0.3, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.8 + animationProgress * 0.5 : 0.2}
          metalness={0.3}
          roughness={0.4}
          toneMapped={false}
        />
      </Sphere>
      
      {/* Inner glow effect */}
      <Sphere ref={glowRef} args={[0.45, 16, 16]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* Outer bloom glow for active neurons */}
      <Sphere ref={outerGlowRef} args={[0.7, 12, 12]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* Tooltip on hover */}
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-card/95 backdrop-blur-sm text-card-foreground p-3 rounded-lg shadow-xl border border-border min-w-[150px] pointer-events-none">
            <div className="text-xs font-semibold text-primary mb-1">
              {layerType.toUpperCase()} NEURON
            </div>
            <div className="text-xs space-y-1 text-muted-foreground">
              <div>Index: {neuron.neuronIndex}</div>
              <div>Activation: {neuron.activation.toFixed(3)}</div>
              <div>Bias: {neuron.bias.toFixed(3)}</div>
              {isBackprop && <div>Gradient: {neuron.gradient.toFixed(3)}</div>}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
