import React, { useState } from 'react';
import { ThemeModeToggle } from "@pipecat-ai/voice-ui-kit";
import { Logo } from '../Logo';
import { BarChart3 } from 'lucide-react';
import { Button } from "@pipecat-ai/voice-ui-kit";
import { MetricsDrawer } from '@/components/voice-agent/MetricsDrawer';

interface ToolbarProps {
  title: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ title }) => {
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);

  return (
    <>
      <div className="w-full relative flex items-center justify-between p-4 border-b border-border bg-background/95">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        
        {/* Center: Title - Absolutely positioned for perfect centering */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        
        {/* Right: Metrics Button and Dark Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMetricsOpen(true)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Metrics
          </Button>
          <ThemeModeToggle />
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
