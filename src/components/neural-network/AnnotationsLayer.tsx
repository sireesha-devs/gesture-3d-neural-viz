import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Annotation } from '@/types/neural-network';

interface Annotation3DProps {
  annotation: Annotation;
}

export const Annotation3D = ({ annotation }: Annotation3DProps) => {
  const lineRef = useRef<THREE.Line>(null);

  const points = useMemo(() => {
    return annotation.points.map((p) => new THREE.Vector3(...p));
  }, [annotation.points]);

  if (points.length < 2) return null;

  return (
    <Line
      points={points}
      color={annotation.color}
      lineWidth={3}
      transparent
      opacity={0.8}
    />
  );
};

interface AnnotationsLayerProps {
  annotations: Annotation[];
  currentDrawing: [number, number, number][] | null;
}

export const AnnotationsLayer = ({ annotations, currentDrawing }: AnnotationsLayerProps) => {
  const currentPoints = useMemo(() => {
    if (!currentDrawing || currentDrawing.length < 2) return null;
    return currentDrawing.map((p) => new THREE.Vector3(...p));
  }, [currentDrawing]);

  return (
    <group>
      {annotations.map((annotation) => (
        <Annotation3D key={annotation.id} annotation={annotation} />
      ))}
      
      {currentPoints && (
        <Line
          points={currentPoints}
          color="#fbbf24"
          lineWidth={3}
          transparent
          opacity={0.9}
        />
      )}
    </group>
  );
};
