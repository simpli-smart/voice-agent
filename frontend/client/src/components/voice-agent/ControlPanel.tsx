import React from 'react';
import { ConnectButton, UserAudioControl } from "@pipecat-ai/voice-ui-kit";

interface ControlPanelProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onConnect,
  onDisconnect,
}) => {
  return (
    <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
      <div className="flex items-center justify-center gap-6">
        <UserAudioControl size="md" classNames={{ button: 'w-50'}} />

        {/* Start/Stop Button */}
        <ConnectButton
          size="md"
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        />
      </div>
    </div>
  );
};
