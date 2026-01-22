import { useState, useCallback, useRef, useEffect } from 'react';
import type { AnimationState } from '@/types/neural-network';

export const useAnimationState = (totalLayers: number) => {
  const [state, setState] = useState<AnimationState>({
    isForwardPropagating: false,
    isBackPropagating: false,
    currentLayerIndex: 0,
    propagationProgress: 0,
    isPlaying: false,
    isDemoMode: false,
  });

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const startForwardPropagation = useCallback(() => {
    setState(prev => ({
      ...prev,
      isForwardPropagating: true,
      isBackPropagating: false,
      currentLayerIndex: 0,
      propagationProgress: 0,
      isPlaying: true,
    }));
  }, []);

  const startBackPropagation = useCallback(() => {
    setState(prev => ({
      ...prev,
      isForwardPropagating: false,
      isBackPropagating: true,
      currentLayerIndex: totalLayers - 1,
      propagationProgress: 0,
      isPlaying: true,
    }));
  }, [totalLayers]);

  const stopAnimation = useCallback(() => {
    setState(prev => ({
      ...prev,
      isForwardPropagating: false,
      isBackPropagating: false,
      isPlaying: false,
      propagationProgress: 0,
    }));
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const toggleDemoMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDemoMode: !prev.isDemoMode,
    }));
  }, []);

  const togglePlayPause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, []);

  // Animation loop
  useEffect(() => {
    if (!state.isPlaying && !state.isDemoMode) {
      return;
    }

    const animate = (time: number) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (deltaTime > 0) {
        setState(prev => {
          const speed = 0.001; // Progress per millisecond
          let newProgress = prev.propagationProgress + deltaTime * speed;
          let newLayerIndex = prev.currentLayerIndex;
          let newIsForward = prev.isForwardPropagating;
          let newIsBack = prev.isBackPropagating;

          if (newProgress >= 1) {
            newProgress = 0;

            if (prev.isForwardPropagating) {
              newLayerIndex++;
              if (newLayerIndex >= totalLayers) {
                if (prev.isDemoMode) {
                  // In demo mode, switch to backprop
                  newIsForward = false;
                  newIsBack = true;
                  newLayerIndex = totalLayers - 1;
                } else {
                  newIsForward = false;
                  newLayerIndex = totalLayers - 1;
                }
              }
            } else if (prev.isBackPropagating) {
              newLayerIndex--;
              if (newLayerIndex < 0) {
                if (prev.isDemoMode) {
                  // In demo mode, switch to forward prop
                  newIsForward = true;
                  newIsBack = false;
                  newLayerIndex = 0;
                } else {
                  newIsBack = false;
                  newLayerIndex = 0;
                }
              }
            } else if (prev.isDemoMode) {
              // Start demo with forward propagation
              newIsForward = true;
              newLayerIndex = 0;
            }
          }

          return {
            ...prev,
            propagationProgress: newProgress,
            currentLayerIndex: newLayerIndex,
            isForwardPropagating: newIsForward,
            isBackPropagating: newIsBack,
          };
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isPlaying, state.isDemoMode, totalLayers]);

  return {
    animationState: state,
    startForwardPropagation,
    startBackPropagation,
    stopAnimation,
    toggleDemoMode,
    togglePlayPause,
  };
};
