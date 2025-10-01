import React from 'react';
import { ThemeModeToggle } from "@pipecat-ai/voice-ui-kit";
import { Logo } from '../Logo';

interface ToolbarProps {
  title: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ title }) => {
  return (
    <div className="w-full relative flex items-center justify-between p-4 border-b border-border bg-background/95">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <Logo />
      </div>
      
      {/* Center: Title - Absolutely positioned for perfect centering */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      {/* Right: Dark Mode Toggle */}
      <div className="flex items-center gap-2">
        <ThemeModeToggle />
      </div>
    </div>
  );
};
