import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Hand, Pointer, CircleDot, Grip, ArrowLeftRight, Mouse } from 'lucide-react';

interface OnboardingOverlayProps {
  onComplete: () => void;
}

const steps = [
  {
    title: 'Welcome to Neural Network Visualizer',
    description: 'Explore neural networks in 3D with gesture controls or mouse interaction.',
    icon: null,
  },
  {
    title: 'Draw Annotations',
    description: 'Point with your index finger to draw 3D annotations in the scene.',
    icon: Pointer,
    gesture: 'Index Finger',
  },
  {
    title: 'Forward Propagation',
    description: 'Pinch your thumb and index finger together to trigger forward propagation.',
    icon: CircleDot,
    gesture: 'Pinch',
  },
  {
    title: 'Backpropagation',
    description: 'Make a closed fist to trigger backpropagation and see gradient flow.',
    icon: Grip,
    gesture: 'Closed Fist',
  },
  {
    title: 'Switch Architecture',
    description: 'Swipe left or right to switch between ANN, CNN, and R-CNN visualizations.',
    icon: ArrowLeftRight,
    gesture: 'Swipe',
  },
  {
    title: 'Mouse Controls',
    description: 'No webcam? Use mouse to orbit, scroll to zoom, and click buttons for actions.',
    icon: Mouse,
    gesture: 'Fallback',
  },
];

export const OnboardingOverlay = ({ onComplete }: OnboardingOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('nn-visualizer-onboarded', 'true');
    setTimeout(onComplete, 300);
  };

  const handleSkip = () => {
    handleComplete();
  };

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('nn-visualizer-onboarded');
    if (hasOnboarded) {
      setIsVisible(false);
      onComplete();
    }
  }, [onComplete]);

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md shadow-2xl border-border">
        <CardHeader className="relative pb-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8"
            onClick={handleSkip}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            {step.icon && (
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
            )}
            {!step.icon && (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <Hand className="h-6 w-6 text-primary-foreground" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{step.title}</CardTitle>
              {step.gesture && (
                <Badge variant="secondary" className="mt-1">
                  {step.gesture}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-sm leading-relaxed">
            {step.description}
          </CardDescription>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 py-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? 'bg-primary w-4'
                    : idx < currentStep
                      ? 'bg-primary/50'
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={handleSkip}
            >
              Skip Tutorial
            </Button>
            <Button
              className="flex-1"
              onClick={handleNext}
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
