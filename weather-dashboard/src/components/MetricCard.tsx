import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      flex: 1,
      minWidth: '150px'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '5px' }}>{icon}</div>
      <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>{title}</p>
      <h3 style={{ margin: '5px 0 0 0', fontSize: '24px', color: '#1f2937' }}>{value}</h3>
      {subtitle && <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#4b5563' }}>{subtitle}</p>}
    </div>
  );
};