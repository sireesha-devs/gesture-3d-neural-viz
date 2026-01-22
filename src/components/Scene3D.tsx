import { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Html } from '@react-three/drei';
import { NetworkVisualizer } from './neural-network/NetworkVisualizer';
import { AnnotationsLayer } from './neural-network/AnnotationsLayer';
import { BackgroundParticles } from './neural-network/BackgroundParticles';
import { PostProcessingEffects } from './neural-network/PostProcessingEffects';
import type { NeuralNetwork, AnimationState, Annotation, GestureState } from '@/types/neural-network';
import { Loader2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Scene3DProps {
  network: NeuralNetwork;
  animationState: AnimationState;
  annotations: Annotation[];
  currentDrawing: [number, number, number][] | null;
  highlightedLayer: number | null;
  gestureState: GestureState;
  isTraining?: boolean;
}

// Component to handle camera animation based on network type
const CameraController = ({ 
  networkType, 
  zoomLevel, 
  shouldCenter 
}: { 
  networkType: string; 
  zoomLevel: number;
  shouldCenter: boolean;
}) => {
  const { camera } = useThree();
  const targetPositionRef = useRef({ x: 0, y: 0, z: 18 });
  const initializedRef = useRef(false);

  useEffect(() => {
    // Center camera position based on network type
    switch (networkType) {
      case 'CNN':
        targetPositionRef.current = { x: 0, y: 0, z: 22 };
        break;
      case 'RCNN':
        targetPositionRef.current = { x: 0, y: 0, z: 25 };
        break;
      default:
        targetPositionRef.current = { x: 0, y: 0, z: 18 };
    }
    initializedRef.current = false;
  }, [networkType]);

  useEffect(() => {
    if (shouldCenter) {
      initializedRef.current = false;
    }
  }, [shouldCenter]);

  useFrame(() => {
    const baseZ = targetPositionRef.current.z;
    const targetZ = baseZ * (1 / zoomLevel);
    
    // Smooth interpolation
    camera.position.x += (targetPositionRef.current.x - camera.position.x) * 0.05;
    camera.position.y += (targetPositionRef.current.y - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    
    // Look at center
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// Hand cursor visualization
const HandCursor = ({ gestureState }: { gestureState: GestureState }) => {
  if (!gestureState.handPosition) return null;

  return (
    <mesh position={[gestureState.handPosition.x, gestureState.handPosition.y, gestureState.handPosition.z]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshBasicMaterial
        color={gestureState.isDrawing ? '#fbbf24' : gestureState.isPinching ? '#22d3ee' : '#94a3b8'}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

const Loading = () => (
  <Html center>
    <div className="flex items-center gap-2 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">Loading visualization...</span>
    </div>
  </Html>
);

export const Scene3D = ({
  network,
  animationState,
  annotations,
  currentDrawing,
  highlightedLayer,
  gestureState,
  isTraining = false,
}: Scene3DProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [shouldCenter, setShouldCenter] = useState(false);
  const isAnimating = animationState.isForwardPropagating || animationState.isBackPropagating || isTraining;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  const handleCenter = () => {
    setZoomLevel(1);
    setShouldCenter(prev => !prev);
  };

  return (
    <div className="w-full h-full relative">
      {/* Zoom Controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-card/80 backdrop-blur-sm rounded-lg p-1.5 border border-border shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleCenter}
          title="Center View"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={<Loading />}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={50} />
          <CameraController 
            networkType={network.type} 
            zoomLevel={zoomLevel}
            shouldCenter={shouldCenter}
          />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={8}
            maxDistance={50}
            maxPolarAngle={Math.PI / 1.5}
            enablePan={true}
            target={[0, 0, 0]}
          />

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.4} color="#0ea5e9" />
          <pointLight position={[0, 10, -10]} intensity={0.3} color="#8b5cf6" />
          <spotLight
            position={[0, 15, 0]}
            angle={0.4}
            penumbra={1}
            intensity={0.5}
            castShadow
          />

          {/* Background */}
          <color attach="background" args={['#080612']} />
          <Stars
            radius={100}
            depth={50}
            count={2000}
            factor={4}
            saturation={0}
            fade
            speed={0.3}
          />
          
          {/* Floating particles with cursor interaction */}
          <BackgroundParticles count={500} />

          {/* Grid floor - positioned lower */}
          <gridHelper args={[50, 50, '#1e1b4b', '#0f0d24']} position={[0, -10, 0]} />

          {/* Neural Network - centered at origin */}
          <group position={[0, 0, 0]}>
            <NetworkVisualizer
              network={network}
              animationState={animationState}
              highlightedLayer={highlightedLayer}
              isTraining={isTraining}
            />
          </group>

          {/* Annotations */}
          <AnnotationsLayer
            annotations={annotations}
            currentDrawing={currentDrawing}
          />

          {/* Hand cursor */}
          <HandCursor gestureState={gestureState} />

          {/* Post-processing effects */}
          <PostProcessingEffects bloomIntensity={isAnimating ? 1.2 : 0.6} />
        </Suspense>
      </Canvas>
    </div>
  );
};
