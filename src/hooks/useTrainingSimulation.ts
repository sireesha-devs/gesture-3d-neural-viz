import { useState, useCallback, useRef, useEffect } from 'react';
import type { Connection } from '@/types/neural-network';

export interface TrainingState {
  isTraining: boolean;
  currentEpoch: number;
  totalEpochs: number;
  currentLoss: number;
  currentAccuracy: number;
  lossHistory: { epoch: number; loss: number; accuracy: number }[];
  learningRate: number;
  batchProgress: number;
}

const initialState: TrainingState = {
  isTraining: false,
  currentEpoch: 0,
  totalEpochs: 50,
  currentLoss: 2.5,
  currentAccuracy: 0.1,
  lossHistory: [],
  learningRate: 0.01,
  batchProgress: 0,
};

export const useTrainingSimulation = (
  connections: Connection[],
  onWeightsUpdate: (updates: Map<string, number>) => void
) => {
  const [state, setState] = useState<TrainingState>(initialState);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const epochStartLossRef = useRef<number>(2.5);

  const startTraining = useCallback(() => {
    epochStartLossRef.current = 2.5;
    setState({
      ...initialState,
      isTraining: true,
      currentLoss: 2.5,
      currentAccuracy: 0.1,
      lossHistory: [{ epoch: 0, loss: 2.5, accuracy: 0.1 }],
    });
  }, []);

  const stopTraining = useCallback(() => {
    setState(prev => ({
      ...prev,
      isTraining: false,
    }));
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const resetTraining = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setState(initialState);
    epochStartLossRef.current = 2.5;
  }, []);

  const setLearningRate = useCallback((rate: number) => {
    setState(prev => ({ ...prev, learningRate: rate }));
  }, []);

  const setTotalEpochs = useCallback((epochs: number) => {
    setState(prev => ({ ...prev, totalEpochs: epochs }));
  }, []);

  // Training simulation loop
  useEffect(() => {
    if (!state.isTraining || state.currentEpoch >= state.totalEpochs) {
      if (state.currentEpoch >= state.totalEpochs && state.isTraining) {
        setState(prev => ({ ...prev, isTraining: false }));
      }
      return;
    }

    const simulate = (time: number) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (deltaTime > 0) {
        setState(prev => {
          const batchSpeed = 0.002 * (1 + prev.learningRate * 10);
          let newBatchProgress = prev.batchProgress + deltaTime * batchSpeed;
          let newEpoch = prev.currentEpoch;
          let newLoss = prev.currentLoss;
          let newAccuracy = prev.currentAccuracy;
          let newHistory = prev.lossHistory;

          if (newBatchProgress >= 1) {
            newBatchProgress = 0;
            newEpoch++;

            // Calculate new loss with realistic decay curve
            const decayRate = 0.08 + prev.learningRate * 2;
            const noise = (Math.random() - 0.5) * 0.1;
            const baseLoss = epochStartLossRef.current * Math.exp(-decayRate * newEpoch);
            newLoss = Math.max(0.05, baseLoss + noise);

            // Calculate accuracy (inverse relationship to loss with some noise)
            const baseAccuracy = 1 - Math.exp(-decayRate * newEpoch * 0.8);
            const accuracyNoise = (Math.random() - 0.5) * 0.05;
            newAccuracy = Math.min(0.98, Math.max(0.1, baseAccuracy + accuracyNoise));

            // Add to history
            newHistory = [...prev.lossHistory, { epoch: newEpoch, loss: newLoss, accuracy: newAccuracy }];

            // Simulate weight updates
            const weightUpdates = new Map<string, number>();
            connections.forEach(conn => {
              const gradient = (Math.random() - 0.5) * prev.learningRate * 0.5;
              const newWeight = Math.max(-1, Math.min(1, conn.weight + gradient));
              weightUpdates.set(conn.id, newWeight);
            });
            onWeightsUpdate(weightUpdates);
          }

          return {
            ...prev,
            batchProgress: newBatchProgress,
            currentEpoch: newEpoch,
            currentLoss: newLoss,
            currentAccuracy: newAccuracy,
            lossHistory: newHistory,
          };
        });
      }

      animationFrameRef.current = requestAnimationFrame(simulate);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(simulate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isTraining, state.currentEpoch, state.totalEpochs, connections, onWeightsUpdate, state.learningRate]);

  return {
    trainingState: state,
    startTraining,
    stopTraining,
    resetTraining,
    setLearningRate,
    setTotalEpochs,
  };
};
