import { Play, Pause, RotateCcw, Sparkles, MonitorPlay } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { NetworkType, AnimationState } from '@/types/neural-network';

interface ControlPanelProps {
  networkType: NetworkType;
  animationState: AnimationState;
  onNetworkChange: (type: NetworkType) => void;
  onStartForward: () => void;
  onStartBackward: () => void;
  onStop: () => void;
  onToggleDemoMode: () => void;
  onTogglePlayPause: () => void;
  gestureEnabled: boolean;
  onToggleGestures: () => void;
}

export const ControlPanel = ({
  networkType,
  animationState,
  onNetworkChange,
  onStartForward,
  onStartBackward,
  onStop,
  onToggleDemoMode,
  onTogglePlayPause,
  gestureEnabled,
  onToggleGestures,
}: ControlPanelProps) => {
  const isAnimating = animationState.isForwardPropagating || animationState.isBackPropagating;

  return (
    <Card className="fixed left-4 top-20 z-50 w-64 bg-card/95 backdrop-blur-sm shadow-2xl border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Architecture Selector */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Architecture</Label>
          <Select value={networkType} onValueChange={(v) => onNetworkChange(v as NetworkType)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ANN">
                <span className="flex items-center gap-2">
                  ANN
                  <Badge variant="secondary" className="text-[10px] px-1">Basic</Badge>
                </span>
              </SelectItem>
              <SelectItem value="CNN">
                <span className="flex items-center gap-2">
                  CNN
                  <Badge variant="secondary" className="text-[10px] px-1">Vision</Badge>
                </span>
              </SelectItem>
              <SelectItem value="RCNN">
                <span className="flex items-center gap-2">
                  R-CNN
                  <Badge variant="secondary" className="text-[10px] px-1">Detection</Badge>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Animation Controls */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Animation</Label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={animationState.isForwardPropagating ? "default" : "outline"}
              className="flex-1 h-8 text-xs"
              onClick={onStartForward}
              disabled={isAnimating && !animationState.isForwardPropagating}
            >
              Forward
            </Button>
            <Button
              size="sm"
              variant={animationState.isBackPropagating ? "destructive" : "outline"}
              className="flex-1 h-8 text-xs"
              onClick={onStartBackward}
              disabled={isAnimating && !animationState.isBackPropagating}
            >
              Backward
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8"
              onClick={onTogglePlayPause}
              disabled={!isAnimating}
            >
              {animationState.isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8"
              onClick={onStop}
              disabled={!isAnimating}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-xs flex items-center gap-2">
            <MonitorPlay className="h-3 w-3" />
            Demo Mode
          </Label>
          <Switch
            checked={animationState.isDemoMode}
            onCheckedChange={onToggleDemoMode}
          />
        </div>

        {/* Gesture Toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-xs">Gesture Control</Label>
          <Switch
            checked={gestureEnabled}
            onCheckedChange={onToggleGestures}
          />
        </div>

        {/* Status */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`h-2 w-2 rounded-full ${isAnimating ? 'bg-green-500 animate-pulse' : 'bg-muted'}`} />
            {isAnimating
              ? animationState.isForwardPropagating
                ? 'Forward Propagating...'
                : 'Backpropagating...'
              : animationState.isDemoMode
                ? 'Demo Mode Active'
                : 'Ready'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
