import { Plasma as PlasmaComponent } from "@pipecat-ai/voice-ui-kit/webgl";
import { usePipecatClientMediaTrack } from "@pipecat-ai/client-react";
import { useMemo, useEffect, useState, memo } from "react";

export const Plasma = memo(() => {
  const assistantAudioTrack = usePipecatClientMediaTrack("audio", "bot");
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  
  // Listen for theme changes via DOM class changes
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const newTheme = isDark ? 'dark' : 'light';
      setCurrentTheme(newTheme);
    };
    
    // Set initial theme
    updateTheme();
    
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  const plasmaConfig = useMemo(() => {
    const isDark = currentTheme === 'dark';
    
    return {
      useCustomColors: true,
      color1: isDark ? "#2056ed" : "#3b82f6", // Blue - darker for light mode
      color2: isDark ? "#00d4ff" : "#06b6d4", // Cyan - darker for light mode  
      color3: isDark ? "#ff6b6b" : "#ef4444", // Red - darker for light mode
      backgroundColor: isDark ? "#000000" : "#ffffff", // Black for dark, white for light
      audioEnabled: true,
      audioSensitivity: 1.5,
      audioSmoothing: 0.8,
      frequencyBands: 32,
      bassResponse: 1.5,
      midResponse: 1.2,
      trebleResponse: 1.0,
      plasmaVolumeReactivity: 3.0,
      volumeThreshold: 0.1,
    };
  }, [currentTheme]);

  // Only re-render when theme changes, not on every view toggle
  return <PlasmaComponent key={currentTheme} initialConfig={plasmaConfig} audioTrack={assistantAudioTrack} />;
});