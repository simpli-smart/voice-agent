import React, { useState, useRef, useEffect } from 'react';
import { X, Clock, Zap, Database, Mic, Brain, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@pipecat-ai/voice-ui-kit";
import { UnifiedTTFBGraph } from './UnifiedTTFBGraph';
import { useMetrics } from './MetricsContext';

interface MetricsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetricsDrawer: React.FC<MetricsDrawerProps> = ({ isOpen, onClose }) => {
  // Use metrics from context
  const { tokenUsage, cumulativeTokenUsage, ttfbMetrics, ttfbHistory } = useMetrics();
  
  // State for drawer width
  const [drawerWidth, setDrawerWidth] = useState(384); // Default 96 * 4 = 384px (w-96)
  const [isResizing, setIsResizing] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // Handle resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const deltaX = startXRef.current - e.clientX; // Inverted because we're dragging from the right
      const newWidth = Math.max(320, Math.min(800, startWidthRef.current + deltaX)); // Min 320px, Max 800px
      setDrawerWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = drawerWidth;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 ${isResizing ? 'cursor-col-resize' : ''}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        ref={drawerRef}
        className={`fixed right-0 top-0 h-full bg-background border-l border-border z-50 transform transition-transform duration-300 ease-in-out ${
          isResizing ? 'select-none' : ''
        }`}
        style={{ width: `${drawerWidth}px` }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Metrics</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Resize Handle */}
          <div
            className="absolute left-0 top-0 w-2 h-full cursor-col-resize group hover:bg-border/20 transition-colors"
            onMouseDown={handleResizeStart}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-0.5 h-8 bg-border group-hover:bg-border/60 transition-colors rounded-full" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Token Usage */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Database className="w-4 h-4" />
                  Token Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Prompt Tokens</span>
                  <span className="font-mono text-sm">{tokenUsage.promptTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completion Tokens</span>
                  <span className="font-mono text-sm">{tokenUsage.completionTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-sm font-medium">Total Tokens</span>
                  <span className="font-mono text-sm font-semibold">{tokenUsage.totalTokens.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Cumulative Token Usage */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Database className="w-4 h-4" />
                  Total Conversation Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Prompt Tokens</span>
                  <span className="font-mono text-sm">{cumulativeTokenUsage.promptTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Completion Tokens</span>
                  <span className="font-mono text-sm">{cumulativeTokenUsage.completionTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-sm font-medium">Total Tokens Used</span>
                  <span className="font-mono text-sm font-semibold">{cumulativeTokenUsage.totalTokens.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* STT Performance Graph */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mic className="w-4 h-4" />
                  Speech-to-Text Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ttfbHistory.length > 0 ? (
                  <UnifiedTTFBGraph 
                    data={ttfbHistory.map(point => ({ timestamp: point.timestamp, value: point.openaiSTT }))}
                    serviceName="STT Service"
                    color="#3b82f6"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Waiting for STT metrics...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* LLM Performance Graph */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="w-4 h-4" />
                  Language Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ttfbHistory.length > 0 ? (
                  <UnifiedTTFBGraph 
                    data={ttfbHistory.map(point => ({ timestamp: point.timestamp, value: point.openaiLLM }))}
                    serviceName="LLM Service"
                    color="#10b981"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Waiting for LLM metrics...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* TTS Performance Graph */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Volume2 className="w-4 h-4" />
                  Text-to-Speech Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ttfbHistory.length > 0 ? (
                  <UnifiedTTFBGraph 
                    data={ttfbHistory.map(point => ({ timestamp: point.timestamp, value: point.openaiTTS }))}
                    serviceName="TTS Service"
                    color="#f59e0b"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Waiting for TTS metrics...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="w-4 h-4" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p>Average response time across all services</p>
                  <p className="font-mono text-lg font-semibold mt-1">
                    {((ttfbMetrics.openaiSTT + ttfbMetrics.openaiLLM + ttfbMetrics.openaiTTS) / 3).toFixed(2)}ms
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
