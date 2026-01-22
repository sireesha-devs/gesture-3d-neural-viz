import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, ArrowDown, Target, TrendingDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LearningPanelProps {
  onHighlightLayer: (layerIndex: number | null) => void;
}

const topics = [
  {
    id: 'basics',
    title: 'Neural Networks',
    icon: Brain,
    content: {
      title: 'What is a Neural Network?',
      description: 'A neural network is a computational model inspired by the human brain.',
      sections: [
        {
          heading: 'Neurons',
          text: 'The basic unit of a neural network. Each neuron receives inputs, applies weights, adds a bias, and passes the result through an activation function.',
          highlightLayer: 0,
        },
        {
          heading: 'Layers',
          text: 'Networks are organized in layers: Input layer receives data, Hidden layers process information, Output layer produces results.',
          highlightLayer: 1,
        },
        {
          heading: 'Connections',
          text: 'Weights on connections determine how much influence one neuron has on another. Learning adjusts these weights.',
          highlightLayer: null,
        },
      ],
    },
  },
  {
    id: 'forward',
    title: 'Forward Propagation',
    icon: Zap,
    content: {
      title: 'Forward Propagation',
      description: 'How data flows through the network from input to output.',
      sections: [
        {
          heading: 'Data Input',
          text: 'Data enters through the input layer. Each input neuron holds a feature value from your data.',
          highlightLayer: 0,
        },
        {
          heading: 'Weighted Sum',
          text: 'Each neuron computes: z = Σ(weight × input) + bias. This is the weighted sum of all incoming connections.',
          highlightLayer: 1,
        },
        {
          heading: 'Activation',
          text: 'The result passes through an activation function (like ReLU or Sigmoid) to introduce non-linearity.',
          highlightLayer: 2,
        },
      ],
    },
  },
  {
    id: 'backprop',
    title: 'Backpropagation',
    icon: ArrowDown,
    content: {
      title: 'Backpropagation',
      description: 'How the network learns by propagating errors backward.',
      sections: [
        {
          heading: 'Error Calculation',
          text: 'At the output layer, we calculate the difference between predicted and actual values.',
          highlightLayer: null,
        },
        {
          heading: 'Gradient Flow',
          text: 'Using the chain rule, we calculate how much each weight contributed to the error.',
          highlightLayer: 2,
        },
        {
          heading: 'Weight Update',
          text: 'Weights are adjusted in the opposite direction of the gradient to minimize error.',
          highlightLayer: 1,
        },
      ],
    },
  },
  {
    id: 'loss',
    title: 'Loss Function',
    icon: Target,
    content: {
      title: 'Loss Functions',
      description: 'Measuring how wrong the network\'s predictions are.',
      sections: [
        {
          heading: 'MSE Loss',
          text: 'Mean Squared Error: Average of squared differences. Good for regression tasks.',
          highlightLayer: null,
        },
        {
          heading: 'Cross-Entropy',
          text: 'Measures the difference between probability distributions. Ideal for classification.',
          highlightLayer: null,
        },
        {
          heading: 'Loss Landscape',
          text: 'The loss function creates a landscape in weight space. Training finds the lowest point.',
          highlightLayer: null,
        },
      ],
    },
  },
  {
    id: 'gradient',
    title: 'Gradient Descent',
    icon: TrendingDown,
    content: {
      title: 'Gradient Descent',
      description: 'The optimization algorithm that trains neural networks.',
      sections: [
        {
          heading: 'Learning Rate',
          text: 'Controls step size. Too high = overshoot. Too low = slow convergence.',
          highlightLayer: null,
        },
        {
          heading: 'Mini-batch',
          text: 'Instead of using all data, we use small batches for faster, more stable training.',
          highlightLayer: null,
        },
        {
          heading: 'Convergence',
          text: 'Through many iterations, the network gradually improves its predictions.',
          highlightLayer: null,
        },
      ],
    },
  },
];

export const LearningPanel = ({ onHighlightLayer }: LearningPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const handleSectionHover = (layerIndex: number | null) => {
    onHighlightLayer(layerIndex);
  };

  if (isCollapsed) {
    return (
      <Button
        variant="secondary"
        size="icon"
        className="fixed right-4 top-20 z-50 h-10 w-10 rounded-full shadow-lg"
        onClick={() => setIsCollapsed(false)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed right-4 top-20 z-50 w-80">
      <Card className="bg-card/95 backdrop-blur-sm shadow-2xl border-border">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Learn Neural Networks</CardTitle>
            <CardDescription>Interactive explanations</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsCollapsed(true)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-transparent p-2">
              {topics.map((topic) => (
                <TabsTrigger
                  key={topic.id}
                  value={topic.id}
                  className="text-xs px-2 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <topic.icon className="h-3 w-3 mr-1" />
                  {topic.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <ScrollArea className="h-[400px]">
              {topics.map((topic) => (
                <TabsContent key={topic.id} value={topic.id} className="p-4 pt-2 m-0">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{topic.content.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {topic.content.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {topic.content.sections.map((section, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "p-3 rounded-lg border transition-all cursor-pointer",
                            activeSection === idx
                              ? "bg-primary/10 border-primary"
                              : "bg-muted/50 border-transparent hover:border-border"
                          )}
                          onMouseEnter={() => {
                            setActiveSection(idx);
                            handleSectionHover(section.highlightLayer);
                          }}
                          onMouseLeave={() => {
                            setActiveSection(null);
                            handleSectionHover(null);
                          }}
                        >
                          <h4 className="text-sm font-medium text-foreground">
                            {section.heading}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {section.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
