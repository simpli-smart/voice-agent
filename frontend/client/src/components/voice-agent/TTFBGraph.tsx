import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TTFBDataPoint {
  timestamp: string;
  openaiSTT: number;
  openaiLLM: number;
  openaiTTS: number;
}

interface TTFBGraphProps {
  data: TTFBDataPoint[];
}

export const TTFBGraph: React.FC<TTFBGraphProps> = ({ data }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatTooltipValue = (value: number) => {
    return `${value.toFixed(2)}ms`;
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatTime}
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }}
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            labelFormatter={(value) => `Time: ${formatTime(value)}`}
            formatter={(value: number, name: string) => [formatTooltipValue(value), name]}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="openaiSTT" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="STT Service"
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="openaiLLM" 
            stroke="#10b981" 
            strokeWidth={2}
            name="LLM Service"
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="openaiTTS" 
            stroke="#f59e0b" 
            strokeWidth={2}
            name="TTS Service"
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
