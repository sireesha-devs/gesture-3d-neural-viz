import { useState, useEffect, useCallback, useRef } from 'react';
import { Scene3D } from '@/components/Scene3D';
import { ControlPanel } from '@/components/ui-panels/ControlPanel';
import { LearningPanel } from '@/components/ui-panels/LearningPanel';
import { OnboardingOverlay } from '@/components/ui-panels/OnboardingOverlay';
import { GestureStatus } from '@/components/ui-panels/GestureStatus';
import { TrainingPanel } from '@/components/ui-panels/TrainingPanel';
import { useNeuralNetwork } from '@/hooks/useNeuralNetwork';
import { useAnimationState } from '@/hooks/useAnimationState';
import { useGestureRecognition } from '@/hooks/useGestureRecognition';
import { useTrainingSimulation } from '@/hooks/useTrainingSimulation';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import type { Annotation } from '@/types/neural-network';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [gesturesEnabled, setGesturesEnabled] = useState(false);
  const [highlightedLayer, setHighlightedLayer] = useState<number | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<[number, number, number][] | null>(null);

  const { network, networkType, switchNetwork, switchToNext, switchToPrev, updateWeights, resetWeights } = useNeuralNetwork();
  const { animationState, startForwardPropagation, startBackPropagation, stopAnimation, toggleDemoMode, togglePlayPause } = useAnimationState(network.layers.length);
  const { gestureState, isInitialized, hasPermission, error, initialize } = useGestureRecognition(gesturesEnabled);
  const { playSound } = useAudioFeedback(gesturesEnabled && isInitialized);
  
  // Track previous gesture states for audio triggers
  const prevGestureRef = useRef({ isPinching: false, isFist: false, isDrawing: false, swipeDirection: null as string | null, hasHand: false });

  const handleWeightsUpdate = useCallback((updates: Map<string, number>) => {
    updateWeights(updates);
  }, [updateWeights]);

  const { 
    trainingState, 
    startTraining, 
    stopTraining, 
    resetTraining, 
    setLearningRate, 
    setTotalEpochs 
  } = useTrainingSimulation(network.connections, handleWeightsUpdate);

  const handleResetTraining = useCallback(() => {
    resetTraining();
    resetWeights();
  }, [resetTraining, resetWeights]);

  // Audio feedback for gesture state changes
  useEffect(() => {
    if (!isInitialized) return;
    
    const prev = prevGestureRef.current;
    const hasHand = gestureState.confidence > 0;
    
    // Hand detection audio
    if (hasHand && !prev.hasHand) playSound('handDetected');
    if (!hasHand && prev.hasHand) playSound('handLost');
    
    // Gesture-specific audio
    if (gestureState.isPinching && !prev.isPinching) playSound('pinch');
    if (gestureState.isFist && !prev.isFist) playSound('fist');
    if (gestureState.isDrawing && !prev.isDrawing) playSound('draw');
    if (gestureState.swipeDirection && gestureState.swipeDirection !== prev.swipeDirection) playSound('swipe');
    
    // Update previous state
    prevGestureRef.current = {
      isPinching: gestureState.isPinching,
      isFist: gestureState.isFist,
      isDrawing: gestureState.isDrawing,
      swipeDirection: gestureState.swipeDirection,
      hasHand,
    };
  }, [gestureState, isInitialized, playSound]);

  useEffect(() => {
    if (!isInitialized) return;
    if (gestureState.isPinching && !animationState.isForwardPropagating) startForwardPropagation();
    if (gestureState.isFist && !animationState.isBackPropagating) startBackPropagation();
    if (gestureState.swipeDirection === 'left') switchToNext();
    if (gestureState.swipeDirection === 'right') switchToPrev();
  }, [gestureState.isPinching, gestureState.isFist, gestureState.swipeDirection, isInitialized, animationState.isForwardPropagating, animationState.isBackPropagating, startForwardPropagation, startBackPropagation, switchToNext, switchToPrev]);

  useEffect(() => {
    if (!isInitialized || !gestureState.handPosition) return;
    if (gestureState.isDrawing) {
      const point: [number, number, number] = [gestureState.handPosition.x, gestureState.handPosition.y, gestureState.handPosition.z];
      setCurrentDrawing(prev => prev ? [...prev, point] : [point]);
    } else if (currentDrawing && currentDrawing.length > 1) {
      setAnnotations(prev => [...prev, { id: `annotation-${Date.now()}`, points: currentDrawing, color: '#fbbf24', timestamp: Date.now() }]);
      setCurrentDrawing(null);
    }
  }, [gestureState.isDrawing, gestureState.handPosition, isInitialized, currentDrawing]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background dark">
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-card/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">Neural Network Visualizer</h1>
            <p className="text-[10px] text-muted-foreground">Gesture-Controlled 3D Learning</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">{networkType}</Badge>
          {trainingState.isTraining && (
            <Badge className="text-xs bg-green-600">
              Training: Epoch {trainingState.currentEpoch}
            </Badge>
          )}
          {animationState.isDemoMode && <Badge className="text-xs bg-primary">Demo Mode</Badge>}
        </div>
      </header>

      <main className="h-full w-full pt-14">
        <Scene3D 
          network={network} 
          animationState={animationState} 
          annotations={annotations} 
          currentDrawing={currentDrawing} 
          highlightedLayer={highlightedLayer} 
          gestureState={gestureState}
          isTraining={trainingState.isTraining}
        />
      </main>

      <ControlPanel networkType={networkType} animationState={animationState} onNetworkChange={switchNetwork} onStartForward={startForwardPropagation} onStartBackward={startBackPropagation} onStop={stopAnimation} onToggleDemoMode={toggleDemoMode} onTogglePlayPause={togglePlayPause} gestureEnabled={gesturesEnabled} onToggleGestures={() => setGesturesEnabled(prev => !prev)} />
      <LearningPanel onHighlightLayer={setHighlightedLayer} />
      <GestureStatus isEnabled={gesturesEnabled} isInitialized={isInitialized} hasPermission={hasPermission} error={error} gestureState={gestureState} onInitialize={initialize} />
      <TrainingPanel
        trainingState={trainingState}
        onStart={startTraining}
        onStop={stopTraining}
        onReset={handleResetTraining}
        onLearningRateChange={setLearningRate}
        onTotalEpochsChange={setTotalEpochs}
      />
      {showOnboarding && <OnboardingOverlay onComplete={() => setShowOnboarding(false)} />}
    </div>
  );
};

export default Index;
