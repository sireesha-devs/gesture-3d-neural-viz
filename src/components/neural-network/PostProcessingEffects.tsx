import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

interface PostProcessingEffectsProps {
  bloomIntensity?: number;
}

export const PostProcessingEffects = ({ bloomIntensity = 0.8 }: PostProcessingEffectsProps) => {
  return (
    <EffectComposer>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        radius={0.8}
      />
      <Vignette
        eskil={false}
        offset={0.1}
        darkness={0.5}
      />
    </EffectComposer>
  );
};
