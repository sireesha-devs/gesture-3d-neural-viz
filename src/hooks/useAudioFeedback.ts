import { useCallback, useRef } from 'react';

type SoundType = 'pinch' | 'fist' | 'draw' | 'swipe' | 'handDetected' | 'handLost';

export const useAudioFeedback = (enabled: boolean = true) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayedRef = useRef<Map<SoundType, number>>(new Map());

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.15,
    attack: number = 0.01,
    decay: number = 0.1
  ) => {
    if (!enabled) return;

    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Envelope
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration - decay);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }, [enabled, getAudioContext]);

  const playChord = useCallback((
    frequencies: number[],
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.1
  ) => {
    frequencies.forEach(freq => {
      playTone(freq, duration, type, volume / frequencies.length);
    });
  }, [playTone]);

  const playSound = useCallback((soundType: SoundType) => {
    if (!enabled) return;

    // Debounce to prevent rapid repeated sounds
    const now = Date.now();
    const lastPlayed = lastPlayedRef.current.get(soundType) || 0;
    const minInterval = soundType === 'draw' ? 200 : 300;
    
    if (now - lastPlayed < minInterval) return;
    lastPlayedRef.current.set(soundType, now);

    switch (soundType) {
      case 'pinch':
        // Rising pleasant chime for forward propagation
        playTone(523.25, 0.15, 'sine', 0.12); // C5
        setTimeout(() => playTone(659.25, 0.15, 'sine', 0.1), 50); // E5
        setTimeout(() => playTone(783.99, 0.2, 'sine', 0.08), 100); // G5
        break;

      case 'fist':
        // Descending tone for backpropagation
        playTone(392, 0.15, 'triangle', 0.12); // G4
        setTimeout(() => playTone(329.63, 0.15, 'triangle', 0.1), 50); // E4
        setTimeout(() => playTone(261.63, 0.2, 'triangle', 0.08), 100); // C4
        break;

      case 'draw':
        // Soft blip for drawing
        playTone(880, 0.08, 'sine', 0.06);
        break;

      case 'swipe':
        // Swoosh-like sweep
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
        break;

      case 'handDetected':
        // Gentle confirmation
        playChord([440, 554.37, 659.25], 0.2, 'sine', 0.15); // A major chord
        break;

      case 'handLost':
        // Soft fade-out tone
        playTone(349.23, 0.3, 'sine', 0.08); // F4
        break;
    }
  }, [enabled, playTone, playChord, getAudioContext]);

  const cleanup = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  return {
    playSound,
    cleanup,
  };
};
