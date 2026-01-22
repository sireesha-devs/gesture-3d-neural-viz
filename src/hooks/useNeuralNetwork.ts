import { useState, useCallback, useMemo } from 'react';
import type { NeuralNetwork, NetworkType, Layer, Neuron, Connection } from '@/types/neural-network';

const createNeuron = (layerIndex: number, neuronIndex: number, totalInLayer: number, layerX: number): Neuron => {
  const spacing = 2;
  const offsetY = ((totalInLayer - 1) / 2) * spacing;
  return {
    id: `neuron-${layerIndex}-${neuronIndex}`,
    layerIndex,
    neuronIndex,
    position: [layerX, neuronIndex * spacing - offsetY, 0],
    activation: 0,
    gradient: 0,
    bias: Math.random() * 0.5 - 0.25,
  };
};

const createANNNetwork = (): NeuralNetwork => {
  const layerSizes = [4, 6, 8, 6, 3];
  const layers: Layer[] = [];
  const connections: Connection[] = [];
  const layerSpacing = 4;

  layerSizes.forEach((size, layerIndex) => {
    const layerX = (layerIndex - (layerSizes.length - 1) / 2) * layerSpacing;
    const neurons: Neuron[] = [];
    
    for (let i = 0; i < size; i++) {
      neurons.push(createNeuron(layerIndex, i, size, layerX));
    }

    let layerType: Layer['type'] = 'hidden';
    if (layerIndex === 0) layerType = 'input';
    else if (layerIndex === layerSizes.length - 1) layerType = 'output';

    layers.push({
      id: `layer-${layerIndex}`,
      type: layerType,
      neurons,
      name: layerType === 'input' ? 'Input Layer' : layerType === 'output' ? 'Output Layer' : `Hidden Layer ${layerIndex}`,
    });

    if (layerIndex > 0) {
      const prevLayer = layers[layerIndex - 1];
      neurons.forEach((neuron) => {
        prevLayer.neurons.forEach((prevNeuron) => {
          connections.push({
            id: `conn-${prevNeuron.id}-${neuron.id}`,
            from: prevNeuron.id,
            to: neuron.id,
            weight: Math.random() * 2 - 1,
            gradient: 0,
          });
        });
      });
    }
  });

  return { type: 'ANN', layers, connections };
};

const createCNNNetwork = (): NeuralNetwork => {
  const layers: Layer[] = [];
  const connections: Connection[] = [];
  const layerSpacing = 5;

  // Input layer (like an image)
  const inputNeurons: Neuron[] = [];
  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    inputNeurons.push({
      id: `neuron-0-${i}`,
      layerIndex: 0,
      neuronIndex: i,
      position: [-10, (row - 1) * 1.5, (col - 1) * 1.5],
      activation: 0,
      gradient: 0,
      bias: 0,
    });
  }
  layers.push({ id: 'layer-0', type: 'input', neurons: inputNeurons, name: 'Input (3x3)' });

  // Conv layer
  const convNeurons: Neuron[] = [];
  for (let i = 0; i < 4; i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    convNeurons.push({
      id: `neuron-1-${i}`,
      layerIndex: 1,
      neuronIndex: i,
      position: [-5, (row - 0.5) * 2, (col - 0.5) * 2],
      activation: 0,
      gradient: 0,
      bias: Math.random() * 0.5 - 0.25,
    });
  }
  layers.push({ id: 'layer-1', type: 'conv', neurons: convNeurons, name: 'Conv Layer' });

  // Pooling layer
  const poolNeurons: Neuron[] = [];
  for (let i = 0; i < 2; i++) {
    poolNeurons.push({
      id: `neuron-2-${i}`,
      layerIndex: 2,
      neuronIndex: i,
      position: [0, (i - 0.5) * 2, 0],
      activation: 0,
      gradient: 0,
      bias: 0,
    });
  }
  layers.push({ id: 'layer-2', type: 'pool', neurons: poolNeurons, name: 'Pooling Layer' });

  // Fully connected layers
  const fcSizes = [4, 3];
  fcSizes.forEach((size, idx) => {
    const layerIndex = 3 + idx;
    const neurons: Neuron[] = [];
    for (let i = 0; i < size; i++) {
      neurons.push(createNeuron(layerIndex, i, size, 5 + idx * layerSpacing));
    }
    layers.push({
      id: `layer-${layerIndex}`,
      type: idx === fcSizes.length - 1 ? 'output' : 'fc',
      neurons,
      name: idx === fcSizes.length - 1 ? 'Output Layer' : 'FC Layer',
    });
  });

  // Create connections between all adjacent layers
  for (let i = 1; i < layers.length; i++) {
    const prevLayer = layers[i - 1];
    const currLayer = layers[i];
    currLayer.neurons.forEach((neuron) => {
      prevLayer.neurons.forEach((prevNeuron) => {
        connections.push({
          id: `conn-${prevNeuron.id}-${neuron.id}`,
          from: prevNeuron.id,
          to: neuron.id,
          weight: Math.random() * 2 - 1,
          gradient: 0,
        });
      });
    });
  }

  return { type: 'CNN', layers, connections };
};

const createRCNNNetwork = (): NeuralNetwork => {
  const layers: Layer[] = [];
  const connections: Connection[] = [];

  // Similar to CNN but with additional region proposal concept
  const inputNeurons: Neuron[] = [];
  for (let i = 0; i < 16; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    inputNeurons.push({
      id: `neuron-0-${i}`,
      layerIndex: 0,
      neuronIndex: i,
      position: [-12, (row - 1.5) * 1.2, (col - 1.5) * 1.2],
      activation: 0,
      gradient: 0,
      bias: 0,
    });
  }
  layers.push({ id: 'layer-0', type: 'input', neurons: inputNeurons, name: 'Input Image' });

  // Region proposal layer
  const regionNeurons: Neuron[] = [];
  for (let i = 0; i < 4; i++) {
    regionNeurons.push({
      id: `neuron-1-${i}`,
      layerIndex: 1,
      neuronIndex: i,
      position: [-6, (i - 1.5) * 2, 0],
      activation: 0,
      gradient: 0,
      bias: Math.random() * 0.5,
    });
  }
  layers.push({ id: 'layer-1', type: 'conv', neurons: regionNeurons, name: 'Region Proposals' });

  // Feature extraction
  const featureNeurons: Neuron[] = [];
  for (let i = 0; i < 6; i++) {
    featureNeurons.push(createNeuron(2, i, 6, 0));
  }
  layers.push({ id: 'layer-2', type: 'fc', neurons: featureNeurons, name: 'Feature Extraction' });

  // Classification & Bounding Box
  const outputNeurons: Neuron[] = [];
  for (let i = 0; i < 4; i++) {
    outputNeurons.push(createNeuron(3, i, 4, 6));
  }
  layers.push({ id: 'layer-3', type: 'output', neurons: outputNeurons, name: 'Classification + BBox' });

  // Create connections
  for (let i = 1; i < layers.length; i++) {
    const prevLayer = layers[i - 1];
    const currLayer = layers[i];
    currLayer.neurons.forEach((neuron) => {
      prevLayer.neurons.forEach((prevNeuron) => {
        connections.push({
          id: `conn-${prevNeuron.id}-${neuron.id}`,
          from: prevNeuron.id,
          to: neuron.id,
          weight: Math.random() * 2 - 1,
          gradient: 0,
        });
      });
    });
  }

  return { type: 'RCNN', layers, connections };
};

export const useNeuralNetwork = () => {
  const [networkType, setNetworkType] = useState<NetworkType>('ANN');
  const [connectionWeights, setConnectionWeights] = useState<Map<string, number>>(new Map());

  const baseNetwork = useMemo(() => {
    switch (networkType) {
      case 'CNN':
        return createCNNNetwork();
      case 'RCNN':
        return createRCNNNetwork();
      default:
        return createANNNetwork();
    }
  }, [networkType]);

  // Apply weight updates to the network
  const network = useMemo(() => {
    if (connectionWeights.size === 0) return baseNetwork;
    
    return {
      ...baseNetwork,
      connections: baseNetwork.connections.map(conn => ({
        ...conn,
        weight: connectionWeights.get(conn.id) ?? conn.weight,
      })),
    };
  }, [baseNetwork, connectionWeights]);

  const updateWeights = useCallback((updates: Map<string, number>) => {
    setConnectionWeights(prev => {
      const newWeights = new Map(prev);
      updates.forEach((weight, id) => {
        newWeights.set(id, weight);
      });
      return newWeights;
    });
  }, []);

  const resetWeights = useCallback(() => {
    setConnectionWeights(new Map());
  }, []);

  const switchNetwork = useCallback((type: NetworkType) => {
    setNetworkType(type);
    setConnectionWeights(new Map());
  }, []);

  const switchToNext = useCallback(() => {
    setNetworkType((current) => {
      switch (current) {
        case 'ANN': return 'CNN';
        case 'CNN': return 'RCNN';
        case 'RCNN': return 'ANN';
      }
    });
    setConnectionWeights(new Map());
  }, []);

  const switchToPrev = useCallback(() => {
    setNetworkType((current) => {
      switch (current) {
        case 'ANN': return 'RCNN';
        case 'CNN': return 'ANN';
        case 'RCNN': return 'CNN';
      }
    });
    setConnectionWeights(new Map());
  }, []);

  return {
    network,
    networkType,
    switchNetwork,
    switchToNext,
    switchToPrev,
    updateWeights,
    resetWeights,
  };
};
