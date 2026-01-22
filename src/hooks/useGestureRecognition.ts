import { useState, useEffect, useCallback, useRef } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import type { GestureState } from '@/types/neural-network';

export const useGestureRecognition = (enabled: boolean = true) => {
  const [gestureState, setGestureState] = useState<GestureState>({
    isDrawing: false,
    isPinching: false,
    isFist: false,
    swipeDirection: null,
    handPosition: null,
    confidence: 0,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const lastPositionRef = useRef<{ x: number; time: number } | null>(null);
  const swipeTimeoutRef = useRef<number | null>(null);

  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const isIndexFingerPointing = (landmarks: Results['multiHandLandmarks'][0]) => {
    const indexTip = landmarks[8];
    const indexDip = landmarks[7];
    const indexPip = landmarks[6];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    // Index finger is extended
    const indexExtended = indexTip.y < indexDip.y && indexDip.y < indexPip.y;
    
    // Other fingers are curled
    const middleCurled = middleTip.y > landmarks[10].y;
    const ringCurled = ringTip.y > landmarks[14].y;
    const pinkyCurled = pinkyTip.y > landmarks[18].y;

    return indexExtended && middleCurled && ringCurled && pinkyCurled;
  };

  const isPinchGesture = (landmarks: Results['multiHandLandmarks'][0]) => {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const distance = calculateDistance(thumbTip, indexTip);
    return distance < 0.05;
  };

  const isFistGesture = (landmarks: Results['multiHandLandmarks'][0]) => {
    const fingerTips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
    const fingerBases = [landmarks[5], landmarks[9], landmarks[13], landmarks[17]];
    
    return fingerTips.every((tip, i) => tip.y > fingerBases[i].y);
  };

  const detectSwipe = useCallback((currentX: number) => {
    const now = Date.now();
    const last = lastPositionRef.current;

    if (last && now - last.time < 500) {
      const deltaX = currentX - last.x;
      if (Math.abs(deltaX) > 0.3) {
        const direction = deltaX > 0 ? 'right' : 'left';
        setGestureState(prev => ({ ...prev, swipeDirection: direction }));
        
        // Clear swipe after a short delay
        if (swipeTimeoutRef.current) {
          clearTimeout(swipeTimeoutRef.current);
        }
        swipeTimeoutRef.current = window.setTimeout(() => {
          setGestureState(prev => ({ ...prev, swipeDirection: null }));
        }, 300);
      }
    }

    lastPositionRef.current = { x: currentX, time: now };
  }, []);

  const onResults = useCallback((results: Results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const wrist = landmarks[0];
      const indexTip = landmarks[8];

      detectSwipe(wrist.x);

      const newState: GestureState = {
        isDrawing: isIndexFingerPointing(landmarks),
        isPinching: isPinchGesture(landmarks),
        isFist: isFistGesture(landmarks),
        swipeDirection: gestureState.swipeDirection,
        handPosition: {
          x: (indexTip.x - 0.5) * 20,
          y: -(indexTip.y - 0.5) * 15,
          z: (indexTip.z || 0) * 10,
        },
        confidence: results.multiHandedness?.[0]?.score || 0,
      };

      setGestureState(prev => ({
        ...newState,
        swipeDirection: prev.swipeDirection,
      }));
    } else {
      setGestureState(prev => ({
        ...prev,
        isDrawing: false,
        isPinching: false,
        isFist: false,
        handPosition: null,
        confidence: 0,
      }));
    }
  }, [detectSwipe, gestureState.swipeDirection]);

  const initialize = useCallback(async () => {
    if (!enabled || isInitialized) return;

    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);

      // Create video element
      const video = document.createElement('video');
      video.srcObject = stream;
      video.style.display = 'none';
      document.body.appendChild(video);
      videoRef.current = video;

      // Initialize MediaPipe Hands
      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onResults);
      handsRef.current = hands;

      // Initialize camera
      const camera = new Camera(video, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current) {
            await handsRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });

      await camera.start();
      cameraRef.current = camera;
      setIsInitialized(true);
    } catch (err) {
      console.error('Failed to initialize gesture recognition:', err);
      setHasPermission(false);
      setError(err instanceof Error ? err.message : 'Failed to access camera');
    }
  }, [enabled, isInitialized, onResults]);

  const cleanup = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    if (handsRef.current) {
      handsRef.current.close();
      handsRef.current = null;
    }
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      videoRef.current.remove();
      videoRef.current = null;
    }
    if (swipeTimeoutRef.current) {
      clearTimeout(swipeTimeoutRef.current);
    }
    setIsInitialized(false);
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    gestureState,
    isInitialized,
    hasPermission,
    error,
    initialize,
    cleanup,
  };
};
