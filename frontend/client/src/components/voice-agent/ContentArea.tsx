import React, { memo } from 'react';
import { Card, CardContent, ConversationProvider } from "@pipecat-ai/voice-ui-kit";
import { ConversationView } from './ConversationView';
import { Plasma } from './Plasma';

interface ContentAreaProps {
  currentView: 'visualizer' | 'conversation';
}

export const ContentArea: React.FC<ContentAreaProps> = memo(({ currentView }) => {
  return (
    <div className="flex-1 flex items-center justify-center px-6 max-h-[70vh]">
      <Card className="w-full max-w-6xl h-full">
        <CardContent className="p-6 h-full">
          {/* Main Content Area */}
          <div className="w-full h-full">
            {currentView === 'visualizer' ? (
              <div className="w-full h-[60vh] rounded-lg overflow-hidden relative">
                <Plasma />
              </div>
            ) : (
              <div className="w-full h-[60vh]">
                <ConversationProvider> 
                  <ConversationView />
                </ConversationProvider>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
