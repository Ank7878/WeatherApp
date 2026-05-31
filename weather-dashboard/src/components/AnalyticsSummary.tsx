import React from 'react';
import type { BulkAnalyticsResponse } from '../services/weatherApi';
import { MetricCard } from './MetricCard';

interface AnalyticsSummaryProps {
  data: BulkAnalyticsResponse;
}

export const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ data }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <MetricCard title="Average Temperature" value={`${data.averageTemperature}°C`} icon="🌡️" />
        <MetricCard title="Highest Temperature" value={`${data.highestTemperature.temp}°C`} subtitle={data.highestTemperature.city} icon="📈" />
        <MetricCard title="Lowest Temperature" value={`${data.lowestTemperature.temp}°C`} subtitle={data.lowestTemperature.city} icon="📉" />
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#dc2626' }}>🔥 Extreme Heat Zones (&gt;35°C)</h4>
        {data.hotCities.length > 0 ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {data.hotCities.map((city: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
              <span key={index} style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', padding: '5px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: 500 }}>
                {city}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>No tracked cities are currently exceeding critical heat levels.</p>
        )}
      </div>
    </div>
  );
};