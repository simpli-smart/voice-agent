import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TTFBDataPoint {
  timestamp: string;
  value: number;
}

interface UnifiedTTFBGraphProps {
  data: TTFBDataPoint[];
  serviceName: string;
  color: string;
  height?: string;
}

export const UnifiedTTFBGraph: React.FC<UnifiedTTFBGraphProps> = ({ 
  data, 
  serviceName, 
  color, 
  height = "h-64" 
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatTooltipValue = (value: number) => {
    return `${value.toFixed(2)}ms`;
  };

  return (
    <div className={`${height} w-full`}>
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
            formatter={(value: number) => [formatTooltipValue(value), serviceName]}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
