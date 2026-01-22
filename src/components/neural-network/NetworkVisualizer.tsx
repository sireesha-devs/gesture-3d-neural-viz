import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { Neuron3D } from './Neuron3D';
import { Connection3D } from './Connection3D';
import { LayerHighlight } from './LayerHighlight';
import type { NeuralNetwork, AnimationState } from '@/types/neural-network';

interface NetworkVisualizerProps {
  network: NeuralNetwork;
  animationState: AnimationState;
  highlightedLayer: number | null;
  isTraining?: boolean;
}

export const NetworkVisualizer = ({
  network,
  animationState,
  highlightedLayer,
  isTraining = false,
}: NetworkVisualizerProps) => {
  // Create a map of neurons by ID for quick lookup
  const neuronMap = useMemo(() => {
    const map = new Map();
    network.layers.forEach((layer) => {
      layer.neurons.forEach((neuron) => {
        map.set(neuron.id, neuron);
      });
    });
    return map;
  }, [network.layers]);

  return (
    <group>
      {/* Layer highlights */}
      {network.layers.map((layer, layerIndex) => {
        const isActive =
          (animationState.isForwardPropagating &&
            layerIndex === animationState.currentLayerIndex) ||
          (animationState.isBackPropagating &&
            layerIndex === animationState.currentLayerIndex);

        return (
          <LayerHighlight
            key={`highlight-${layer.id}`}
            layer={layer}
            isActive={isActive || highlightedLayer === layerIndex}
            isBackprop={animationState.isBackPropagating}
          />
        );
      })}

      {/* Layer labels */}
      {network.layers.map((layer) => {
        const x = layer.neurons[0]?.position[0] || 0;
        const maxY = Math.max(...layer.neurons.map(n => n.position[1]));
        
        return (
          <Text
            key={`label-${layer.id}`}
            position={[x, maxY + 1.5, 0]}
            fontSize={0.4}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            {layer.name}
          </Text>
        );
      })}

      {/* Connections */}
      {network.connections.map((connection) => {
        const fromNeuron = neuronMap.get(connection.from);
        const toNeuron = neuronMap.get(connection.to);

        if (!fromNeuron || !toNeuron) return null;

        const isActive =
          (animationState.isForwardPropagating &&
            fromNeuron.layerIndex === animationState.currentLayerIndex) ||
          (animationState.isBackPropagating &&
            toNeuron.layerIndex === animationState.currentLayerIndex);

        return (
          <Connection3D
            key={connection.id}
            connection={connection}
            fromNeuron={fromNeuron}
            toNeuron={toNeuron}
            isActive={isActive}
            animationProgress={animationState.propagationProgress}
            isBackprop={animationState.isBackPropagating}
            isTraining={isTraining}
          />
        );
      })}

      {/* Neurons */}
      {network.layers.map((layer, layerIndex) =>
        layer.neurons.map((neuron) => {
          const isActive =
            (animationState.isForwardPropagating &&
              layerIndex === animationState.currentLayerIndex) ||
            (animationState.isBackPropagating &&
              layerIndex === animationState.currentLayerIndex);

          return (
            <Neuron3D
              key={neuron.id}
              neuron={neuron}
              isActive={isActive}
              isHighlighted={highlightedLayer === layerIndex}
              animationProgress={animationState.propagationProgress}
              isBackprop={animationState.isBackPropagating}
              layerType={layer.type}
            />
          );
        })
      )}
    </group>
  );
};
