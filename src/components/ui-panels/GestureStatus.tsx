import { Camera, Video, VideoOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import type { GestureState } from '@/types/neural-network';

interface GestureStatusProps {
  isEnabled: boolean;
  isInitialized: boolean;
  hasPermission: boolean | null;
  error: string | null;
  gestureState: GestureState;
  onInitialize: () => void;
}

export const GestureStatus = ({
  isEnabled,
  isInitialized,
  hasPermission,
  error,
  gestureState,
  onInitialize,
}: GestureStatusProps) => {
  if (!isEnabled) {
    return null;
  }

  // Show permission request
  if (hasPermission === null && !isInitialized) {
    return (
      <Card className="fixed left-4 bottom-4 z-50 w-72 bg-card/95 backdrop-blur-sm shadow-2xl border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Camera Access Required
          </CardTitle>
          <CardDescription className="text-xs">
            Enable webcam for gesture controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={onInitialize}
          >
            <Video className="h-4 w-4 mr-2" />
            Enable Gestures
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show error
  if (hasPermission === false || error) {
    return (
      <Alert className="fixed left-4 bottom-4 z-50 w-72 border-destructive/50 bg-destructive/10">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-sm">Camera Unavailable</AlertTitle>
        <AlertDescription className="text-xs">
          {error || 'Camera access denied. Using mouse controls.'}
        </AlertDescription>
      </Alert>
    );
  }

  // Show active gesture status
  if (isInitialized) {
    return (
      <Card className="fixed left-4 bottom-4 z-50 w-64 bg-card/95 backdrop-blur-sm shadow-2xl border-border">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Video className="h-3 w-3" />
              Gesture Recognition
            </span>
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${gestureState.confidence > 0.7 ? 'bg-green-500' : gestureState.confidence > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <span className="text-[10px] text-muted-foreground">
                {gestureState.confidence > 0 ? `${(gestureState.confidence * 100).toFixed(0)}%` : 'No hand'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            <Badge
              variant={gestureState.isDrawing ? "default" : "secondary"}
              className="text-[10px] px-1.5 py-0"
            >
              Drawing
            </Badge>
            <Badge
              variant={gestureState.isPinching ? "default" : "secondary"}
              className="text-[10px] px-1.5 py-0"
            >
              Pinch
            </Badge>
            <Badge
              variant={gestureState.isFist ? "destructive" : "secondary"}
              className="text-[10px] px-1.5 py-0"
            >
              Fist
            </Badge>
            {gestureState.swipeDirection && (
              <Badge className="text-[10px] px-1.5 py-0 bg-primary">
                Swipe {gestureState.swipeDirection}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
