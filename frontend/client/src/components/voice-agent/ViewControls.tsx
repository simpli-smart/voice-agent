import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from "@pipecat-ai/voice-ui-kit";
import { MessageCircleMore, BarChart3 } from 'lucide-react';
import { MetricsDrawer } from '@/components/voice-agent/MetricsDrawer';

interface ViewControlsProps {
  currentView: 'visualizer' | 'conversation';
  onViewChange: (view: 'visualizer' | 'conversation') => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  currentView,
  onViewChange,
}) => {
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 pb-3">
        <div className="flex items-center justify-end max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            {/* View Select Dropdown */}
            <Select value={currentView} onValueChange={onViewChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select view">
                  <div className="flex items-center gap-2">
                    {currentView === 'visualizer' ? (
                      <>
                        <BarChart3 className="w-4 h-4" />
                        Voice
                      </>
                    ) : (
                      <>
                        <MessageCircleMore className="w-4 h-4" />
                        Conversation
                      </>
                    )}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visualizer">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Voice
                  </div>
                </SelectItem>
                <SelectItem value="conversation">
                  <div className="flex items-center gap-2">
                    <MessageCircleMore className="w-4 h-4" />
                    Conversation
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Metrics Button */}
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsMetricsOpen(true)}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              View Metrics
            </Button>
          </div>
        </div>
      </div>
      
      {/* Metrics Drawer */}
      <MetricsDrawer 
        isOpen={isMetricsOpen} 
        onClose={() => setIsMetricsOpen(false)}
      />
    </>
  );
};
