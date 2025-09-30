import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

interface TTFBMetrics {
  openaiSTT: number;
  openaiLLM: number;
  openaiTTS: number;
}

interface PipecatMetricData {
  processor: string;
  value: number;
}

interface PipecatMetricsData {
  processing?: PipecatMetricData[];
  ttfb?: PipecatMetricData[];
  characters?: PipecatMetricData[];
}

interface TTFBDataPoint {
  timestamp: string;
  openaiSTT: number;
  openaiLLM: number;
  openaiTTS: number;
}

interface MetricsContextType {
  tokenUsage: TokenUsage;
  cumulativeTokenUsage: TokenUsage;
  ttfbMetrics: TTFBMetrics;
  ttfbHistory: TTFBDataPoint[];
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

interface MetricsProviderProps {
  children: ReactNode;
  client?: any;
}

export const MetricsProvider: React.FC<MetricsProviderProps> = ({ children, client }) => {
  const [tokenUsage, setTokenUsage] = useState<TokenUsage>({
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0
  });
  
  const [ttfbMetrics, setTtfbMetrics] = useState<TTFBMetrics>({
    openaiSTT: 0,
    openaiLLM: 0,
    openaiTTS: 0
  });

  const [ttfbHistory, setTtfbHistory] = useState<TTFBDataPoint[]>([]);
  const [cumulativeTokenUsage, setCumulativeTokenUsage] = useState<TokenUsage>({
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0
  });

  // Extract metrics from client
  useEffect(() => {
    if (client) {
      // Listen for metrics events from the client
      const handleMetrics = (data: PipecatMetricsData) => {
        // Extract TTFB metrics
        if (data.ttfb) {
          const ttfbData: TTFBMetrics = {
            openaiSTT: 0,
            openaiLLM: 0,
            openaiTTS: 0
          };
          
          data.ttfb.forEach(metric => {
            if (metric.processor.toLowerCase().includes('stt')) {
              ttfbData.openaiSTT = metric.value * 1000; // Convert seconds to milliseconds
            } else if (metric.processor.toLowerCase().includes('llm')) {
              ttfbData.openaiLLM = metric.value * 1000; // Convert seconds to milliseconds
            } else if (metric.processor.toLowerCase().includes('tts')) {
              ttfbData.openaiTTS = metric.value * 1000; // Convert seconds to milliseconds
            }
          });
          
          setTtfbMetrics(ttfbData);
          
          // Add to historical data for the graph
          const timestamp = new Date().toISOString();
          const newDataPoint: TTFBDataPoint = {
            timestamp,
            openaiSTT: ttfbData.openaiSTT,
            openaiLLM: ttfbData.openaiLLM,
            openaiTTS: ttfbData.openaiTTS
          };
          
          setTtfbHistory(prev => {
            const updated = [...prev, newDataPoint];
            // Keep only the last 50 data points to prevent memory issues
            return updated.slice(-50);
          });
        }

        // Extract character usage (as a proxy for token usage)
        if (data.characters) {
          let totalCharacters = 0;
          data.characters.forEach(metric => {
            totalCharacters += metric.value;
          });
          
          // Rough estimation: 1 token ≈ 4 characters for English text
          const estimatedTokens = Math.round(totalCharacters / 4);
          const newTokenUsage = {
            promptTokens: Math.round(estimatedTokens * 0.6), // Rough split
            completionTokens: Math.round(estimatedTokens * 0.4),
            totalTokens: estimatedTokens
          };
          
          setTokenUsage(newTokenUsage);
          
          // Add to cumulative token usage for the entire conversation
          setCumulativeTokenUsage(prev => ({
            promptTokens: prev.promptTokens + newTokenUsage.promptTokens,
            completionTokens: prev.completionTokens + newTokenUsage.completionTokens,
            totalTokens: prev.totalTokens + newTokenUsage.totalTokens
          }));
        }
      };

      // Set up metrics listener
      client.on('metrics', handleMetrics);

      // Cleanup listener on unmount
      return () => {
        client.off('metrics', handleMetrics);
      };
    }
  }, [client]);

  const value: MetricsContextType = {
    tokenUsage,
    cumulativeTokenUsage,
    ttfbMetrics,
    ttfbHistory
  };

  return (
    <MetricsContext.Provider value={value}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = (): MetricsContextType => {
  const context = useContext(MetricsContext);
  if (context === undefined) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
};
