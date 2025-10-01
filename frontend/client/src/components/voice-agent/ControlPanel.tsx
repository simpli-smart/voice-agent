import React from 'react';
import { Card, CardContent, ConnectButton, UserAudioControl, Button } from "@pipecat-ai/voice-ui-kit";
import { MessageCircleMore, BarChart3 } from 'lucide-react';

interface ControlPanelProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  currentView: 'visualizer' | 'conversation';
  onViewChange: (view: 'visualizer' | 'conversation') => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onConnect,
  onDisconnect,
  currentView,
  onViewChange,
}) => {
  return (
    <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-6">
            <UserAudioControl size="lg" />

            {/* View Toggle Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => onViewChange(currentView === 'visualizer' ? 'conversation' : 'visualizer')}
              className="flex items-center gap-2"
            >
              {currentView === 'visualizer' ? (
                <>
                  <MessageCircleMore className="w-4 h-4" />
                  Show Conversation
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  Show Visualizer
                </>
              )}
            </Button>

            {/* Start/Stop Button */}
            <ConnectButton
              size="lg"
              onConnect={onConnect}
              onDisconnect={onDisconnect}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
