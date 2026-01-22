export type NetworkType = 'ANN' | 'CNN' | 'RCNN';

export interface Neuron {
  id: string;
  layerIndex: number;
  neuronIndex: number;
  position: [number, number, number];
  activation: number;
  gradient: number;
  bias: number;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  weight: number;
  gradient: number;
}

export interface Layer {
  id: string;
  type: 'input' | 'hidden' | 'output' | 'conv' | 'pool' | 'fc';
  neurons: Neuron[];
  name: string;
}

export interface NeuralNetwork {
  type: NetworkType;
  layers: Layer[];
  connections: Connection[];
}

export interface GestureState {
  isDrawing: boolean;
  isPinching: boolean;
  isFist: boolean;
  swipeDirection: 'left' | 'right' | null;
  handPosition: { x: number; y: number; z: number } | null;
  confidence: number;
}

export interface AnimationState {
  isForwardPropagating: boolean;
  isBackPropagating: boolean;
  currentLayerIndex: number;
  propagationProgress: number;
  isPlaying: boolean;
  isDemoMode: boolean;
}

export interface Annotation {
  id: string;
  points: [number, number, number][];
  color: string;
  timestamp: number;
}
