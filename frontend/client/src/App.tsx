import React from 'react';
import { FullScreenContainer, ThemeProvider } from "@pipecat-ai/voice-ui-kit";
import { VoiceAgent } from './components/voice-agent';

interface AppProps {
  defaultTheme?: "system" | "light" | "dark";
  storageKey?: string;
}

export const App: React.FC<AppProps> = ({
  defaultTheme = "system",
  storageKey = "voice-ui-kit-theme"
}) => {
  return (
    <ThemeProvider defaultTheme={defaultTheme} storageKey={storageKey}>
      <FullScreenContainer>
        <VoiceAgent />
      </FullScreenContainer>
    </ThemeProvider>
  );
};
