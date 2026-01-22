import { useState } from 'react';
import { Play, Pause, RotateCcw, TrendingDown, Zap, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { TrainingState } from '@/hooks/useTrainingSimulation';

interface TrainingPanelProps {
  trainingState: TrainingState;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onLearningRateChange: (rate: number) => void;
  onTotalEpochsChange: (epochs: number) => void;
}

export const TrainingPanel = ({
  trainingState,
  onStart,
  onStop,
  onReset,
  onLearningRateChange,
  onTotalEpochsChange,
}: TrainingPanelProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const epochProgress = (trainingState.currentEpoch / trainingState.totalEpochs) * 100;
  const isComplete = trainingState.currentEpoch >= trainingState.totalEpochs;

  return (
    <Card className="fixed right-2 bottom-2 z-50 w-[calc(100vw-1rem)] max-w-sm sm:right-4 sm:bottom-4 sm:w-80 md:w-96 bg-card/95 backdrop-blur-sm shadow-2xl border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">Training Simulation</span>
              <span className="sm:hidden">Training</span>
            </span>
            <div className="flex items-center gap-2">
              <Badge 
                variant={trainingState.isTraining ? "default" : isComplete ? "secondary" : "outline"}
                className="text-[10px]"
              >
                {trainingState.isTraining ? 'Training' : isComplete ? 'Complete' : 'Ready'}
              </Badge>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardTitle>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            {/* Loss & Accuracy Chart */}
            <div className="h-28 sm:h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trainingState.lossHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="epoch" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                yAxisId="loss"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                domain={[0, 'auto']}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                orientation="left"
              />
              <YAxis 
                yAxisId="accuracy"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                domain={[0, 1]}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                orientation="right"
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number, name: string) => [
                  name === 'accuracy' ? `${(value * 100).toFixed(1)}%` : value.toFixed(4),
                  name === 'accuracy' ? 'Accuracy' : 'Loss'
                ]}
              />
              <Legend 
                wrapperStyle={{ fontSize: '10px' }}
                iconSize={8}
              />
              <Line
                yAxisId="loss"
                type="monotone"
                dataKey="loss"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                animationDuration={200}
                name="loss"
              />
              <Line
                yAxisId="accuracy"
                type="monotone"
                dataKey="accuracy"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                animationDuration={200}
                name="accuracy"
              />
            </LineChart>
          </ResponsiveContainer>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-xs">
              <div className="bg-muted/50 rounded-lg p-1.5 sm:p-2">
                <div className="text-muted-foreground text-[10px] sm:text-xs">Epoch</div>
                <div className="font-mono font-semibold text-foreground text-[11px] sm:text-xs">
                  {trainingState.currentEpoch}/{trainingState.totalEpochs}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-1.5 sm:p-2">
                <div className="text-muted-foreground flex items-center gap-1 text-[10px] sm:text-xs">
                  <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  Loss
                </div>
                <div className="font-mono font-semibold text-foreground text-[11px] sm:text-xs">
                  {trainingState.currentLoss.toFixed(4)}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-1.5 sm:p-2">
                <div className="text-muted-foreground flex items-center gap-1 text-[10px] sm:text-xs">
                  <Target className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  Acc
                </div>
                <div className="font-mono font-semibold text-emerald-400 text-[11px] sm:text-xs">
                  {(trainingState.currentAccuracy * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Epoch Progress */}
            <div className="space-y-1">
              <Label className="text-[10px] sm:text-xs text-muted-foreground">Epoch Progress</Label>
              <Progress value={epochProgress} className="h-1.5 sm:h-2" />
            </div>

            {/* Batch Progress (within epoch) */}
            {trainingState.isTraining && (
              <div className="space-y-1">
                <Label className="text-[10px] sm:text-xs text-muted-foreground">Batch Progress</Label>
                <Progress value={trainingState.batchProgress * 100} className="h-1 sm:h-1.5" />
              </div>
            )}

            {/* Learning Rate Slider - Hidden on mobile when training */}
            <div className="hidden sm:block space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Learning Rate
                </Label>
                <span className="text-xs font-mono text-foreground">
                  {trainingState.learningRate.toFixed(3)}
                </span>
              </div>
              <Slider
                value={[trainingState.learningRate]}
                onValueChange={([value]) => onLearningRateChange(value)}
                min={0.001}
                max={0.1}
                step={0.001}
                disabled={trainingState.isTraining}
                className="w-full"
              />
            </div>

            {/* Total Epochs Slider - Hidden on mobile when training */}
            <div className="hidden sm:block space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Total Epochs</Label>
                <span className="text-xs font-mono text-foreground">
                  {trainingState.totalEpochs}
                </span>
              </div>
              <Slider
                value={[trainingState.totalEpochs]}
                onValueChange={([value]) => onTotalEpochsChange(value)}
                min={10}
                max={200}
                step={10}
                disabled={trainingState.isTraining}
                className="w-full"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-2 pt-1 sm:pt-2">
              {!trainingState.isTraining ? (
                <Button
                  size="sm"
                  className="flex-1 h-7 sm:h-8 text-xs sm:text-sm"
                  onClick={onStart}
                  disabled={isComplete}
                >
                  <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {isComplete ? 'Done' : 'Start'}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 h-7 sm:h-8 text-xs sm:text-sm"
                  onClick={onStop}
                >
                  <Pause className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Pause
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="h-7 sm:h-8"
                onClick={onReset}
              >
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
