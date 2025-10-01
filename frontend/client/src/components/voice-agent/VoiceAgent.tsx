import React, { useState, useEffect } from 'react';
import { PipecatAppBase } from "@pipecat-ai/voice-ui-kit";
import { Toolbar } from './Toolbar';
import { ContentArea } from './ContentArea';
import { ControlPanel } from './ControlPanel';
import { ViewControls } from './ViewControls';
import { MetricsProvider } from './MetricsContext';

// Separate component to handle client initialization and view state
const VoiceAgentContent: React.FC<{
  client: any;
  handleConnect?: () => void | Promise<void>;
  handleDisconnect?: () => void | Promise<void>;
  error?: string | null;
}> = ({ client, handleConnect, handleDisconnect, error }) => {
  // Move view state inside this component to prevent PipecatAppBase re-rendering
  const [currentView, setCurrentView] = useState<'visualizer' | 'conversation'>('visualizer');

  const handleViewChange = (view: 'visualizer' | 'conversation') => {
    setCurrentView(view);
  };

  // Initialize devices when client is available
  useEffect(() => {
    if (client) {
      client.initDevices();
    }
  }, [client]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 m-4">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* View Controls */}
      <ViewControls
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      {/* Content Area */}
      <ContentArea currentView={currentView} />

      {/* Bottom Controls */}
      <ControlPanel
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
};

export const VoiceAgent: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <PipecatAppBase
          key="voice-agent-connection"
          connectParams={{
            webrtcUrl: "/api/offer",
          }}
          transportType="smallwebrtc"
        >
          {({ client, handleConnect, handleDisconnect, error }) => (
            <MetricsProvider client={client}>
              {/* Top Toolbar */}
              <Toolbar title="Test Voice Agent" />
              
              <VoiceAgentContent
                client={client}
                handleConnect={handleConnect}
                handleDisconnect={handleDisconnect}
                error={error}
              />
            </MetricsProvider>
          )}
        </PipecatAppBase>
      </div>
    </div>
  );
};